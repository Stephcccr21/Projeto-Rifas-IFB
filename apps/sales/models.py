from django.db import models
from django.utils import timezone
from datetime import timedelta

from apps.raffles.models import (
    Raffle,
    NumeroRifa,
)


# =========================
# 🛒 TRANSACTION
# =========================
class Transaction(models.Model):

    STATUS_CHOICES = [
        ("reservada", "Reservada"),
        ("aguardando", "Aguardando"),
        ("paga", "Paga"),
        ("expirada", "Expirada"),
        ("rejeitada", "Rejeitada"),
    ]

    raffle = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE,
        related_name="transactions"
    )

    vendedor = models.ForeignKey(
        "Vendedor",
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    comprador_nome = models.CharField(max_length=255)

    comprador_email = models.EmailField()

    comprador_telefone = models.CharField(max_length=20)

    comprador_cpf = models.CharField(max_length=14)

    valor_total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="reservada"
    )

    comprovante_url = models.URLField(
        null=True,
        blank=True
    )

    data_expiracao = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if not self.data_expiracao:

            minutos = getattr(
                self.raffle,
                "tempo_reserva",
                30
            )

            self.data_expiracao = (
                timezone.now() +
                timedelta(minutes=minutos)
            )

        super().save(*args, **kwargs)

    def __str__(self):

        return f"{self.comprador_nome} - {self.raffle.titulo}"


# =========================
# 🎟️ TRANSACTION ITEMS
# =========================
class TransactionItem(models.Model):

    transaction = models.ForeignKey(
        Transaction,
        on_delete=models.CASCADE,
        related_name="items"
    )

    numero = models.ForeignKey(
        NumeroRifa,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return f"{self.numero.numero}"


# =========================
# 👤 VENDEDOR
# =========================
class Vendedor(models.Model):

    usuario = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE
    )

    comissao_fixa = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0
    )

    ativo = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):

        return self.usuario.nome


# =========================
# 🔗 VENDEDOR ↔ RIFA
# =========================
class VendedorRifa(models.Model):

    vendedor = models.ForeignKey(
        Vendedor,
        on_delete=models.CASCADE
    )

    rifa = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE
    )

    ativo = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("vendedor", "rifa")

    def __str__(self):

        return f"{self.vendedor} - {self.rifa}"