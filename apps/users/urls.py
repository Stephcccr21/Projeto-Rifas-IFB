from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    PasswordResetAPIView,
    LoginView,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", LoginView.as_view()),
    path("profile/", ProfileView.as_view()),
    path("forgot-password/", PasswordResetAPIView.as_view()),
]