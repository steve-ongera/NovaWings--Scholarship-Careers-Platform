"""
core/views.py
NovaWings – all API views (auth, scholarships, jobs, payments, notifications).
"""

from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.utils import timezone
from django.db import transaction

from rest_framework import generics, status, permissions, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Destination,
    Scholarship,
    ScholarshipUnlock,
    ScholarshipApplication,
    ApplicationStageLog,
    ApplicationDocument,
    JobCategory,
    Job,
    JobApplication,
    JobApplicationDocument,
    Payment,
    ContactEnquiry,
    Notification,
)
from .serializers import (
    UserRegistrationSerializer,
    UserProfileSerializer,
    ChangePasswordSerializer,
    DestinationSerializer,
    ScholarshipListSerializer,
    ScholarshipDetailSerializer,
    ScholarshipWriteSerializer,
    ScholarshipUnlockSerializer,
    InitiateUnlockSerializer,
    ScholarshipApplicationSerializer,
    ScholarshipApplicationCreateSerializer,
    ApplicationDocumentSerializer,
    UpdateApplicationStageSerializer,
    JobCategorySerializer,
    JobListSerializer,
    JobDetailSerializer,
    JobWriteSerializer,
    JobApplicationSerializer,
    JobApplicationCreateSerializer,
    JobApplicationDocumentSerializer,
    PaymentSerializer,
    VerifyPaymentSerializer,
    ContactEnquirySerializer,
    NotificationSerializer,
)
from .permissions import IsAdminOrStaff, IsOwnerOrAdminOrStaff

User = get_user_model()


# ─────────────────────────────────────────────
# AUTH VIEWS
# ─────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    """POST /api/auth/register/ — create a new student account."""
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "message": "Account created successfully. Welcome to NovaWings!",
                "user": UserProfileSerializer(user, context={"request": request}).data,
                "tokens": {
                    "refresh": str(refresh),
                    "access":  str(refresh.access_token),
                },
            },
            status=status.HTTP_201_CREATED,
        )


class ProfileView(generics.RetrieveUpdateAPIView):
    """GET/PATCH /api/auth/profile/ — retrieve or update own profile."""
    serializer_class   = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser, JSONParser]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    """POST /api/auth/change-password/ — change own password."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        if not user.check_password(serializer.validated_data["old_password"]):
            return Response({"old_password": "Incorrect current password."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response({"message": "Password updated successfully."})


class LogoutView(APIView):
    """POST /api/auth/logout/ — blacklist the refresh token."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get("refresh"))
            token.blacklist()
        except Exception:
            pass
        return Response({"message": "Logged out successfully."}, status=status.HTTP_205_RESET_CONTENT)


# ─────────────────────────────────────────────
# DESTINATION
# ─────────────────────────────────────────────

class DestinationListView(generics.ListAPIView):
    """GET /api/destinations/ — list all active study destinations."""
    queryset           = Destination.objects.filter(is_active=True)
    serializer_class   = DestinationSerializer
    permission_classes = [permissions.AllowAny]


# ─────────────────────────────────────────────
# SCHOLARSHIP VIEWS
# ─────────────────────────────────────────────

class ScholarshipListView(generics.ListAPIView):
    """GET /api/scholarships/ — public list with filters."""
    serializer_class   = ScholarshipListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["destination__code", "level", "tier", "is_featured", "visa_assistance"]
    search_fields      = ["title", "university", "field_of_study", "description"]
    ordering_fields    = ["created_at", "deadline", "amount_usd"]

    def get_queryset(self):
        return Scholarship.objects.filter(is_active=True).select_related("destination")


class ScholarshipDetailView(generics.RetrieveAPIView):
    """GET /api/scholarships/<slug>/ — full detail of a scholarship."""
    serializer_class   = ScholarshipDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = "slug"
    queryset           = Scholarship.objects.filter(is_active=True).select_related("destination")


class ScholarshipAdminView(generics.ListCreateAPIView):
    """GET/POST /api/admin/scholarships/ — staff management."""
    serializer_class   = ScholarshipWriteSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = Scholarship.objects.all().select_related("destination")


class ScholarshipAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/admin/scholarships/<slug>/ — staff edit."""
    serializer_class   = ScholarshipWriteSerializer
    permission_classes = [IsAdminOrStaff]
    lookup_field       = "slug"
    queryset           = Scholarship.objects.all()


# ─────────────────────────────────────────────
# SCHOLARSHIP UNLOCK / PAYMENT GATE
# ─────────────────────────────────────────────

class InitiateUnlockView(APIView):
    """POST /api/scholarships/<slug>/unlock/ — initiate unlock payment."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, slug):
        scholarship = get_object_or_404(Scholarship, slug=slug, is_active=True)

        if not scholarship.is_paid:
            return Response({"message": "This scholarship is free — no unlock required."})

        # Check already unlocked
        if ScholarshipUnlock.objects.filter(
            user=request.user, scholarship=scholarship, status=ScholarshipUnlock.STATUS_SUCCESS
        ).exists():
            return Response({"message": "You have already unlocked this scholarship."})

        serializer = InitiateUnlockSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        amount = scholarship.amount_kes if data["currency"] == "KES" else scholarship.amount_usd

        # Create pending payment record
        with transaction.atomic():
            payment = Payment.objects.create(
                user     = request.user,
                purpose  = Payment.PURPOSE_SCHOLARSHIP,
                amount   = amount,
                currency = data["currency"],
                method   = data["method"],
                status   = Payment.STATUS_PENDING,
                metadata = {"scholarship_id": str(scholarship.id)},
            )
            unlock = ScholarshipUnlock.objects.create(
                user        = request.user,
                scholarship = scholarship,
                amount_paid = amount,
                currency    = data["currency"],
                method      = data["method"],
                status      = ScholarshipUnlock.STATUS_PENDING,
            )

        # ── M-PESA STK Push ──────────────────────
        if data["method"] == ScholarshipUnlock.METHOD_MPESA:
            phone = data.get("phone", request.user.phone)
            if not phone:
                return Response({"error": "Phone number required for M-Pesa."}, status=400)
            # TODO: call utils.initiate_mpesa_stk_push(phone, amount, payment.id)
            return Response({
                "message": "M-Pesa STK push sent. Enter your PIN to complete payment.",
                "payment_id": str(payment.id),
                "unlock_id":  str(unlock.id),
            })

        # ── PayPal ───────────────────────────────
        if data["method"] == ScholarshipUnlock.METHOD_PAYPAL:
            # TODO: call utils.create_paypal_order(amount, "USD", payment.id)
            return Response({
                "message": "PayPal order created.",
                "payment_id": str(payment.id),
                "approval_url": "https://www.paypal.com/checkoutnow?token=MOCK",  # replace with real
            })

        # ── Card / Stripe ─────────────────────────
        if data["method"] == ScholarshipUnlock.METHOD_CARD:
            # TODO: call utils.create_stripe_checkout_session(amount, "usd", payment.id)
            return Response({
                "message": "Card checkout session created.",
                "payment_id": str(payment.id),
                "checkout_url": "https://checkout.stripe.com/pay/mock",
            })

        return Response({"error": "Unknown payment method."}, status=400)


class VerifyUnlockView(APIView):
    """POST /api/payments/verify/ — webhook/manual verify a payment."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = VerifyPaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reference = serializer.validated_data["reference"]
        method    = serializer.validated_data["method"]

        # TODO: verify with gateway; for now simulate success
        payment = Payment.objects.filter(
            user=request.user, gateway_ref=reference, method=method
        ).first()

        if not payment:
            # Try matching by id
            payment = Payment.objects.filter(
                user=request.user, status=Payment.STATUS_PENDING, method=method
            ).order_by("-created_at").first()

        if not payment:
            return Response({"error": "Payment not found."}, status=404)

        if payment.status == Payment.STATUS_SUCCESS:
            return Response({"message": "Payment already verified and unlock active."})

        # Mark payment + unlock
        with transaction.atomic():
            payment.status      = Payment.STATUS_SUCCESS
            payment.gateway_ref = reference
            payment.updated_at  = timezone.now()
            payment.save()

            scholarship_id = payment.metadata.get("scholarship_id")
            if scholarship_id:
                unlock = ScholarshipUnlock.objects.filter(
                    user=request.user, scholarship_id=scholarship_id
                ).first()
                if unlock:
                    unlock.mark_success(reference)

        return Response({"message": "Payment verified. Scholarship unlocked successfully!"})


# ─────────────────────────────────────────────
# SCHOLARSHIP APPLICATIONS
# ─────────────────────────────────────────────

class ApplyScholarshipView(generics.CreateAPIView):
    """POST /api/scholarships/<slug>/apply/ — student submits application."""
    serializer_class   = ScholarshipApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        app = serializer.save()
        Notification.objects.create(
            user    = app.user,
            title   = "Application Submitted",
            message = f"Your application for '{app.scholarship.title}' has been received. We will review it shortly.",
            link    = "/dashboard",
        )


class MyScholarshipApplicationsView(generics.ListAPIView):
    """GET /api/applications/my/ — list the authenticated student's applications."""
    serializer_class   = ScholarshipApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            ScholarshipApplication.objects
            .filter(user=self.request.user)
            .select_related("scholarship", "scholarship__destination")
            .prefetch_related("documents", "stage_logs")
        )


