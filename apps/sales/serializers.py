from rest_framework import serializers

from .models import (
    Transaction,
    TransactionItem
)


class TransactionItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = TransactionItem
        fields = [
            "numero"
        ]


class TransactionSerializer(serializers.ModelSerializer):

    numeros = serializers.ListField(
        child=serializers.IntegerField(),
        write_only=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "raffle",
            "vendedor",
            "comprador_nome",
            "comprador_email",
            "comprador_telefone",
            "comprador_cpf",
            "valor_total",
            "status",
            "data_expiracao",
            "numeros",
        ]

        read_only_fields = [
            "status",
            "data_expiracao",
            "valor_total",
        ]