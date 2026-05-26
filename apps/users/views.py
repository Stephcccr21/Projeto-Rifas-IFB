from rest_framework import generics
from .models import User

from rest_framework.generics import (
    RetrieveUpdateAPIView,
    CreateAPIView,
    GenericAPIView
)

from .serializers import (
    UserSerializer,
    PasswordResetSerializer,
    UserRegisterSerializer
)

from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate

from rest_framework_simplejwt.tokens import RefreshToken

User = get_user_model()


# =========================
# 🔑 LOGIN
# =========================
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),

            # 👤 USER INFO
            "user": {
                "id": user.id,
                "username": user.username,
                "nome": user.nome,
                "email": user.email,
                "role": user.role,
            }
        })


# =========================
# 🔒 PASSWORD RESET
# =========================
class PasswordResetAPIView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

            try:
                user = User.objects.get(email=email)
                print(f"RESET LINK: http://fake/{user.id}/token")

            except User.DoesNotExist:
                pass

        return Response({
            "message": "If the email exists, a reset link was sent"
        })


# =========================
# 📝 REGISTER
# =========================
class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        return Response({
            "message": "Use POST to register"
        })

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED
        )


# =========================
# 👤 PROFILE
# =========================
class ProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user