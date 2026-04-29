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
    class Meta:
        model = User
        fields = ["id", "username", "email", "role", "first_name", "last_name"]


class RecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(write_only=True, required=False)

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
