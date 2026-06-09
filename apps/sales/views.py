from decimal import Decimal
from rest_framework.permissions import IsAuthenticated
from django.core.mail import send_mail

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
    
class UploadComprovanteView(APIView):

    def post(self, request, transaction_id):

        try:

            transacao = Transaction.objects.get(
                id=transaction_id
            )

        except Transaction.DoesNotExist:

            return Response(
                {"erro": "Transação não encontrada"},
                status=404
            )

        arquivo = request.FILES.get(
            "comprovante"
        )

        if not arquivo:

            return Response(
                {"erro": "Arquivo obrigatório"},
                status=400
            )

        # máximo 5 MB

        if arquivo.size > 5 * 1024 * 1024:

            return Response(
                {
                    "erro": "Arquivo maior que 5MB"
                },
                status=400
            )

        tipos_permitidos = [
            "image/jpeg",
            "image/png",
            "application/pdf",
        ]

        if arquivo.content_type not in tipos_permitidos:

            return Response(
                {
                    "erro": "Tipo de arquivo inválido"
                },
                status=400
            )

        transacao.comprovante = arquivo

        transacao.status = (
            "aguardando_aprovacao"
        )

        transacao.save()

        itens = transacao.items.all()

        for item in itens:

            numero = item.numero

            numero.status = (
                "aguardando_aprovacao"
            )

            numero.save()

        return Response(
            {
                "mensagem":
                "Comprovante enviado com sucesso"
            }
        )    
class TransactionDetailView(APIView):

    permission_classes = [AllowAny]

    def get(self, request, transaction_id):

        try:

            transaction = Transaction.objects.get(
                id=transaction_id
            )

        except Transaction.DoesNotExist:

            return Response(
                {
                    "erro": "Transação não encontrada"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        numeros = []

        for item in transaction.items.all():

            numeros.append(
                item.numero.numero
            )

        return Response({
            "id": transaction.id,
            "valor_total": transaction.valor_total,
            "status": transaction.status,
            "data_expiracao": transaction.data_expiracao,

            # PIX belongs to the raffle
            "pix_key": transaction.raffle.chave_pix,

            "numeros": numeros,
        })
class TransacoesPendentesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        transacoes = Transaction.objects.filter(
            raffle__organizador=request.user,
            status="aguardando_aprovacao"
        )

        resultado = []

        for transacao in transacoes:

            numeros = [
                item.numero.numero
                for item in transacao.items.all()
            ]

            resultado.append({
                "id": transacao.id,
                "comprador_nome": transacao.comprador_nome,
                "comprador_email": transacao.comprador_email,
                "comprador_telefone": transacao.comprador_telefone,
                "valor_total": transacao.valor_total,
                "numeros": numeros,
                "vendedor": (
                    transacao.vendedor.usuario.nome
                    if transacao.vendedor
                    else None
                ),
                "comprovante":
                    transacao.comprovante.url
                    if transacao.comprovante
                    else None,
            })

        return Response(resultado) 

class AprovarTransacaoView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, transaction_id):

        try:

            transacao = Transaction.objects.get(
                id=transaction_id,
                raffle__organizador=request.user
            )

        except Transaction.DoesNotExist:

            return Response(
                {"erro": "Transação não encontrada"},
                status=404
            )

        transacao.status = "paga"
        transacao.save()
        if transacao.vendedor:

           transacao.vendedor.total_vendas += 1
           transacao.vendedor.save()

        for item in transacao.items.all():

            numero = item.numero

            numero.status = "pago"

            numero.save()

        send_mail(
            subject="Pagamento aprovado",
            message=(
                f"Olá {transacao.comprador_nome}, "
                "seu pagamento foi aprovado."
            ),
            from_email=None,
            recipient_list=[
                transacao.comprador_email
            ],
            fail_silently=True,
        )

        return Response({
            "mensagem":
            "Transação aprovada"
        })   
class RejeitarTransacaoView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, transaction_id):

        motivo = request.data.get("motivo")

        if not motivo:

            return Response(
                {"erro": "Motivo obrigatório"},
                status=400
            )

        try:

            transacao = Transaction.objects.get(
                id=transaction_id,
                raffle__organizador=request.user
            )

        except Transaction.DoesNotExist:

            return Response(
                {"erro": "Transação não encontrada"},
                status=404
            )

        transacao.status = "rejeitada"
        transacao.motivo_rejeicao = motivo
        transacao.save()

        for item in transacao.items.all():

            numero = item.numero

            numero.status = "disponivel"

            numero.reservado_em = None

            numero.save()

        send_mail(
            subject="Comprovante rejeitado",
            message=(
                f"Seu comprovante foi rejeitado.\n\n"
                f"Motivo: {motivo}"
            ),
            from_email=None,
            recipient_list=[
                transacao.comprador_email
            ],
            fail_silently=True,
        )

        return Response({
            "mensagem":
            "Transação rejeitada"
        })        