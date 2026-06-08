/**
 * services/api.js
 * NovaWings — centralised Axios API service.
 * All backend calls go through this file.
 */

import axios from "axios";

// ─────────────────────────────────────────────
// AXIOS INSTANCE
// ─────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// ── Request interceptor: attach JWT access token ──────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: auto-refresh on 401 ─────────────────
let isRefreshing = false;
let failedQueue  = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch(Promise.reject);
      }

      original._retry = true;
      isRefreshing     = true;

      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        authService.logout();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/token/refresh/`, { refresh });
        localStorage.setItem("access_token", data.access);
        api.defaults.headers.common.Authorization = `Bearer ${data.access}`;
        processQueue(null, data.access);
        return api(original);
      } catch (err) {
        processQueue(err, null);
        authService.logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);


// ─────────────────────────────────────────────
// AUTH SERVICE
// ─────────────────────────────────────────────

export const authService = {
  register: (data) =>
    api.post("/auth/register/", data),

  login: async (credentials) => {
    const res = await api.post("/auth/login/", credentials);
    localStorage.setItem("access_token",  res.data.access);
    localStorage.setItem("refresh_token", res.data.refresh);
    return res;
  },

  logout: () => {
    const refresh = localStorage.getItem("refresh_token");
    if (refresh) api.post("/auth/logout/", { refresh }).catch(() => {});
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  },

  getProfile:    () => api.get("/auth/profile/"),
  updateProfile: (data) => {
    const isFormData = data instanceof FormData;
    return api.patch("/auth/profile/", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
  },
  changePassword: (data) => api.post("/auth/change-password/", data),

  isAuthenticated: () => !!localStorage.getItem("access_token"),
};


// ─────────────────────────────────────────────
// DESTINATION SERVICE
// ─────────────────────────────────────────────

export const destinationService = {
  list: () => api.get("/destinations/"),
};


// ─────────────────────────────────────────────
// SCHOLARSHIP SERVICE
// ─────────────────────────────────────────────

export const scholarshipService = {
  list:   (params = {}) => api.get("/scholarships/", { params }),
  detail: (slug)         => api.get(`/scholarships/${slug}/`),

  apply: (slug, data) =>
    api.post(`/scholarships/${slug}/apply/`, data),

  unlock: (slug, data) =>
    api.post(`/scholarships/${slug}/unlock/`, data),

  // Admin
  adminList:   (params = {}) => api.get("/admin/scholarships/", { params }),
  adminCreate: (data)         => api.post("/admin/scholarships/", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  }),
  adminUpdate: (slug, data) => api.patch(`/admin/scholarships/${slug}/`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  }),
  adminDelete: (slug) => api.delete(`/admin/scholarships/${slug}/`),
};


// ─────────────────────────────────────────────
// APPLICATION SERVICE
// ─────────────────────────────────────────────

export const applicationService = {
  myList:  ()     => api.get("/applications/my/"),
  detail:  (id)   => api.get(`/applications/${id}/`),

  uploadDocument: (appId, formData) =>
    api.post(`/applications/${appId}/documents/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin
  adminList:   (params = {}) => api.get("/admin/applications/", { params }),
  updateStage: (id, data)    => api.patch(`/admin/applications/${id}/stage/`, data),
};


// ─────────────────────────────────────────────
// PAYMENT SERVICE
// ─────────────────────────────────────────────

export const paymentService = {
  verify: (data) => api.post("/payments/verify/", data),
};


// ─────────────────────────────────────────────
// JOB SERVICE
// ─────────────────────────────────────────────

export const jobService = {
  categories: ()           => api.get("/jobs/categories/"),
  list:        (params = {}) => api.get("/jobs/", { params }),
  detail:      (slug)        => api.get(`/jobs/${slug}/`),
  apply:       (slug, data)  => api.post(`/jobs/${slug}/apply/`, data),

  // Admin
  adminList:   (params = {}) => api.get("/admin/jobs/", { params }),
  adminCreate: (data)         => api.post("/admin/jobs/", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : {},
  }),
  adminUpdate: (slug, data) => api.patch(`/admin/jobs/${slug}/`, data),
  adminDelete: (slug)        => api.delete(`/admin/jobs/${slug}/`),
};


// ─────────────────────────────────────────────
// JOB APPLICATION SERVICE
// ─────────────────────────────────────────────

export const jobApplicationService = {
  myList: () => api.get("/job-applications/my/"),

  uploadDocument: (appId, formData) =>
    api.post(`/job-applications/${appId}/documents/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin
  adminList: (params = {}) => api.get("/admin/job-applications/", { params }),
};


// ─────────────────────────────────────────────
// CONTACT SERVICE
// ─────────────────────────────────────────────

export const contactService = {
  submit: (data) => api.post("/contact/", data),
};


// ─────────────────────────────────────────────
// NOTIFICATION SERVICE
// ─────────────────────────────────────────────

export const notificationService = {
  list:       ()    => api.get("/notifications/"),
  markRead:   (id)  => api.patch(`/notifications/${id}/read/`),
  markAllRead: ()   => api.patch("/notifications/read-all/"),
};


// ─────────────────────────────────────────────
// DASHBOARD SERVICE
// ─────────────────────────────────────────────

export const dashboardService = {
  stats: () => api.get("/dashboard/stats/"),
};


export default api;