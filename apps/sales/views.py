from django.shortcuts import render
from rest_framework import viewsets
from .models import Order
from .serializers import OrderSerializer
from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Sale
from .serializers import SaleSerializer
from rest_framework import serializers
from .models import Raffle
from apps.raffles.models import Prize


# 🎟 Seller sells a number
class CreateSaleView(CreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        # 🔐 Only sellers can sell
        if user.role != 'seller':
            raise PermissionError("Only sellers can sell numbers")

        serializer.save(seller=user)

class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = '__all__'       


# 📋 List sales (optional)
class ListSalesView(ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]
    read_only_fields = ['organizer']

    def create(self, validated_data):
        prizes_data = validated_data.pop('prizes', [])
        raffle = Raffle.objects.create(**validated_data)

        for prize_data in prizes_data:
            Prize.objects.create(raffle=raffle, **prize_data)

        return raffle

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
