from django.urls import path
from .views import CreateRaffleView, ListRafflesView

urlpatterns = [
    path('', ListRafflesView.as_view()),          # 👈 changed
    path('create/', CreateRaffleView.as_view()),
]
