from rest_framework.generics import CreateAPIView, ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db import transaction

import random
import string

from .models import Sale, Vendedor, VendedorRifa
from .serializers import SaleSerializer, VendedorSerializer


# =========================
# 👤 VENDEDOR
# =========================
class VendedorViewSet(ModelViewSet):
    serializer_class = VendedorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Vendedor.objects.filter(organizador=self.request.user)

    def create(self, request, *args, **kwargs):
        User = get_user_model()

        username = request.data.get("username")
        email = request.data.get("email")
        nome = request.data.get("nome")
        telefone = request.data.get("telefone")

        # ✅ validation
        if not username or not email or not nome:
            return Response(
                {"error": "username, email and nome are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔒 check duplicate username
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔐 generate password
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=8))

        try:
            with transaction.atomic():

                # 👤 create user
                user = User.objects.create_user(
                    username=username,
                    email=email,
                    password=password,
                    role='vendedor',
                    nome=nome,
                    telefone=telefone
                )

                # 💾 create vendedor
                serializer = self.get_serializer(data=request.data)
                serializer.is_valid(raise_exception=True)

                vendedor = serializer.save(
                    usuario=user,
                    organizador=request.user
                )

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 📧 send email (non-blocking)
        try:
            send_mail(
                subject="Acesso ao sistema",
                message=f"Usuário: {username}\nSenha: {password}",
                from_email="noreply@rifas.com",
                recipient_list=[email],
                fail_silently=True,
            )
        except Exception:
            pass

        return Response({
            "message": "Vendedor criado com sucesso",
            "username": username,
            "password": password,
            "nome": nome,
            "vendedor_id": vendedor.id
        }, status=status.HTTP_201_CREATED)

    # 🔗 Associate raffle
    @action(detail=True, methods=['post'])
    def associar_rifa(self, request, pk=None):
        vendedor = self.get_object()
        rifa_id = request.data.get('rifa_id')

        if not rifa_id:
            return Response({"error": "rifa_id is required"}, status=400)

        # 🔒 prevent duplicates
        if VendedorRifa.objects.filter(vendedor=vendedor, rifa_id=rifa_id).exists():
            return Response({"message": "Já associado"}, status=200)

        VendedorRifa.objects.create(
            vendedor=vendedor,
            rifa_id=rifa_id
        )

        return Response({"message": "Rifa associada"})

    # ❌ Remove association
    @action(detail=True, methods=['delete'])
    def remover_rifa(self, request, pk=None):
        vendedor = self.get_object()
        rifa_id = request.data.get('rifa_id')

        if not rifa_id:
            return Response({"error": "rifa_id is required"}, status=400)

        VendedorRifa.objects.filter(
            vendedor=vendedor,
            rifa_id=rifa_id
        ).delete()

        return Response({"message": "Rifa removida"})


# =========================
# 🎟 CREATE SALE
# =========================
class CreateSaleView(CreateAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user

        try:
            vendedor = Vendedor.objects.get(usuario=user)
        except Vendedor.DoesNotExist:
            raise ValidationError({"error": "Usuário não é um vendedor"})

        serializer.save(vendedor=vendedor)


# =========================
# 📋 LIST SALES
# =========================
class ListSalesView(ListAPIView):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    permission_classes = [IsAuthenticated]