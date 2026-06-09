from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):

    class Meta:

        model = Comment

        fields = (
            "id",
            "raffle",
            "nome",
            "email",
            "texto",
            "status",
            "created_at",
        )

        read_only_fields = (
            "status",
            "created_at",
        )
class AdminCommentSerializer(serializers.ModelSerializer):

    class Meta:

        model = Comment

        fields = "__all__"     

class PublicCommentSerializer(serializers.ModelSerializer):

    class Meta:

        model = Comment

        fields = (
            "id",
            "nome",
            "texto",
            "created_at",
        )           