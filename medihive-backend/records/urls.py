from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    RegisterView,
    LoginView,
    MeView,
    UserViewSet,
    PatientViewSet,
    RecordViewSet,
    FamilyLinkView,
)

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="user")
router.register(r"patients", PatientViewSet, basename="patient")
router.register(r"records", RecordViewSet, basename="record")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("me/", MeView.as_view(), name="me"),
    path("family-links/", FamilyLinkView.as_view(), name="family-links"),
    path("family-links/<int:pk>/", FamilyLinkView.as_view(), name="family-link-detail"),
    path("", include(router.urls)),
]
