from rest_framework import serializers

from .models import (
    Raffle,
    Prize,
    NumeroRifa,
)

from apps.sales.models import (
    Vendedor,
    VendedorRifa,
    Transaction,
    TransactionItem,
)


# =========================
# 👤 VENDEDOR
# =========================
class VendedorSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='usuario.nome', read_only=True)
    email = serializers.EmailField(source='usuario.email', read_only=True)
    telefone = serializers.CharField(source='usuario.telefone', read_only=True)

    class Meta:
        model = Vendedor
        fields = [
            'id',
            'nome',
            'email',
            'telefone',
            'comissao_fixa',
            'ativo'
        ]


# =========================
# 🔗 VENDEDOR ↔ RIFA
# =========================
class VendedorRifaSerializer(serializers.ModelSerializer):

    rifa_nome = serializers.CharField(
        source='rifa.titulo',
        read_only=True
    )

    class Meta:
        model = VendedorRifa
        fields = [
            'id',
            'rifa',
            'rifa_nome',
            'ativo'
        ]


# =========================
# 🧾 TRANSACTION ITEM
# =========================
class TransactionItemSerializer(serializers.ModelSerializer):

    numero = serializers.IntegerField(
        source='numero.numero',
        read_only=True
    )

    class Meta:
        model = TransactionItem
        fields = [
            'id',
            'numero_rifa',
            'numero'
        ]


# =========================
# 💰 TRANSACTION
# =========================
class TransactionSerializer(serializers.ModelSerializer):

    itens = TransactionItemSerializer(
        many=True,
        read_only=True
    )

    vendedor_nome = serializers.CharField(
        source='vendedor.usuario.nome',
        read_only=True
    )

    class Meta:
        model = Transaction

        fields = [
            'id',
            'comprador_nome',
            'comprador_email',
            'comprador_telefone',
            'comprador_cpf',

            'rifa',
            'vendedor',
            'vendedor_nome',

            'valor_total',
            'status',
            'data_expiracao',
            'comprovante_url',

            'created_at',
            'itens'
        ]


# =========================
# 🎁 PRÊMIOS
# =========================
class PrizeSerializer(serializers.ModelSerializer):

    class Meta:
        model = Prize
        fields = [
            'id',
            'posicao',
            'descricao',
            'imagem'
        ]


# =========================
# 🎟️ NÚMEROS
# =========================
class NumeroRifaSerializer(serializers.ModelSerializer):

    class Meta:
        model = NumeroRifa
        fields = [
            'id',
            'numero',
            'status'
        ]


# =========================
# 🎟️ RAFFLE
# =========================
class RaffleSerializer(serializers.ModelSerializer):

    class Meta:

        model = Raffle

        fields = '__all__'

        read_only_fields = [
            'organizador',
            'slug',
            'created_at',
            'updated_at'
        ]


# =========================
# 🌎 PUBLIC RAFFLE
# =========================
class PublicRaffleSerializer(serializers.ModelSerializer):

    premios = PrizeSerializer(
        many=True,
        read_only=True
    )

    numeros = NumeroRifaSerializer(
        many=True,
        read_only=True
    )

    vendedores = serializers.SerializerMethodField()

    class Meta:
        model = Raffle

        fields = [
            'id',
            'titulo',
            'descricao',
            'descricao_html',
            'slug',
            'valor_numero',
            'total_numeros',
            'data_sorteio',
            'imagem_principal',
            'premios',
            'numeros',
            'vendedores'
        ]

    def get_vendedores(self, obj):

        vendedores = VendedorRifa.objects.filter(
            rifa=obj,
            ativo=True,
            vendedor__ativo=True
        )

        return [
            {
                "id": rel.vendedor.id,
                "nome": rel.vendedor.usuario.nome
            }
            for rel in vendedores
        ]