class ScholarshipApplicationDetailView(generics.RetrieveAPIView):
    """GET /api/applications/<id>/ — full detail of one application."""
    serializer_class   = ScholarshipApplicationSerializer
    permission_classes = [IsOwnerOrAdminOrStaff]

    def get_queryset(self):
        return ScholarshipApplication.objects.select_related(
            "scholarship", "user"
        ).prefetch_related("documents", "stage_logs")


class UploadApplicationDocumentView(APIView):
    """POST /api/applications/<id>/documents/ — upload a document."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, pk):
        application = get_object_or_404(ScholarshipApplication, pk=pk, user=request.user)
        serializer  = ApplicationDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(application=application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class UpdateApplicationStageView(APIView):
    """PATCH /api/admin/applications/<id>/stage/ — admin advances tracking stage."""
    permission_classes = [IsAdminOrStaff]

    def patch(self, request, pk):
        application = get_object_or_404(ScholarshipApplication, pk=pk)
        serializer  = UpdateApplicationStageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        old_stage = application.stage
        new_stage = serializer.validated_data["stage"]
        note      = serializer.validated_data.get("note", "")

        application.stage = new_stage
        application.save()

        ApplicationStageLog.objects.create(
            application = application,
            from_stage  = old_stage,
            to_stage    = new_stage,
            changed_by  = request.user,
            note        = note,
        )

        Notification.objects.create(
            user    = application.user,
            title   = "Application Update",
            message = f"Your application for '{application.scholarship.title}' has been updated to: {application.get_stage_display()}",
            link    = "/dashboard",
        )

        return Response({
            "message": f"Stage updated to '{application.get_stage_display()}'.",
            "application": ScholarshipApplicationSerializer(application, context={"request": request}).data,
        })


class AdminScholarshipApplicationsView(generics.ListAPIView):
    """GET /api/admin/applications/ — list all applications for staff."""
    serializer_class   = ScholarshipApplicationSerializer
    permission_classes = [IsAdminOrStaff]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields   = ["stage", "scholarship__destination__code", "needs_visa_help"]
    search_fields      = ["user__username", "user__email", "scholarship__title"]

    def get_queryset(self):
        return ScholarshipApplication.objects.select_related(
            "scholarship", "user", "scholarship__destination"
        ).prefetch_related("documents", "stage_logs")


# ─────────────────────────────────────────────
# JOB VIEWS
# ─────────────────────────────────────────────

class JobCategoryListView(generics.ListAPIView):
    """GET /api/jobs/categories/"""
    queryset           = JobCategory.objects.all()
    serializer_class   = JobCategorySerializer
    permission_classes = [permissions.AllowAny]


class JobListView(generics.ListAPIView):
    """GET /api/jobs/ — public job listings."""
    serializer_class   = JobListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields   = ["category__slug", "job_type", "is_featured"]
    search_fields      = ["title", "company", "location", "description"]
    ordering_fields    = ["created_at", "deadline"]

    def get_queryset(self):
        return Job.objects.filter(is_active=True).select_related("category")


class JobDetailView(generics.RetrieveAPIView):
    """GET /api/jobs/<slug>/"""
    serializer_class   = JobDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field       = "slug"
    queryset           = Job.objects.filter(is_active=True).select_related("category")


class JobAdminView(generics.ListCreateAPIView):
    """GET/POST /api/admin/jobs/ — staff post / manage jobs."""
    serializer_class   = JobWriteSerializer
    permission_classes = [IsAdminOrStaff]
    queryset           = Job.objects.all().select_related("category")


class JobAdminDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET/PATCH/DELETE /api/admin/jobs/<slug>/"""
    serializer_class   = JobWriteSerializer
    permission_classes = [IsAdminOrStaff]
    lookup_field       = "slug"
    queryset           = Job.objects.all()


