from datetime import timedelta

from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (
    Raffle,
    Prize,
    NumeroRifa,
)

from .serializers import (
    RaffleSerializer,
    PrizeSerializer,
    PublicRaffleSerializer
)

from apps.sales.models import (
    Transaction,
    TransactionItem,
)


# =========================
# 🎟️ RAFFLE VIEWSET
# =========================
class RaffleViewSet(viewsets.ModelViewSet):

    queryset = Raffle.objects.all()

    serializer_class = RaffleSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        serializer.save(
            organizador=self.request.user
        )


# =========================
# 🎁 PRIZE VIEWSET
# =========================
class PrizeViewSet(viewsets.ModelViewSet):

    queryset = Prize.objects.all()

    serializer_class = PrizeSerializer

    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        raffle_id = self.request.data.get("rifa")

        raffle = Raffle.objects.get(id=raffle_id)

        serializer.save(rifa=raffle)


# =========================
# 🌎 PUBLIC RAFFLE
# =========================
class PublicRaffleView(RetrieveAPIView):

    permission_classes = [AllowAny]

    serializer_class = PublicRaffleSerializer

    lookup_field = "slug"

    queryset = Raffle.objects.filter(
        is_deleted=False
    )


# =========================
# 🛒 RESERVAR NÚMEROS
# =========================
class ReservarNumerosView(APIView):

    permission_classes = [AllowAny]

    def post(self, request, raffle_id):

        try:

            rifa = Raffle.objects.get(
                id=raffle_id,
                is_deleted=False
            )

        except Raffle.DoesNotExist:

            return Response(
                {
                    "erro": "Rifa não encontrada"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        numeros_ids = request.data.get(
            "numeros",
            []
        )

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

        # ✅ valida campos obrigatórios
        if (
            not comprador_nome or
            not comprador_email or
            not comprador_telefone or
            not comprador_cpf
        ):

            return Response(
                {
                    "erro": "Todos os campos são obrigatórios"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ valida seleção
        if not numeros_ids:

            return Response(
                {
                    "erro": "Nenhum número selecionado"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ busca números da rifa
        numeros = NumeroRifa.objects.filter(
            id__in=numeros_ids,
            rifa=rifa
        )

        # ✅ valida disponibilidade
        for numero in numeros:

            if numero.status != "disponivel":

                return Response(
                    {
                        "erro":
                        f"Número {numero.numero} não disponível"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

        valor_total = (
            numeros.count() *
            float(rifa.valor_numero)
        )

        # ✅ cria transação
        transacao = Transaction.objects.create(

            raffle=rifa,

            comprador_nome=comprador_nome,

            comprador_email=comprador_email,

            comprador_telefone=comprador_telefone,

            comprador_cpf=comprador_cpf,

            vendedor_id=vendedor_id or None,

            valor_total=valor_total,

            status="reservada",

            data_expiracao=(
                timezone.now() +
                timedelta(minutes=30)
            )

        )

        itens = []

        # ✅ reserva números
        for numero in numeros:

            numero.status = "reservado"

            numero.reservado_em = timezone.now()

            numero.save()

            itens.append(
                TransactionItem(
                    transaction=transacao,
                    numero=numero
                )
            )

        TransactionItem.objects.bulk_create(
            itens
        )

        return Response(
            {
                "mensagem":
                "Números reservados com sucesso",

                "transacao_id":
                transacao.id
            },
            status=status.HTTP_201_CREATED
        )