"""
core/models.py
NovaWings – all platform models in a single Django app.
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import uuid


# ─────────────────────────────────────────────
# AUTH / USER
# ─────────────────────────────────────────────

class User(AbstractUser):
    """Extended user model for students, staff, and admins."""

    ROLE_STUDENT = "student"
    ROLE_STAFF   = "staff"
    ROLE_ADMIN   = "admin"
    ROLE_CHOICES = [
        (ROLE_STUDENT, "Student"),
        (ROLE_STAFF,   "Staff"),
        (ROLE_ADMIN,   "Admin"),
    ]

    role          = models.CharField(max_length=20, choices=ROLE_CHOICES, default=ROLE_STUDENT)
    phone         = models.CharField(max_length=20, blank=True)
    country       = models.CharField(max_length=100, blank=True, default="Kenya")
    city          = models.CharField(max_length=100, blank=True)
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)
    bio           = models.TextField(blank=True)
    is_verified   = models.BooleanField(default=False)
    created_at    = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.get_full_name() or self.username} ({self.role})"

    @property
    def full_name(self):
        return self.get_full_name() or self.username


# ─────────────────────────────────────────────
# COUNTRY / DESTINATION
# ─────────────────────────────────────────────

class Destination(models.Model):
    """Study destination countries supported by NovaWings."""
    name      = models.CharField(max_length=100, unique=True)   # e.g. Canada, USA
    code      = models.CharField(max_length=5, unique=True)     # e.g. CA, US
    flag_emoji = models.CharField(max_length=10, blank=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


# ─────────────────────────────────────────────
# SCHOLARSHIP
# ─────────────────────────────────────────────

class Scholarship(models.Model):
    """A scholarship listing on the platform."""

    TIER_FREE    = "free"
    TIER_PREMIUM = "premium"
    TIER_GOLD    = "gold"
    TIER_CHOICES = [
        (TIER_FREE,    "Free"),
        (TIER_PREMIUM, "Premium"),
        (TIER_GOLD,    "Gold"),
    ]

    LEVEL_DEGREE  = "degree"
    LEVEL_MASTERS = "masters"
    LEVEL_PHD     = "phd"
    LEVEL_CHOICES = [
        (LEVEL_DEGREE,  "Degree / Undergraduate"),
        (LEVEL_MASTERS, "Masters"),
        (LEVEL_PHD,     "PhD"),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True, max_length=280)
    destination  = models.ForeignKey(Destination, on_delete=models.SET_NULL, null=True, related_name="scholarships")
    level        = models.CharField(max_length=20, choices=LEVEL_CHOICES)
    tier         = models.CharField(max_length=20, choices=TIER_CHOICES, default=TIER_FREE)
    description  = models.TextField()
    requirements = models.TextField(blank=True, help_text="Comma-separated or freeform requirements")
    benefits     = models.TextField(blank=True, help_text="What the scholarship covers")
    amount_usd   = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, help_text="Unlock fee in USD (premium/gold only)")
    amount_kes   = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, help_text="Unlock fee in KES")
    deadline     = models.DateField(null=True, blank=True)
    cover_image  = models.ImageField(upload_to="scholarships/", null=True, blank=True)
    university   = models.CharField(max_length=255, blank=True)
    field_of_study = models.CharField(max_length=255, blank=True)
    is_active    = models.BooleanField(default=True)
    is_featured  = models.BooleanField(default=False)
    visa_assistance = models.BooleanField(default=False, help_text="NovaWings will assist with visa processing")
    created_by   = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="scholarships_created")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]
        verbose_name = "Scholarship"
        verbose_name_plural = "Scholarships"

    def __str__(self):
        return f"[{self.get_tier_display().upper()}] {self.title} — {self.destination}"

    @property
    def is_paid(self):
        return self.tier in (self.TIER_PREMIUM, self.TIER_GOLD)

    @property
    def is_expired(self):
        return self.deadline and self.deadline < timezone.now().date()


# ─────────────────────────────────────────────
# SCHOLARSHIP UNLOCK (payment gate)
# ─────────────────────────────────────────────

class ScholarshipUnlock(models.Model):
    """Records a user's successful payment to unlock a paid scholarship."""

    METHOD_MPESA  = "mpesa"
    METHOD_PAYPAL = "paypal"
    METHOD_CARD   = "card"
    METHOD_CHOICES = [
        (METHOD_MPESA,  "M-Pesa"),
        (METHOD_PAYPAL, "PayPal"),
        (METHOD_CARD,   "Visa / Card"),
    ]

    STATUS_PENDING  = "pending"
    STATUS_SUCCESS  = "success"
    STATUS_FAILED   = "failed"
    STATUS_CHOICES  = [
        (STATUS_PENDING, "Pending"),
        (STATUS_SUCCESS, "Success"),
        (STATUS_FAILED,  "Failed"),
    ]

    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name="unlocks")
    scholarship  = models.ForeignKey(Scholarship, on_delete=models.CASCADE, related_name="unlocks")
    amount_paid  = models.DecimalField(max_digits=12, decimal_places=2)
    currency     = models.CharField(max_length=5, default="USD")
    method       = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    reference    = models.CharField(max_length=200, blank=True, help_text="Payment gateway reference")
    unlocked_at  = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "scholarship")
        verbose_name = "Scholarship Unlock"

    def __str__(self):
        return f"{self.user} unlocked {self.scholarship.title} via {self.method}"

    def mark_success(self, reference=""):
        self.status = self.STATUS_SUCCESS
        self.reference = reference
        self.unlocked_at = timezone.now()
        self.save()


