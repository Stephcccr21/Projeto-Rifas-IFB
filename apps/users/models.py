from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('organizer', 'Organizer'),
        ('seller', 'Seller'),
        ('buyer', 'Buyer'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)