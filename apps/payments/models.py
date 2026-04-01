from django.db import models
from django.db import models
from apps.sales.models import Order

class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    payment_method = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
