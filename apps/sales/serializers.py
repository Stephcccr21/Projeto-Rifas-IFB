from rest_framework import serializers
from .models import Sale, Order, OrderItem, Ticket, Vendedor, VendedorRifa


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
    rifa_nome = serializers.CharField(source='rifa.titulo', read_only=True)

    class Meta:
        model = VendedorRifa
        fields = ['id', 'rifa', 'rifa_nome', 'ativo']


# =========================
# 🎟 SALE
# =========================
class SaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sale
        fields = '__all__'
        read_only_fields = ['vendedor']


# =========================
# 🧾 ORDER ITEM
# =========================
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['ticket']


# =========================
# 🧾 ORDER
# =========================
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(**validated_data)

        for item in items_data:
            OrderItem.objects.create(order=order, **item)

        return order