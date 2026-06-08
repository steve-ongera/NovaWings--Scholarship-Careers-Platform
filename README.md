#  NovaWings — Scholarship & Careers Platform

**NovaWings** is a Nairobi-based full-stack web platform offering scholarship opportunities to Canada, Australia, USA, and the UK for students pursuing Degree, Masters, and PhD programs. It also features a careers/jobs board with document-upload applications, visa assistance, and application tracking.

---

## Full Project Structure

```
novawings/
│
├── backend/                            # Django backend (single core app)
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   │
│   ├── novawings_backend/              # Django project config
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   │
│   └── core/                          # Single Django app: all models, views, serializers
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── models.py                  # All data models
│       ├── serializers.py             # DRF serializers
│       ├── views.py                   # All API views
│       ├── urls.py                    # App-level URL routing
│       ├── permissions.py             # Custom DRF permissions
│       ├── filters.py                 # DRF filters
│       ├── utils.py                   # Helpers (Mpesa, Paypal, email, etc.)
│       └── migrations/
│           └── 0001_initial.py
│
└── frontend/                          # React frontend (Vite)
    ├── index.html                     # Entry HTML (Bootstrap Icons, SEO meta)
    ├── main.jsx                       # React DOM entry
    ├── app.jsx                        # App router
    ├── vite.config.js
    ├── package.json
    │
    ├── styles/
    │   └── main.css                   # Global styles, CSS variables, utilities
    │
    ├── services/
    │   └── api.js                     # Axios instance + all API calls
    │
    ├── components/
    │   ├── Navbar.jsx                 # Public navbar (responsive, mobile drawer)
    │   ├── Footer.jsx                 # Public footer
    │   ├── PortalNavbar.jsx           # Dashboard top navbar
    │   └── Sidebar.jsx                # Dashboard sidebar
    │
    └── pages/
        ├── Index.jsx                  # Homepage
        ├── About.jsx                  # About NovaWings
        ├── Contact.jsx                # Contact form
        ├── Services.jsx               # Services overview
        ├── Scholarship.jsx            # Scholarship listing (free/premium/gold)
        ├── Careers.jsx                # Job listings page
        ├── Login.jsx                  # User login
        ├── Register.jsx               # User registration
        ├── StudentDashboard.jsx       # Student scholarship portal
        └── AppJob.jsx                 # Job application page
```

---

##  Tech Stack

| Layer      | Technology                                         |
|------------|----------------------------------------------------|
| Backend    | Django 5.x, Django REST Framework, SimpleJWT       |
| Database   | PostgreSQL (dev: SQLite)                           |
| Auth       | JWT (access + refresh tokens)                      |
| Payments   | M-Pesa (Daraja API), PayPal REST SDK, Visa/Stripe  |
| Storage    | Django media files / AWS S3 (production)           |
| Frontend   | React 18, Vite, React Router v6, Axios             |
| Styling    | Custom CSS + Bootstrap Icons                       |
| Email      | Django Email (SMTP / SendGrid)                     |

---

##  Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env              # Fill in secrets
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### requirements.txt
```
Django>=5.0
djangorestframework
djangorestframework-simplejwt
django-cors-headers
django-environ
Pillow
psycopg2-binary
django-filter
stripe
paypalrestsdk
requests
```

---

##  Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

##  Scholarship Tiers

| Tier    | Cost      | Payment Methods              |
|---------|-----------|------------------------------|
| Free    | $0        | None — direct apply          |
| Premium | $5–$20    | M-Pesa / PayPal / Visa card  |
| Gold    | $25–$50   | M-Pesa / PayPal / Visa card  |

---

##  Application Tracking Stages

```
SUBMITTED → UNDER REVIEW → DOCUMENTS VERIFIED → VISA PROCESSING → APPROVED / REJECTED
```

---

##  API Base URL

```
http://localhost:8000/api/
```

---

##  Key Endpoints Summary

| Method | Endpoint                              | Description                      |
|--------|---------------------------------------|----------------------------------|
| POST   | /api/auth/register/                   | Register new user                |
| POST   | /api/auth/login/                      | Obtain JWT tokens                |
| POST   | /api/auth/token/refresh/              | Refresh access token             |
| GET    | /api/scholarships/                    | List all scholarships            |
| POST   | /api/scholarships/{id}/apply/         | Apply to a scholarship           |
| POST   | /api/scholarships/{id}/unlock/        | Unlock premium/gold scholarship  |
| GET    | /api/applications/my/                 | Student's applications           |
| GET    | /api/jobs/                            | List job postings                |
| POST   | /api/jobs/{id}/apply/                 | Apply to a job                   |
| GET    | /api/payments/verify/{ref}/           | Verify payment                   |

---

##  Frontend Routes

| Route                   | Component           | Access    |
|-------------------------|---------------------|-----------|
| /                       | Index               | Public    |
| /about                  | About               | Public    |
| /contact                | Contact             | Public    |
| /services               | Services            | Public    |
| /scholarships           | Scholarship         | Public    |
| /careers                | Careers             | Public    |
| /login                  | Login               | Public    |
| /register               | Register            | Public    |
| /dashboard              | StudentDashboard    | Auth only |
| /jobs/:id/apply         | AppJob              | Auth only |

---

##  Document Types Accepted

- Passport / National ID (PDF, JPG, PNG)
- Academic Transcripts (PDF)
- Recommendation Letters (PDF, DOCX)
- CV / Resume (PDF, DOCX)
- Personal Statement (PDF, DOCX)
- Visa Copy (PDF, JPG) — optional; NovaWings can assist

---

##  Contact

**NovaWings HQ** — Nairobi, Kenya  
 info@novawings.co.ke |  www.novawings.co.ke