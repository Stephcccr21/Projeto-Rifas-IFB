from django.db import models
from django.conf import settings
from apps.raffles.models import Raffle

User = settings.AUTH_USER_MODEL


# =========================
# 👤 VENDEDOR
# =========================
class Vendedor(models.Model):
    usuario = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="vendedor_profile"
    )

    organizador = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="vendedores"
    )

    comissao_fixa = models.DecimalField(max_digits=10, decimal_places=2)
    ativo = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.usuario}"


# =========================
# 🔗 VENDEDOR ↔ RIFA
# =========================
class VendedorRifa(models.Model):
    vendedor = models.ForeignKey(
        Vendedor,
        on_delete=models.CASCADE,
        related_name="rifas"
    )

    rifa = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE,
        related_name="vendedores"
    )

    ativo = models.BooleanField(default=True)

    class Meta:
        unique_together = ("vendedor", "rifa")


# =========================
# 💰 SALE
# =========================
class Sale(models.Model):
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE, related_name='sales')

    # 🔥 CHANGED HERE
    vendedor = models.ForeignKey(
        Vendedor,
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )

    number = models.IntegerField()
    buyer_name = models.CharField(max_length=255)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('raffle', 'number')


# =========================
# 🎟️ TICKET
# =========================
class Ticket(models.Model):
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE)
    number = models.IntegerField()
    is_sold = models.BooleanField(default=False)


# =========================
# 🧾 ORDER
# =========================
class Order(models.Model):
    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    raffle = models.ForeignKey(Raffle, on_delete=models.CASCADE)

    # 🔥 CHANGED HERE
    vendedor = models.ForeignKey(
        Vendedor,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='orders'
    )

    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')


# =========================
# 📦 ORDER ITEM
# =========================
class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE)