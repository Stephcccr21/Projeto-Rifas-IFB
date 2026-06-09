from django.shortcuts import render
from rest_framework import viewsets
from .models import Comment
from .serializers import CommentSerializer
from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from apps.raffles.models import Raffle
from django.shortcuts import get_object_or_404

from .models import Comment
from .serializers import CommentSerializer
from .serializers import (
    CommentSerializer,
    AdminCommentSerializer,
    PublicCommentSerializer,
)

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CriarComentarioView(APIView):

    def post(self, request, raffle_id):

        try:

            raffle = Raffle.objects.get(
                id=raffle_id
            )

        except Raffle.DoesNotExist:

            return Response(
                {"erro": "Rifa não encontrada"},
                status=404
            )

        serializer = CommentSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        comentario = serializer.save(
            raffle=raffle,
            status="pendente"
        )

        send_mail(
            subject="Novo comentário",
            message=(
                f"Novo comentário na rifa "
                f"{raffle.titulo}"
            ),
            from_email=None,
            recipient_list=[
                raffle.organizador.email
            ],
            fail_silently=True,
        )

        return Response(
            CommentSerializer(
                comentario
            ).data,
            status=201
        )
class ComentariosPublicosView(APIView):

    def get(self, request, raffle_id):

        comentarios = Comment.objects.filter(
            raffle_id=raffle_id,
            status="aprovado"
        )

        serializer = PublicCommentSerializer(
            comentarios,
            many=True
        )

        return Response(serializer.data)    
class ComentariosPendentesView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        comentarios = Comment.objects.filter(
            raffle__organizador=request.user,
            status="pendente"
        )

        serializer = CommentSerializer(
            comentarios,
            many=True
        )

        return Response(serializer.data)    
class AprovarComentarioView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def put(self, request, comment_id):

        comentario = get_object_or_404(
            Comment,
            id=comment_id,
            raffle__organizador=request.user
        )

        comentario.status = "aprovado"
        comentario.save()

        return Response({
            "mensagem":
            "Comentário aprovado"
        })

class RejeitarComentarioView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def put(self, request, comment_id):

        comentario = get_object_or_404(
            Comment,
            id=comment_id,
            raffle__organizador=request.user
        )

        comentario.status = "rejeitado"
        comentario.save()

        return Response({
            "mensagem":
            "Comentário rejeitado"
        }) 