from django.db import models
from django.db import models
from django.conf import settings
from django.db import models
from apps.raffles.models import Raffle

class Comment(models.Model):
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
