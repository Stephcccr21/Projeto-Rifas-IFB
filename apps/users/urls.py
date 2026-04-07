from django.urls import path
from .views import RegisterView
from rest_framework_simplejwt.views import TokenObtainPairView
from .views import ProfileView
from .views import PasswordResetAPIView


urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', TokenObtainPairView.as_view()),
    path('profile/', ProfileView.as_view()),
     path('auth/password-reset/', PasswordResetAPIView.as_view()),
]
