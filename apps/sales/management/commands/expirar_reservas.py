from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.sales.models import Transaction


class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        expiradas = Transaction.objects.filter(
            status="reservada",
            data_expiracao__lt=timezone.now()
        )

        for transacao in expiradas:

            transacao.status = "expirada"

            transacao.save()

            for item in transacao.items.all():

                numero = item.numero

                numero.status = "disponivel"

                numero.reservado_em = None

                numero.save()

        self.stdout.write(
            f"{expiradas.count()} reservas expiradas"
        )