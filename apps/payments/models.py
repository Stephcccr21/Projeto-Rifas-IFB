from django.db import models

from apps.sales.models import Transaction


# =========================
# 💳 PAYMENT
# =========================
class Payment(models.Model):

    transacao = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name="payments"
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        default='pending'
    )

    payment_method = models.CharField(
        max_length=50
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.transacao.id} - {self.status}"