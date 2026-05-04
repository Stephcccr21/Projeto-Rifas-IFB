from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VendedorViewSet, CreateSaleView, ListSalesView

router = DefaultRouter()
router.register(r'vendedores', VendedorViewSet, basename='vendedores')

urlpatterns = [
    path('', include(router.urls)),
    path('sales/', ListSalesView.as_view()),
    path('sales/create/', CreateSaleView.as_view()),
]