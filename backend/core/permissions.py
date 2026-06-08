"""
core/permissions.py
Custom DRF permission classes for NovaWings.
"""

from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsAdminOrStaff(BasePermission):
    """Allow access only to admin users or staff-role users."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role in ("admin", "staff"))
        )


class IsOwnerOrAdminOrStaff(BasePermission):
    """Object-level: allow the owner of the object, or admin/staff."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        if request.user.is_staff or request.user.role in ("admin", "staff"):
            return True
        # Support objects with .user or .applicant FK
        owner = getattr(obj, "user", None) or getattr(obj, "applicant", None)
        return owner == request.user


class IsOwnerOnly(BasePermission):
    """Object-level: allow only the owner (no staff override)."""

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        owner = getattr(obj, "user", None)
        return owner == request.user


class ReadOnlyOrAdminOrStaff(BasePermission):
    """Allow safe (GET, HEAD, OPTIONS) to everyone; write only to admin/staff."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return (
            request.user
            and request.user.is_authenticated
            and (request.user.is_staff or request.user.role in ("admin", "staff"))
        )