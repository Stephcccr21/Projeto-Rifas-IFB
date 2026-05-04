from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    ROLE_CHOICES = (
        ('organizador', 'Organizador'),
        ('vendedor', 'Vendedor'),
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='organizador'  # ✅ IMPORTANT FIX
    )

    telefone = models.CharField(max_length=20, blank=True, null=True)
    nome = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return self.username