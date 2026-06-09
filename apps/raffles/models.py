from django.db import models
from django.conf import settings
from django.utils.text import slugify
import uuid

User = settings.AUTH_USER_MODEL


# =========================
# 🧠 SOFT DELETE MANAGER
# =========================
class RaffleQuerySet(models.QuerySet):

    def active(self):
        return self.filter(is_deleted=False)


# =========================
# 🎟️ RAFFLE
# =========================
class Raffle(models.Model):

    class StatusChoices(models.TextChoices):
        DRAFT = 'draft', 'Rascunho'
        ACTIVE = 'active', 'Ativa'
        CLOSED = 'closed', 'Encerrada'

    # 📝 Basic info
    titulo = models.CharField(max_length=255)

    # 🔗 PUBLIC URL
    slug = models.SlugField(
    unique=True,
    blank=True,
    null=True
)

    descricao = models.TextField()

    descricao_html = models.TextField(
        blank=True,
        null=True
    )

    # 💰 Numbers & pricing
    valor_numero = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_numeros = models.PositiveIntegerField()

    # 📅 Draw
    data_sorteio = models.DateTimeField()

    # 💳 Payment
    chave_pix = models.CharField(max_length=255)

    # ⏱ Reservation system
    tempo_reserva = models.PositiveIntegerField(
        help_text="Tempo em minutos"
    )

    # 📊 Status
    status = models.CharField(
        max_length=10,
        choices=StatusChoices.choices,
        default=StatusChoices.DRAFT
    )

    # 👤 Organizer
    organizador = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='raffles'
    )

    # 🧹 Soft delete
    is_deleted = models.BooleanField(default=False)

    # 🔗 Live stream
    link_transmissao = models.URLField(
        blank=True,
        null=True
    )

    # 🖼️ Main image
    imagem_principal = models.ImageField(
        upload_to="raffles/main/",
        blank=True,
        null=True
    )

    # 🕒 Meta
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    # =========================
    # 🧠 HELPERS
    # =========================
    def has_sales(self):
        return self.numeros.filter(
            status='pago'
        ).exists()

    def save(self, *args, **kwargs):

        if not self.slug:

            base_slug = slugify(self.titulo)

            unique_slug = base_slug

            while Raffle.objects.filter(slug=unique_slug).exists():

                unique_slug = f"{base_slug}-{uuid.uuid4().hex[:6]}"

            self.slug = unique_slug

        super().save(*args, **kwargs)

    def __str__(self):
        return self.titulo

    objects = RaffleQuerySet.as_manager()


# =========================
# 🖼️ GALLERY IMAGES
# =========================
class RaffleImage(models.Model):

    rifa = models.ForeignKey(
        Raffle,
        related_name='galeria',
        on_delete=models.CASCADE
    )

    imagem = models.ImageField(
        upload_to="raffles/gallery/"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"Imagem da rifa {self.rifa.id}"


# =========================
# 🎁 PRIZES
# =========================
class Prize(models.Model):

    rifa = models.ForeignKey(
        Raffle,
        related_name='premios',
        on_delete=models.CASCADE
    )

    posicao = models.PositiveIntegerField()

    descricao = models.TextField()

    imagem = models.ImageField(
        upload_to="raffles/prizes/",
        blank=True,
        null=True
    )

    class Meta:

        ordering = ['posicao']

        constraints = [
            models.UniqueConstraint(
                fields=['rifa', 'posicao'],
                name='unique_prize_position_per_raffle'
            )
        ]

    def __str__(self):
        return f"Prêmio {self.posicao} - Rifa {self.rifa.id}"

# =========================
# 🎟️ NUMBERS
# =========================
class NumeroRifa(models.Model):

    class StatusChoices(models.TextChoices):
        DISPONIVEL = 'disponivel', 'Disponível'
        RESERVADO = 'reservado', 'Reservado'
        AGUARDANDO_APROVACAO = 'aguardando_aprovacao', 'Aguardando Aprovação'
        PAGO = 'pago', 'Pago'

    rifa = models.ForeignKey(
        Raffle,
        related_name='numeros',
        on_delete=models.CASCADE
    )

    numero = models.PositiveIntegerField()

    status = models.CharField(
        max_length=30,
        choices=StatusChoices.choices,
        default=StatusChoices.DISPONIVEL
    )

    reservado_em = models.DateTimeField(
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.rifa.titulo} - {self.numero}"

    class Meta:

        constraints = [
            models.UniqueConstraint(
                fields=['rifa', 'numero'],
                name='unique_rifa_numero'
            )
        ]
class ResultadoSorteio(models.Model):

    rifa = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE,
        related_name="resultados"
    )

    premio = models.ForeignKey(
        Prize,
        on_delete=models.CASCADE
    )

    numero_sorteado = models.ForeignKey(
        NumeroRifa,
        on_delete=models.CASCADE
    )

    comprador_nome = models.CharField(
        max_length=255
    )

    data_sorteio = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.rifa.titulo} - "
            f"{self.numero_sorteado.numero}"
        )        