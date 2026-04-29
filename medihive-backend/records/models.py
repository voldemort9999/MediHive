from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    ROLE_CHOICES = [
        ("admin", "Admin"),
        ("doctor", "Doctor"),
        ("patient", "Patient"),
        ("family", "Family"),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="patient")

    def __str__(self):
        return self.username


class Record(models.Model):
    doctor = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="doctor_records"
    )
    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="patient_records"
    )
    diagnosis = models.TextField()
    record_type = models.CharField(max_length=50)
    file = models.FileField(upload_to="records/", blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.patient.username} - {self.diagnosis}"


class FamilyLink(models.Model):
    patient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="family_links_as_patient"
    )
    family_member = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="family_links_as_member"
    )

    class Meta:
        unique_together = ("patient", "family_member")

    def __str__(self):
        return f"{self.family_member.username} → {self.patient.username}"
