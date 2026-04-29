from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Record, FamilyLink
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    RecordSerializer,
    UserSerializer,
    FamilyLinkSerializer,
)


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
