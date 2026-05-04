from rest_framework import serializers
from .models import Raffle, RaffleImage, Prize, NumeroRifa


# =========================
# 🖼️ RAFFLE IMAGES
# =========================
class RaffleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = RaffleImage
        fields = ["id", "imagem"]


# =========================
# 🎁 PRIZES
# =========================
class PrizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prize
        fields = ["id", "posicao", "descricao", "imagem"]


# =========================
# 🎟️ RAFFLE MAIN
# =========================
class RaffleSerializer(serializers.ModelSerializer):

    # 🔥 nested (read only)
    galeria = RaffleImageSerializer(many=True, read_only=True)
    premios = PrizeSerializer(many=True, read_only=True)

    class Meta:
        model = Raffle
        fields = "__all__"
        read_only_fields = ["organizador", "is_deleted"]

    # =========================
    # 🔥 CREATE (WITH IMAGES)
    # =========================
    def create(self, validated_data):
        request = self.context.get("request")

        # 🖼️ get files
        imagens = request.FILES.getlist("galeria")
        imagem_principal = request.FILES.get("imagem_principal")

        # 🎟️ create raffle
        raffle = Raffle.objects.create(
            organizador=request.user,
            imagem_principal=imagem_principal,
            **validated_data
        )

        # 🎟️ auto-generate numbers
        NumeroRifa.objects.bulk_create([
            NumeroRifa(
                rifa=raffle,
                numero=i,
                status="disponivel"
            )
            for i in range(1, raffle.total_numeros + 1)
        ])

        # 🖼️ save gallery
        for img in imagens:
            RaffleImage.objects.create(
                raffle=raffle,
                imagem=img
            )

        return raffle

    # =========================
    # 🔒 UPDATE (LOCK FIELDS)
    # =========================
    def update(self, instance, validated_data):

        # 🚫 block changes after sales
        if instance.numeros.filter(status="vendido").exists():

            blocked_fields = [
                "valor_numero",
                "total_numeros",
                "data_sorteio",
            ]

            for field in blocked_fields:
                if field in validated_data:
                    raise serializers.ValidationError(
                        f"O campo '{field}' não pode ser alterado após vendas."
                    )

        return super().update(instance, validated_data)