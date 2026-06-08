"""
core/urls.py
NovaWings – app-level URL routing for the single core app.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views

urlpatterns = [

    # ─── AUTH ────────────────────────────────────────────────────────────
    path("auth/register/",        views.RegisterView.as_view(),        name="auth-register"),
    path("auth/login/",           TokenObtainPairView.as_view(),       name="auth-login"),
    path("auth/token/refresh/",   TokenRefreshView.as_view(),          name="auth-token-refresh"),
    path("auth/logout/",          views.LogoutView.as_view(),          name="auth-logout"),
    path("auth/profile/",         views.ProfileView.as_view(),         name="auth-profile"),
    path("auth/change-password/", views.ChangePasswordView.as_view(),  name="auth-change-password"),

    # ─── DESTINATIONS ─────────────────────────────────────────────────────
    path("destinations/", views.DestinationListView.as_view(), name="destination-list"),

    # ─── SCHOLARSHIPS (public) ────────────────────────────────────────────
    path("scholarships/",               views.ScholarshipListView.as_view(),   name="scholarship-list"),
    path("scholarships/<slug:slug>/",   views.ScholarshipDetailView.as_view(), name="scholarship-detail"),
    path("scholarships/<slug:slug>/apply/",  views.ApplyScholarshipView.as_view(),  name="scholarship-apply"),
    path("scholarships/<slug:slug>/unlock/", views.InitiateUnlockView.as_view(),    name="scholarship-unlock"),

    # ─── STUDENT APPLICATIONS ────────────────────────────────────────────
    path("applications/my/",                  views.MyScholarshipApplicationsView.as_view(),  name="my-applications"),
    path("applications/<uuid:pk>/",           views.ScholarshipApplicationDetailView.as_view(), name="application-detail"),
    path("applications/<uuid:pk>/documents/", views.UploadApplicationDocumentView.as_view(),    name="application-docs"),

    # ─── PAYMENTS ────────────────────────────────────────────────────────
    path("payments/verify/", views.VerifyUnlockView.as_view(), name="payment-verify"),

    # ─── JOBS (public) ───────────────────────────────────────────────────
    path("jobs/categories/",        views.JobCategoryListView.as_view(), name="job-category-list"),
    path("jobs/",                   views.JobListView.as_view(),          name="job-list"),
    path("jobs/<slug:slug>/",       views.JobDetailView.as_view(),        name="job-detail"),
    path("jobs/<slug:slug>/apply/", views.ApplyJobView.as_view(),         name="job-apply"),

    # ─── JOB APPLICATIONS (student) ──────────────────────────────────────
    path("job-applications/my/",                  views.MyJobApplicationsView.as_view(),    name="my-job-applications"),
    path("job-applications/<uuid:pk>/documents/", views.UploadJobDocumentView.as_view(),    name="job-application-docs"),

    # ─── CONTACT ─────────────────────────────────────────────────────────
    path("contact/", views.ContactEnquiryView.as_view(), name="contact"),

    # ─── NOTIFICATIONS ────────────────────────────────────────────────────
    path("notifications/",               views.NotificationListView.as_view(),          name="notifications"),
    path("notifications/read-all/",      views.MarkAllNotificationsReadView.as_view(),  name="notifications-read-all"),
    path("notifications/<int:pk>/read/", views.MarkNotificationReadView.as_view(),      name="notification-read"),

    # ─── DASHBOARD ────────────────────────────────────────────────────────
    path("dashboard/stats/", views.StudentDashboardStatsView.as_view(), name="dashboard-stats"),

    # ─── ADMIN / STAFF ───────────────────────────────────────────────────
    path("admin/scholarships/",                        views.ScholarshipAdminView.as_view(),          name="admin-scholarship-list"),
    path("admin/scholarships/<slug:slug>/",            views.ScholarshipAdminDetailView.as_view(),    name="admin-scholarship-detail"),
    path("admin/applications/",                        views.AdminScholarshipApplicationsView.as_view(), name="admin-applications"),
    path("admin/applications/<uuid:pk>/stage/",        views.UpdateApplicationStageView.as_view(),    name="admin-application-stage"),
    path("admin/jobs/",                                views.JobAdminView.as_view(),                  name="admin-job-list"),
    path("admin/jobs/<slug:slug>/",                    views.JobAdminDetailView.as_view(),            name="admin-job-detail"),
    path("admin/job-applications/",                    views.AdminJobApplicationsView.as_view(),      name="admin-job-applications"),
]