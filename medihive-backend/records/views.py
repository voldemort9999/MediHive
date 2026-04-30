from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Record, FamilyLink
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RecordSerializer,
    UserSerializer,
    FamilyLinkSerializer,
)


class IsAdminUserRole(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.role == "admin")


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "User created"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            return Response({
                "token": str(refresh.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "role": user.role,
                },
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAdminUserRole]
    queryset = User.objects.all().order_by("id")

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user.id == request.user.id:
            return Response(
                {"detail": "You cannot delete your own admin account."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


class PatientViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        patients = User.objects.filter(role="patient", is_active=True).order_by("id")
        if user.role == "admin":
            return patients
        if user.role == "doctor":
            patient_ids = Record.objects.filter(doctor=user).values_list("patient", flat=True)
            return patients.filter(id__in=patient_ids)
        if user.role == "patient":
            return patients.filter(id=user.id)
        if user.role == "family":
            patient_ids = FamilyLink.objects.filter(
                family_member=user
            ).values_list("patient", flat=True)
            return patients.filter(id__in=patient_ids)
        return User.objects.none()

    @action(detail=False, methods=["get"], url_path="assigned")
    def assigned(self, request):
        serializer = self.get_serializer(self.get_queryset(), many=True)
        return Response(serializer.data)


class RecordViewSet(viewsets.ModelViewSet):
    serializer_class = RecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "admin":
            return Record.objects.all()
        if user.role == "doctor":
            return Record.objects.filter(doctor=user)
        if user.role == "patient":
            return Record.objects.filter(patient=user)
        if user.role == "family":
            patient_ids = FamilyLink.objects.filter(
                family_member=user
            ).values_list("patient", flat=True)
            return Record.objects.filter(patient__in=patient_ids)
        return Record.objects.none()

    def perform_create(self, serializer):
        serializer.save(doctor=self.request.user)


class FamilyLinkView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        links = FamilyLink.objects.filter(family_member=request.user)
        serializer = FamilyLinkSerializer(links, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = FamilyLinkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk=None):
        try:
            link = FamilyLink.objects.get(pk=pk, family_member=request.user)
            link.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except FamilyLink.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