class ApplyJobView(generics.CreateAPIView):
    """POST /api/jobs/<slug>/apply/ — student submits job application."""
    serializer_class   = JobApplicationCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        app = serializer.save()
        Notification.objects.create(
            user    = app.user,
            title   = "Job Application Received",
            message = f"Your application for '{app.job.title}' at {app.job.company} has been submitted.",
            link    = "/dashboard",
        )


class UploadJobDocumentView(APIView):
    """POST /api/job-applications/<id>/documents/ — upload CV / cert for job."""
    permission_classes = [permissions.IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request, pk):
        application = get_object_or_404(JobApplication, pk=pk, user=request.user)
        serializer  = JobApplicationDocumentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(application=application)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class MyJobApplicationsView(generics.ListAPIView):
    """GET /api/job-applications/my/ — list the student's own job applications."""
    serializer_class   = JobApplicationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return (
            JobApplication.objects
            .filter(user=self.request.user)
            .select_related("job", "job__category")
            .prefetch_related("documents")
        )


class AdminJobApplicationsView(generics.ListAPIView):
    """GET /api/admin/job-applications/ — all job applications for staff."""
    serializer_class   = JobApplicationSerializer
    permission_classes = [IsAdminOrStaff]
    filter_backends    = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields   = ["status", "job__category__slug"]
    search_fields      = ["user__username", "job__title", "job__company"]

    def get_queryset(self):
        return JobApplication.objects.select_related("job", "user").prefetch_related("documents")


# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────

class ContactEnquiryView(generics.CreateAPIView):
    """POST /api/contact/ — public contact form submission."""
    serializer_class   = ContactEnquirySerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # TODO: send confirmation email via utils.send_contact_email()
        return Response(
            {"message": "Thank you! We received your message and will get back to you soon."},
            status=status.HTTP_201_CREATED,
        )


# ─────────────────────────────────────────────
# NOTIFICATIONS
# ─────────────────────────────────────────────

class NotificationListView(generics.ListAPIView):
    """GET /api/notifications/ — list user's notifications."""
    serializer_class   = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)


class MarkNotificationReadView(APIView):
    """PATCH /api/notifications/<id>/read/ — mark a notification as read."""
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        notification = get_object_or_404(Notification, pk=pk, user=request.user)
        notification.is_read = True
        notification.save()
        return Response({"message": "Marked as read."})


class MarkAllNotificationsReadView(APIView):
    """PATCH /api/notifications/read-all/ — mark all as read."""
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return Response({"message": "All notifications marked as read."})


# ─────────────────────────────────────────────
# DASHBOARD STATS (for StudentDashboard)
# ─────────────────────────────────────────────

class StudentDashboardStatsView(APIView):
    """GET /api/dashboard/stats/ — summary counts for the student portal."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        scholarship_apps = ScholarshipApplication.objects.filter(user=user)
        job_apps         = JobApplication.objects.filter(user=user)
        unread_notifs    = Notification.objects.filter(user=user, is_read=False).count()

        stage_breakdown = {}
        for s in ScholarshipApplication.STAGE_CHOICES:
            stage_breakdown[s[0]] = scholarship_apps.filter(stage=s[0]).count()

        return Response({
            "scholarship_applications": {
                "total":    scholarship_apps.count(),
                "approved": scholarship_apps.filter(stage=ScholarshipApplication.STAGE_APPROVED).count(),
                "pending":  scholarship_apps.exclude(
                    stage__in=[ScholarshipApplication.STAGE_APPROVED, ScholarshipApplication.STAGE_REJECTED]
                ).count(),
                "rejected": scholarship_apps.filter(stage=ScholarshipApplication.STAGE_REJECTED).count(),
                "by_stage": stage_breakdown,
            },
            "job_applications": {
                "total":       job_apps.count(),
                "shortlisted": job_apps.filter(status=JobApplication.STATUS_SHORTLIST).count(),
                "pending":     job_apps.filter(status=JobApplication.STATUS_PENDING).count(),
                "hired":       job_apps.filter(status=JobApplication.STATUS_HIRED).count(),
            },
            "unread_notifications": unread_notifs,
            "unlocked_scholarships": ScholarshipUnlock.objects.filter(
                user=user, status=ScholarshipUnlock.STATUS_SUCCESS
            ).count(),
        })