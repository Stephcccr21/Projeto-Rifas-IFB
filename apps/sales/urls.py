from django.urls import path
from .views import CreateSaleView, ListSalesView

urlpatterns = [
    path('', ListSalesView.as_view()),
    path('create/', CreateSaleView.as_view()),
]