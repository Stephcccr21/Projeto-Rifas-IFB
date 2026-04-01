from django.db import models
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Raffle(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    organizer = models.ForeignKey(User, on_delete=models.CASCADE)
    total_numbers = models.IntegerField()
    price_per_number = models.DecimalField(max_digits=10, decimal_places=2)
    draw_date = models.DateTimeField()
    live_stream_url = models.URLField(blank=True, null=True)
    status = models.CharField(max_length=20, default='draft')


class Prize(models.Model):
    raffle = models.ForeignKey(Raffle, related_name='prizes', on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    position = models.IntegerField()