from django.urls import path

from rest_framework.routers import DefaultRouter

from .views import (
    CommentViewSet,
    CriarComentarioView,
    ComentariosPublicosView,
    ComentariosPendentesView,
    AprovarComentarioView,
    RejeitarComentarioView,
)

router = DefaultRouter()
router.register(
    r"comments",
    CommentViewSet
)

urlpatterns = [

    path(
        "rifa/<int:raffle_id>/comentarios/",
        CriarComentarioView.as_view(),
    ),

    path(
        "rifa/<int:raffle_id>/comentarios/listar/",
        ComentariosPublicosView.as_view(),
    ),

    path(
        "organizador/comentarios/pendentes/",
        ComentariosPendentesView.as_view(),
    ),

    path(
        "comentarios/<int:comment_id>/aprovar/",
        AprovarComentarioView.as_view(),
    ),

    path(
        "comentarios/<int:comment_id>/rejeitar/",
        RejeitarComentarioView.as_view(),
    ),

]

urlpatterns += router.urls