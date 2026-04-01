from django.db import models
from django.db import models
from django.conf import settings
from apps.raffles.models import Raffle
User = settings.AUTH_USER_MODEL

class Ticket(models.Model):
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE)
    number = models.IntegerField()
    is_sold = models.BooleanField(default=False)


class Order(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE)
    seller = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='sales')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)
