from django.db import models

from apps.raffles.models import Raffle


class Comment(models.Model):

    STATUS_CHOICES = [
        ("pendente", "Pendente"),
        ("aprovado", "Aprovado"),
        ("rejeitado", "Rejeitado"),
    ]

    raffle = models.ForeignKey(
        Raffle,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    nome = models.CharField(
        max_length=255
    )

    email = models.EmailField()

    texto = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pendente"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return (
            f"{self.nome} - "
            f"{self.raffle.titulo}"
        )