# ─────────────────────────────────────────────
# SCHOLARSHIP APPLICATION
# ─────────────────────────────────────────────

class ScholarshipApplication(models.Model):
    """A student's application for a scholarship."""

    STAGE_SUBMITTED  = "submitted"
    STAGE_REVIEWING  = "under_review"
    STAGE_DOCS_OK    = "documents_verified"
    STAGE_VISA       = "visa_processing"
    STAGE_APPROVED   = "approved"
    STAGE_REJECTED   = "rejected"
    STAGE_CHOICES = [
        (STAGE_SUBMITTED, "Submitted"),
        (STAGE_REVIEWING, "Under Review"),
        (STAGE_DOCS_OK,   "Documents Verified"),
        (STAGE_VISA,      "Visa Processing"),
        (STAGE_APPROVED,  "Approved"),
        (STAGE_REJECTED,  "Rejected"),
    ]

    id            = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user          = models.ForeignKey(User, on_delete=models.CASCADE, related_name="scholarship_applications")
    scholarship   = models.ForeignKey(Scholarship, on_delete=models.CASCADE, related_name="applications")
    stage         = models.CharField(max_length=30, choices=STAGE_CHOICES, default=STAGE_SUBMITTED)
    personal_statement = models.TextField(blank=True)
    needs_visa_help    = models.BooleanField(default=False)
    visa_status        = models.CharField(max_length=100, blank=True)
    admin_notes        = models.TextField(blank=True)
    submitted_at  = models.DateTimeField(auto_now_add=True)
    updated_at    = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "scholarship")
        ordering = ["-submitted_at"]
        verbose_name = "Scholarship Application"

    def __str__(self):
        return f"{self.user.username} → {self.scholarship.title} [{self.stage}]"


class ApplicationStageLog(models.Model):
    """Audit log every time an application stage changes."""
    application  = models.ForeignKey(ScholarshipApplication, on_delete=models.CASCADE, related_name="stage_logs")
    from_stage   = models.CharField(max_length=30, blank=True)
    to_stage     = models.CharField(max_length=30)
    changed_by   = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    note         = models.TextField(blank=True)
    changed_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.application} | {self.from_stage} → {self.to_stage}"


