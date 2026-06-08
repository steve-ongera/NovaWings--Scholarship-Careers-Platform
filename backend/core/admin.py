"""
core/admin.py
NovaWings – fully customized Django admin interface.
"""

from django.contrib import admin, messages
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from django.utils import timezone

from .models import (
    User,
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

# ── Admin site branding ──────────────────────
admin.site.site_header  = "NovaWings Administration"
admin.site.site_title   = "NovaWings"
admin.site.index_title  = "Platform Management"


# ─────────────────────────────────────────────
# USER
# ─────────────────────────────────────────────

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display  = ("username", "email", "full_name", "role", "country", "is_verified", "is_active", "created_at")
    list_filter   = ("role", "is_verified", "is_active", "country")
    search_fields = ("username", "email", "first_name", "last_name", "phone")
    ordering      = ("-created_at",)
    readonly_fields = ("created_at", "updated_at", "last_login")

    fieldsets = BaseUserAdmin.fieldsets + (
        ("NovaWings Profile", {
            "fields": ("role", "phone", "country", "city", "profile_photo", "bio", "is_verified"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
        }),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ("Profile", {
            "fields": ("email", "first_name", "last_name", "role", "phone", "country"),
        }),
    )


# ─────────────────────────────────────────────
# DESTINATION
# ─────────────────────────────────────────────

@admin.register(Destination)
class DestinationAdmin(admin.ModelAdmin):
    list_display  = ("flag_emoji", "name", "code", "is_active")
    list_editable = ("is_active",)
    search_fields = ("name", "code")


# ─────────────────────────────────────────────
# SCHOLARSHIP
# ─────────────────────────────────────────────

@admin.register(Scholarship)
class ScholarshipAdmin(admin.ModelAdmin):
    list_display  = ("title", "destination", "level", "tier_badge", "university", "deadline", "is_active", "is_featured")
    list_filter   = ("tier", "level", "destination", "is_active", "is_featured", "visa_assistance")
    search_fields = ("title", "university", "field_of_study")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("is_active", "is_featured")
    readonly_fields = ("created_at", "updated_at", "created_by")
    date_hierarchy = "created_at"
    ordering = ("-created_at",)

    fieldsets = (
        ("Basic Info", {
            "fields": ("title", "slug", "destination", "level", "university", "field_of_study", "cover_image"),
        }),
        ("Tier & Pricing", {
            "fields": ("tier", "amount_usd", "amount_kes"),
        }),
        ("Content", {
            "fields": ("description", "requirements", "benefits"),
        }),
        ("Settings", {
            "fields": ("deadline", "visa_assistance", "is_active", "is_featured"),
        }),
        ("Meta", {
            "fields": ("created_by", "created_at", "updated_at"),
        }),
    )

    def tier_badge(self, obj):
        colors = {
            "free":    "#28a745",
            "premium": "#fd7e14",
            "gold":    "#ffc107",
        }
        color = colors.get(obj.tier, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;">{}</span>',
            color, obj.get_tier_display(),
        )
    tier_badge.short_description = "Tier"

    def save_model(self, request, obj, form, change):
        if not change:
            obj.created_by = request.user
        super().save_model(request, obj, form, change)


# ─────────────────────────────────────────────
# SCHOLARSHIP UNLOCK
# ─────────────────────────────────────────────

@admin.register(ScholarshipUnlock)
class ScholarshipUnlockAdmin(admin.ModelAdmin):
    list_display  = ("user", "scholarship", "method", "amount_paid", "currency", "status", "unlocked_at")
    list_filter   = ("status", "method", "currency")
    search_fields = ("user__username", "user__email", "scholarship__title", "reference")
    readonly_fields = ("created_at", "unlocked_at")


# ─────────────────────────────────────────────
# SCHOLARSHIP APPLICATION
# ─────────────────────────────────────────────

class ApplicationDocumentInline(admin.TabularInline):
    model  = ApplicationDocument
    extra  = 0
    fields = ("doc_type", "file", "is_verified")
    readonly_fields = ("uploaded_at",)


class ApplicationStageLogInline(admin.TabularInline):
    model  = ApplicationStageLog
    extra  = 0
    readonly_fields = ("from_stage", "to_stage", "changed_by", "note", "changed_at")
    can_delete = False


@admin.register(ScholarshipApplication)
class ScholarshipApplicationAdmin(admin.ModelAdmin):
    list_display  = ("user", "scholarship", "stage_badge", "needs_visa_help", "submitted_at")
    list_filter   = ("stage", "needs_visa_help", "scholarship__destination")
    search_fields = ("user__username", "user__email", "scholarship__title")
    readonly_fields = ("id", "submitted_at", "updated_at")
    inlines    = [ApplicationDocumentInline, ApplicationStageLogInline]
    date_hierarchy = "submitted_at"
    ordering   = ("-submitted_at",)

    actions = ["mark_approved", "mark_rejected", "mark_under_review"]

    def stage_badge(self, obj):
        colors = {
            "submitted":           "#17a2b8",
            "under_review":        "#6f42c1",
            "documents_verified":  "#fd7e14",
            "visa_processing":     "#ffc107",
            "approved":            "#28a745",
            "rejected":            "#dc3545",
        }
        color = colors.get(obj.stage, "#6c757d")
        return format_html(
            '<span style="background:{};color:#fff;padding:2px 8px;border-radius:4px;">{}</span>',
            color, obj.get_stage_display(),
        )
    stage_badge.short_description = "Stage"

    @admin.action(description="Mark selected as Approved")
    def mark_approved(self, request, queryset):
        for app in queryset:
            old = app.stage
            app.stage = ScholarshipApplication.STAGE_APPROVED
            app.save()
            ApplicationStageLog.objects.create(
                application=app, from_stage=old,
                to_stage=ScholarshipApplication.STAGE_APPROVED,
                changed_by=request.user, note="Bulk approved via admin."
            )
        self.message_user(request, f"{queryset.count()} application(s) approved.", messages.SUCCESS)

    @admin.action(description="Mark selected as Rejected")
    def mark_rejected(self, request, queryset):
        for app in queryset:
            old = app.stage
            app.stage = ScholarshipApplication.STAGE_REJECTED
            app.save()
            ApplicationStageLog.objects.create(
                application=app, from_stage=old,
                to_stage=ScholarshipApplication.STAGE_REJECTED,
                changed_by=request.user, note="Bulk rejected via admin."
            )
        self.message_user(request, f"{queryset.count()} application(s) rejected.", messages.WARNING)

    @admin.action(description="Move selected to Under Review")
    def mark_under_review(self, request, queryset):
        queryset.update(stage=ScholarshipApplication.STAGE_REVIEWING)
        self.message_user(request, f"{queryset.count()} application(s) moved to Under Review.")


# ─────────────────────────────────────────────
# JOBS
# ─────────────────────────────────────────────

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "icon")
    prepopulated_fields = {"slug": ("name",)}


class JobApplicationInline(admin.TabularInline):
    model  = JobApplication
    extra  = 0
    fields = ("user", "status", "applied_at")
    readonly_fields = ("applied_at",)
    can_delete = False


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display  = ("title", "company", "category", "job_type", "location", "deadline", "is_active", "is_featured")
    list_filter   = ("job_type", "category", "is_active", "is_featured")
    search_fields = ("title", "company", "location")
    prepopulated_fields = {"slug": ("title",)}
    list_editable = ("is_active", "is_featured")
    inlines       = [JobApplicationInline]
    readonly_fields = ("created_at", "updated_at")


class JobApplicationDocumentInline(admin.TabularInline):
    model  = JobApplicationDocument
    extra  = 0
    fields = ("doc_type", "file")
    readonly_fields = ("uploaded_at",)


@admin.register(JobApplication)
class JobApplicationAdmin(admin.ModelAdmin):
    list_display  = ("user", "job", "status", "applied_at")
    list_filter   = ("status",)
    search_fields = ("user__username", "job__title", "job__company")
    readonly_fields = ("applied_at", "updated_at")
    inlines   = [JobApplicationDocumentInline]


# ─────────────────────────────────────────────
# PAYMENT
# ─────────────────────────────────────────────

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display  = ("user", "purpose", "amount", "currency", "method", "status", "created_at")
    list_filter   = ("status", "method", "currency", "purpose")
    search_fields = ("user__username", "gateway_ref")
    readonly_fields = ("id", "created_at", "updated_at")


# ─────────────────────────────────────────────
# CONTACT
# ─────────────────────────────────────────────

@admin.register(ContactEnquiry)
class ContactEnquiryAdmin(admin.ModelAdmin):
    list_display  = ("name", "email", "subject", "is_replied", "created_at")
    list_filter   = ("is_replied",)
    search_fields = ("name", "email", "subject")
    list_editable = ("is_replied",)
    readonly_fields = ("created_at",)


# ─────────────────────────────────────────────
# NOTIFICATION
# ─────────────────────────────────────────────

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display  = ("user", "title", "is_read", "created_at")
    list_filter   = ("is_read",)
    search_fields = ("user__username", "title")
    readonly_fields = ("created_at",)