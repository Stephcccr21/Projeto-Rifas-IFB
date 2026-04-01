from rest_framework.routers import DefaultRouter
from .views import RaffleViewSet

router = DefaultRouter()
router.register(r'raffles', RaffleViewSet)

urlpatterns = router.urls