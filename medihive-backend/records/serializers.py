from django.contrib.auth import authenticate
from rest_framework import serializers
from .models import User, Record, FamilyLink


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "role"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        return user


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    joined = serializers.DateTimeField(source="date_joined", read_only=True)
    status = serializers.CharField(required=False)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "first_name",
            "last_name",
            "name",
            "department",
            "status",
            "joined",
            "password",
        ]
        read_only_fields = ["id", "name", "joined"]

    def get_name(self, obj):
        full_name = obj.get_full_name().strip()
        return full_name or obj.username

    def _apply_password_and_status(self, user, password=None, status=None):
        if password:
            user.set_password(password)
        if status:
            user.is_active = status.lower() == "active"
        user.is_staff = user.role == "admin"
        user.is_superuser = user.role == "admin"
        return user

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        status = validated_data.pop("status", None)
        user = User(**validated_data)
        self._apply_password_and_status(user, password, status)
        if not password:
            user.set_unusable_password()
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        status = validated_data.pop("status", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        self._apply_password_and_status(instance, password, status)
        instance.save()
        return instance


class RecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True, required=False)
    patient_display = serializers.CharField(source="patient.username", read_only=True)
    doctor_display = serializers.CharField(source="doctor.username", read_only=True)

    class Meta:
        model = Record
        fields = "__all__"
        read_only_fields = ["doctor", "created_at"]
        extra_kwargs = {"patient": {"required": False}}

    def create(self, validated_data):
        patient_name = validated_data.pop("patient_name", None)
        if patient_name and "patient" not in validated_data:
            patient, _ = User.objects.get_or_create(
                username=patient_name,
                defaults={"role": "patient"},
            )
            validated_data["patient"] = patient
        return super().create(validated_data)


class FamilyLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FamilyLink
        fields = ["id", "patient", "family_member"]
