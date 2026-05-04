from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import Raffle, Prize, RaffleImage, NumeroRifa
from .serializers import RaffleSerializer, PrizeSerializer
from rest_framework.parsers import MultiPartParser, FormParser


# =========================
# 🎟️ RAFFLE VIEWSET
# =========================
class RaffleViewSet(ModelViewSet):
    serializer_class = RaffleSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return Raffle.objects.filter(is_deleted=False)

    def destroy(self, request, *args, **kwargs):
        raffle = self.get_object()
        raffle.is_deleted = True
        raffle.save()
        return Response(status=204)

    def perform_create(self, serializer):
        serializer.save()


# =========================
# 🎁 PRIZE VIEWSET (NESTED)
# =========================
class PrizeViewSet(ModelViewSet):
    serializer_class = PrizeSerializer
    permission_classes = [IsAuthenticated]

    lookup_field = "pk"
    lookup_url_kwarg = "pk"

    def get_queryset(self):
        return Prize.objects.filter(rifa_id=self.kwargs.get("raffle_id"))

    def perform_create(self, serializer):
        raffle = Raffle.objects.get(id=self.kwargs["raffle_id"])
        serializer.save(rifa=raffle)