# ─────────────────────────────────────────────
# APPLICATION DOCUMENTS
# ─────────────────────────────────────────────

class ApplicationDocument(models.Model):
    """Documents uploaded by a student for a scholarship application."""

    TYPE_PASSPORT     = "passport"
    TYPE_TRANSCRIPT   = "transcript"
    TYPE_RECOMMENDATION = "recommendation"
    TYPE_CV           = "cv"
    TYPE_PERSONAL_STATEMENT = "personal_statement"
    TYPE_VISA         = "visa"
    TYPE_OTHER        = "other"
    TYPE_CHOICES = [
        (TYPE_PASSPORT,           "Passport / National ID"),
        (TYPE_TRANSCRIPT,         "Academic Transcripts"),
        (TYPE_RECOMMENDATION,     "Recommendation Letter"),
        (TYPE_CV,                 "CV / Resume"),
        (TYPE_PERSONAL_STATEMENT, "Personal Statement"),
        (TYPE_VISA,               "Visa Copy"),
        (TYPE_OTHER,              "Other"),
    ]

    application  = models.ForeignKey(ScholarshipApplication, on_delete=models.CASCADE, related_name="documents")
    doc_type     = models.CharField(max_length=40, choices=TYPE_CHOICES)
    file         = models.FileField(upload_to="applications/docs/")
    file_name    = models.CharField(max_length=255, blank=True)
    is_verified  = models.BooleanField(default=False)
    uploaded_at  = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.file and not self.file_name:
            self.file_name = self.file.name.split("/")[-1]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.get_doc_type_display()} — {self.application}"


# ─────────────────────────────────────────────
# JOB / CAREERS
# ─────────────────────────────────────────────

class JobCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Bootstrap icon class e.g. bi-briefcase")

    class Meta:
        verbose_name_plural = "Job Categories"

    def __str__(self):
        return self.name


class Job(models.Model):
    """A job / career advertisement."""

    TYPE_FULL_TIME  = "full_time"
    TYPE_PART_TIME  = "part_time"
    TYPE_INTERNSHIP = "internship"
    TYPE_CONTRACT   = "contract"
    TYPE_CHOICES = [
        (TYPE_FULL_TIME,  "Full Time"),
        (TYPE_PART_TIME,  "Part Time"),
        (TYPE_INTERNSHIP, "Internship"),
        (TYPE_CONTRACT,   "Contract"),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title        = models.CharField(max_length=255)
    slug         = models.SlugField(unique=True, max_length=280)
    company      = models.CharField(max_length=200)
    company_logo = models.ImageField(upload_to="jobs/logos/", null=True, blank=True)
    category     = models.ForeignKey(JobCategory, on_delete=models.SET_NULL, null=True, related_name="jobs")
    location     = models.CharField(max_length=200, blank=True)
    job_type     = models.CharField(max_length=20, choices=TYPE_CHOICES, default=TYPE_FULL_TIME)
    description  = models.TextField()
    requirements = models.TextField(blank=True)
    salary_range = models.CharField(max_length=100, blank=True, help_text="e.g. KES 80,000 – 120,000")
    deadline     = models.DateField(null=True, blank=True)
    is_active    = models.BooleanField(default=True)
    is_featured  = models.BooleanField(default=False)
    posted_by    = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="jobs_posted")
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-is_featured", "-created_at"]
        verbose_name = "Job"
        verbose_name_plural = "Jobs"

    def __str__(self):
        return f"{self.title} @ {self.company}"

    @property
    def is_expired(self):
        return self.deadline and self.deadline < timezone.now().date()


