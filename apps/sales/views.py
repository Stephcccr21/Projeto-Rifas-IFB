from decimal import Decimal

from django.db import transaction as db_transaction

from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.raffles.models import (
    Raffle,
    NumeroRifa
)

from .models import (
    Transaction,
    TransactionItem
)

from .serializers import (
    TransactionSerializer
)


class ReservarNumerosView(APIView):

    permission_classes = [AllowAny]

    @db_transaction.atomic
    def post(self, request, raffle_id):

        raffle = Raffle.objects.get(id=raffle_id)

        numeros_ids = request.data.get("numeros", [])

        comprador_nome = request.data.get(
            "comprador_nome"
        )

        comprador_email = request.data.get(
            "comprador_email"
        )

        comprador_telefone = request.data.get(
            "comprador_telefone"
        )

        comprador_cpf = request.data.get(
            "comprador_cpf"
        )

        vendedor_id = request.data.get(
            "vendedor"
        )

        numeros = NumeroRifa.objects.select_for_update().filter(
            id__in=numeros_ids,
            rifa=raffle
        )

        if numeros.count() != len(numeros_ids):

            return Response(
                {
                    "error": "Números inválidos"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        for numero in numeros:

            if numero.status != "disponivel":

                return Response(
                    {
                        "error": f"Número {numero.numero} indisponível"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        valor_total = (
            Decimal(raffle.valor_numero) *
            len(numeros_ids)
        )

        transacao = Transaction.objects.create(
            raffle=raffle,
            vendedor_id=vendedor_id,
            comprador_nome=comprador_nome,
            comprador_email=comprador_email,
            comprador_telefone=comprador_telefone,
            comprador_cpf=comprador_cpf,
            valor_total=valor_total,
        )

        for numero in numeros:

            TransactionItem.objects.create(
                transaction=transacao,
                numero=numero
            )

            numero.status = "reservado"
            numero.save()

        serializer = TransactionSerializer(
            transacao
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )