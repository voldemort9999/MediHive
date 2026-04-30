import os
import sys
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
BACKEND_DIR = ROOT_DIR / "medihive-backend"

sys.path.insert(0, str(BACKEND_DIR))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")

import django
from django.core.management import call_command
from django.core.wsgi import get_wsgi_application


def prepare_ephemeral_database():
    if not os.getenv("VERCEL") or os.getenv("DATABASE_URL"):
        return

    django.setup()
    call_command("migrate", interactive=False, verbosity=0)

    from records.models import User

    demo_users = [
        ("admin", "admin123", "admin", "System", "Administrator", "Administration"),
        ("doctor", "doctor123", "doctor", "Priya", "Sharma", "Cardiology"),
        ("patient", "patient123", "patient", "Rohan", "Mehta", ""),
    ]
    for username, password, role, first_name, last_name, department in demo_users:
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "role": role,
                "first_name": first_name,
                "last_name": last_name,
                "department": department,
                "is_staff": role == "admin",
                "is_superuser": role == "admin",
            },
        )
        if created:
            user.set_password(password)
            user.save(update_fields=["password"])


prepare_ephemeral_database()
app = get_wsgi_application()
application = app
