from rest_framework import generics
from .models import User
from rest_framework.generics import RetrieveUpdateAPIView
from .serializers import UserSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import PasswordResetSerializer
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .serializers import UserRegisterSerializer


User = get_user_model()

class PasswordResetAPIView(APIView):
    def post(self, request):
        serializer = PasswordResetSerializer(data=request.data)

        if serializer.is_valid():
            email = serializer.validated_data['email']

        try:
             user = User.objects.get(email=email)
             print(f"RESET LINK: http://fake/{user.id}/token")
        except User.DoesNotExist:
            pass  # do nothing

        return Response({"message": "If the email exists, a reset link was sent"})



class RegisterView(CreateAPIView):
    serializer_class = UserRegisterSerializer
    permission_classes = [AllowAny] 
    def get(self, request):
        return Response({"message": "Use POST to register"})

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ProfileView(RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    





