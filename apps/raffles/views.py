from datetime import timedelta
from .models import ResultadoSorteio
from .serializers import ResultadoSorteioSerializer

from django.utils import timezone

from rest_framework import status, viewsets
from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated
)
from rest_framework.response import Response
from rest_framework.views import APIView
from .services import executar_sorteio
from .models import Raffle

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

    serializer_class = RaffleSerializer

    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Raffle.objects.filter(
            organizador=self.request.user,
            is_deleted=False
        )

    def perform_create(self, serializer):

        rifa = serializer.save(
            organizador=self.request.user,
            status=Raffle.StatusChoices.ACTIVE
        )

        for numero in range(
            1,
            rifa.total_numeros + 1
        ):

            NumeroRifa.objects.create(
                rifa=rifa,
                numero=numero
            )

    def update(self, request, *args, **kwargs):

        rifa = self.get_object()

        if rifa.organizador != request.user:

            return Response(
                {
                    "erro":
                    "Você não pode editar esta rifa"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if timezone.now() >= rifa.data_sorteio:

            return Response(
                {
                    "erro":
                    "Não é possível alterar a rifa após a data do sorteio"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().update(
            request,
            *args,
            **kwargs
        )

    def partial_update(self, request, *args, **kwargs):

        rifa = self.get_object()

        if rifa.organizador != request.user:

            return Response(
                {
                    "erro":
                    "Você não pode editar esta rifa"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if timezone.now() >= rifa.data_sorteio:

            return Response(
                {
                    "erro":
                    "Não é possível alterar a rifa após a data do sorteio"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        return super().partial_update(
            request,
            *args,
            **kwargs
        )

    def destroy(self, request, *args, **kwargs):

        rifa = self.get_object()

        if rifa.organizador != request.user:

            return Response(
                {
                    "erro":
                    "Você não pode excluir esta rifa"
                },
                status=status.HTTP_403_FORBIDDEN
            )

        if rifa.has_sales():

            return Response(
                {
                    "erro":
                    "Não é possível excluir uma rifa que possui vendas"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        rifa.is_deleted = True

        rifa.save()

        return Response(
            {
                "mensagem":
                "Rifa excluída com sucesso"
            },
            status=status.HTTP_200_OK
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
class SortearRifaView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def post(self, request, raffle_id):

        try:

            rifa = Raffle.objects.get(
                id=raffle_id,
                organizador=request.user
            )

        except Raffle.DoesNotExist:

            return Response(
                {
                    "erro":
                    "Rifa não encontrada"
                },
                status=404
            )

        if rifa.status != "active":

            return Response(
                {
                    "erro":
                    "Rifa não está ativa"
                },
                status=400
            )

        executar_sorteio(rifa)

        return Response({
            "mensagem":
            "Sorteio realizado"
        })  
class ResultadoSorteioView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request, raffle_id):

        resultados = ResultadoSorteio.objects.filter(
            rifa_id=raffle_id,
            rifa__organizador=request.user
        ).order_by(
            "premio__posicao"
        )

        serializer = ResultadoSorteioSerializer(
            resultados,
            many=True
        )

        return Response(
            serializer.data
        )      
class PublicarRifaView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, raffle_id):

        try:

            rifa = Raffle.objects.get(
                id=raffle_id,
                organizador=request.user
            )

        except Raffle.DoesNotExist:

            return Response(
                {"erro": "Rifa não encontrada"},
                status=404
            )

        rifa.status = Raffle.StatusChoices.ACTIVE

        rifa.save()

        return Response({
            "mensagem": "Rifa publicada com sucesso"
        })    