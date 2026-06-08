"""
core/serializers.py
NovaWings – DRF serializers for all models.
"""

from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

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

User = get_user_model()


# ─────────────────────────────────────────────
# AUTH / USER
# ─────────────────────────────────────────────

class UserRegistrationSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm Password")

    class Meta:
        model  = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "phone", "country", "city", "password", "password2",
        ]
        extra_kwargs = {
            "email":      {"required": True},
            "first_name": {"required": True},
            "last_name":  {"required": True},
        }

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError({"password": "Passwords do not match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create_user(
            username   = validated_data["username"],
            email      = validated_data["email"],
            first_name = validated_data.get("first_name", ""),
            last_name  = validated_data.get("last_name", ""),
            phone      = validated_data.get("phone", ""),
            country    = validated_data.get("country", "Kenya"),
            city       = validated_data.get("city", ""),
            password   = validated_data["password"],
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Read / update the authenticated user's own profile."""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model  = User
        fields = [
            "id", "username", "email", "first_name", "last_name",
            "full_name", "phone", "country", "city", "profile_photo",
            "bio", "role", "is_verified", "created_at",
        ]
        read_only_fields = ["id", "username", "role", "is_verified", "created_at"]


class UserMiniSerializer(serializers.ModelSerializer):
    """Minimal user representation for nested fields."""
    class Meta:
        model  = User
        fields = ["id", "username", "first_name", "last_name", "email"]


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True, validators=[validate_password])
    new_password2 = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs["new_password"] != attrs["new_password2"]:
            raise serializers.ValidationError({"new_password": "Passwords do not match."})
        return attrs


# ─────────────────────────────────────────────
# DESTINATION
# ─────────────────────────────────────────────

class DestinationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Destination
        fields = ["id", "name", "code", "flag_emoji", "is_active"]


# ─────────────────────────────────────────────
# SCHOLARSHIP
# ─────────────────────────────────────────────

class ScholarshipListSerializer(serializers.ModelSerializer):
    """Compact serializer for listing scholarships."""
    destination_name = serializers.CharField(source="destination.name", read_only=True)
    destination_flag = serializers.CharField(source="destination.flag_emoji", read_only=True)
    is_expired       = serializers.ReadOnlyField()
    is_paid          = serializers.ReadOnlyField()
    is_unlocked      = serializers.SerializerMethodField()

    class Meta:
        model  = Scholarship
        fields = [
            "id", "title", "slug", "destination_name", "destination_flag",
            "level", "tier", "is_paid", "amount_usd", "amount_kes",
            "university", "field_of_study", "deadline", "is_expired",
            "cover_image", "is_featured", "visa_assistance", "is_unlocked",
        ]

    def get_is_unlocked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated and obj.is_paid:
            return ScholarshipUnlock.objects.filter(
                user=request.user, scholarship=obj, status=ScholarshipUnlock.STATUS_SUCCESS
            ).exists()
        return not obj.is_paid  # Free scholarships are always "unlocked"


class ScholarshipDetailSerializer(ScholarshipListSerializer):
    """Full detail view of a scholarship."""
    class Meta(ScholarshipListSerializer.Meta):
        fields = ScholarshipListSerializer.Meta.fields + [
            "description", "requirements", "benefits", "created_at", "updated_at",
        ]


class ScholarshipWriteSerializer(serializers.ModelSerializer):
    """Create / update a scholarship (admin/staff only)."""
    class Meta:
        model  = Scholarship
        exclude = ["created_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["created_by"] = self.context["request"].user
        return super().create(validated_data)


# ─────────────────────────────────────────────
# SCHOLARSHIP UNLOCK
# ─────────────────────────────────────────────

class ScholarshipUnlockSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ScholarshipUnlock
        fields = ["id", "scholarship", "amount_paid", "currency", "method", "status", "reference", "unlocked_at", "created_at"]
        read_only_fields = ["id", "status", "reference", "unlocked_at", "created_at"]


class InitiateUnlockSerializer(serializers.Serializer):
    """Payload to initiate a scholarship unlock payment."""
    method   = serializers.ChoiceField(choices=ScholarshipUnlock.METHOD_CHOICES)
    currency = serializers.ChoiceField(choices=["USD", "KES"], default="USD")
    phone    = serializers.CharField(required=False, help_text="M-Pesa phone number e.g. 254712345678")


# ─────────────────────────────────────────────
# SCHOLARSHIP APPLICATION
# ─────────────────────────────────────────────

class ApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = ApplicationDocument
        fields = ["id", "doc_type", "file", "file_name", "is_verified", "uploaded_at"]
        read_only_fields = ["id", "file_name", "is_verified", "uploaded_at"]


class ApplicationStageLogSerializer(serializers.ModelSerializer):
    changed_by_name = serializers.CharField(source="changed_by.username", read_only=True)

    class Meta:
        model  = ApplicationStageLog
        fields = ["id", "from_stage", "to_stage", "changed_by_name", "note", "changed_at"]


class ScholarshipApplicationSerializer(serializers.ModelSerializer):
    """Full application detail including documents and stage history."""
    user        = UserMiniSerializer(read_only=True)
    scholarship = ScholarshipListSerializer(read_only=True)
    documents   = ApplicationDocumentSerializer(many=True, read_only=True)
    stage_logs  = ApplicationStageLogSerializer(many=True, read_only=True)

    class Meta:
        model  = ScholarshipApplication
        fields = [
            "id", "user", "scholarship", "stage",
            "personal_statement", "needs_visa_help", "visa_status",
            "documents", "stage_logs", "submitted_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "stage", "visa_status", "submitted_at", "updated_at"]


class ScholarshipApplicationCreateSerializer(serializers.ModelSerializer):
    """Used when a student submits an application."""
    class Meta:
        model  = ScholarshipApplication
        fields = ["scholarship", "personal_statement", "needs_visa_help"]

    def validate_scholarship(self, scholarship):
        user = self.context["request"].user
        if ScholarshipApplication.objects.filter(user=user, scholarship=scholarship).exists():
            raise serializers.ValidationError("You have already applied for this scholarship.")
        if scholarship.is_paid:
            unlocked = ScholarshipUnlock.objects.filter(
                user=user, scholarship=scholarship, status=ScholarshipUnlock.STATUS_SUCCESS
            ).exists()
            if not unlocked:
                raise serializers.ValidationError("Please unlock this scholarship before applying.")
        if scholarship.is_expired:
            raise serializers.ValidationError("The application deadline for this scholarship has passed.")
        return scholarship

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


class UpdateApplicationStageSerializer(serializers.Serializer):
    """Admin tool to advance an application's tracking stage."""
    stage = serializers.ChoiceField(choices=ScholarshipApplication.STAGE_CHOICES)
    note  = serializers.CharField(required=False, allow_blank=True)


# ─────────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────────

class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobCategory
        fields = ["id", "name", "slug", "icon"]


class JobListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    is_expired    = serializers.ReadOnlyField()

    class Meta:
        model  = Job
        fields = [
            "id", "title", "slug", "company", "company_logo",
            "category_name", "location", "job_type", "salary_range",
            "deadline", "is_expired", "is_featured", "created_at",
        ]


class JobDetailSerializer(JobListSerializer):
    class Meta(JobListSerializer.Meta):
        fields = JobListSerializer.Meta.fields + ["description", "requirements", "updated_at"]


class JobWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Job
        exclude = ["posted_by", "created_at", "updated_at"]

    def create(self, validated_data):
        validated_data["posted_by"] = self.context["request"].user
        return super().create(validated_data)


# ─────────────────────────────────────────────
# JOB APPLICATION
# ─────────────────────────────────────────────

class JobApplicationDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobApplicationDocument
        fields = ["id", "doc_type", "file", "file_name", "uploaded_at"]
        read_only_fields = ["id", "file_name", "uploaded_at"]


class JobApplicationSerializer(serializers.ModelSerializer):
    user      = UserMiniSerializer(read_only=True)
    job       = JobListSerializer(read_only=True)
    documents = JobApplicationDocumentSerializer(many=True, read_only=True)

    class Meta:
        model  = JobApplication
        fields = [
            "id", "user", "job", "cover_letter", "status",
            "documents", "applied_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "status", "applied_at", "updated_at"]


class JobApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = JobApplication
        fields = ["job", "cover_letter"]

    def validate_job(self, job):
        user = self.context["request"].user
        if JobApplication.objects.filter(user=user, job=job).exists():
            raise serializers.ValidationError("You have already applied for this job.")
        if job.is_expired:
            raise serializers.ValidationError("The application deadline for this job has passed.")
        if not job.is_active:
            raise serializers.ValidationError("This job listing is no longer active.")
        return job

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)


# ─────────────────────────────────────────────
# PAYMENT
# ─────────────────────────────────────────────

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Payment
        fields = [
            "id", "purpose", "amount", "currency", "method",
            "status", "gateway_ref", "created_at",
        ]
        read_only_fields = fields


class VerifyPaymentSerializer(serializers.Serializer):
    reference = serializers.CharField(required=True)
    method    = serializers.ChoiceField(choices=Payment.METHOD_CHOICES)


# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────

class ContactEnquirySerializer(serializers.ModelSerializer):
    class Meta:
        model  = ContactEnquiry
        fields = ["id", "name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


# ─────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Notification
        fields = ["id", "title", "message", "is_read", "link", "created_at"]
        read_only_fields = ["id", "title", "message", "link", "created_at"]