class JobApplication(models.Model):
    """A candidate's application for a job listing."""

    STATUS_PENDING   = "pending"
    STATUS_REVIEWING = "reviewing"
    STATUS_SHORTLIST = "shortlisted"
    STATUS_REJECTED  = "rejected"
    STATUS_HIRED     = "hired"
    STATUS_CHOICES   = [
        (STATUS_PENDING,   "Pending"),
        (STATUS_REVIEWING, "Reviewing"),
        (STATUS_SHORTLIST, "Shortlisted"),
        (STATUS_REJECTED,  "Rejected"),
        (STATUS_HIRED,     "Hired"),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_applications")
    job          = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")
    cover_letter = models.TextField(blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    admin_notes  = models.TextField(blank=True)
    applied_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "job")
        ordering = ["-applied_at"]
        verbose_name = "Job Application"

    def __str__(self):
        return f"{self.user.username} → {self.job.title} [{self.status}]"


class JobApplicationDocument(models.Model):
    """Documents (CV, cover letter images, certs) uploaded for a job application."""

    application = models.ForeignKey(JobApplication, on_delete=models.CASCADE, related_name="documents")
    doc_type    = models.CharField(max_length=50, default="other")
    file        = models.FileField(upload_to="jobs/docs/")
    file_name   = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.file and not self.file_name:
            self.file_name = self.file.name.split("/")[-1]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.doc_type} — {self.application}"


# ─────────────────────────────────────────────
# PAYMENT / TRANSACTIONS
# ─────────────────────────────────────────────

class Payment(models.Model):
    """Unified payment record for any platform transaction."""

    METHOD_MPESA  = "mpesa"
    METHOD_PAYPAL = "paypal"
    METHOD_CARD   = "card"
    METHOD_CHOICES = [
        (METHOD_MPESA,  "M-Pesa"),
        (METHOD_PAYPAL, "PayPal"),
        (METHOD_CARD,   "Visa / Card"),
    ]

    STATUS_PENDING  = "pending"
    STATUS_SUCCESS  = "success"
    STATUS_FAILED   = "failed"
    STATUS_REFUNDED = "refunded"
    STATUS_CHOICES  = [
        (STATUS_PENDING,  "Pending"),
        (STATUS_SUCCESS,  "Success"),
        (STATUS_FAILED,   "Failed"),
        (STATUS_REFUNDED, "Refunded"),
    ]

    PURPOSE_SCHOLARSHIP = "scholarship_unlock"
    PURPOSE_CHOICES = [
        (PURPOSE_SCHOLARSHIP, "Scholarship Unlock"),
    ]

    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="payments")
    purpose      = models.CharField(max_length=50, choices=PURPOSE_CHOICES, default=PURPOSE_SCHOLARSHIP)
    amount       = models.DecimalField(max_digits=12, decimal_places=2)
    currency     = models.CharField(max_length=5, default="USD")
    method       = models.CharField(max_length=20, choices=METHOD_CHOICES)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    gateway_ref  = models.CharField(max_length=300, blank=True, help_text="External payment reference")
    metadata     = models.JSONField(default=dict, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Payment"

    def __str__(self):
        return f"{self.user} | {self.purpose} | {self.currency} {self.amount} [{self.status}]"


# ─────────────────────────────────────────────
# CONTACT / ENQUIRY
# ─────────────────────────────────────────────

class ContactEnquiry(models.Model):
    """Public contact form submissions."""
    name       = models.CharField(max_length=150)
    email      = models.EmailField()
    phone      = models.CharField(max_length=30, blank=True)
    subject    = models.CharField(max_length=255)
    message    = models.TextField()
    is_replied = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Contact Enquiry"
        verbose_name_plural = "Contact Enquiries"

    def __str__(self):
        return f"{self.name} — {self.subject}"


# ─────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────

class Notification(models.Model):
    """In-app notifications for users."""
    user       = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title      = models.CharField(max_length=255)
    message    = models.TextField()
    is_read    = models.BooleanField(default=False)
    link       = models.CharField(max_length=500, blank=True, help_text="Frontend route to navigate to")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{'✓' if self.is_read else '●'}] {self.user.username}: {self.title}"