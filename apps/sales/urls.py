from django.urls import path
from .views import UploadComprovanteView

from .views import (
    ReservarNumerosView,
    TransactionDetailView,
    TransacoesPendentesView,
    AprovarTransacaoView,
    RejeitarTransacaoView,

)

urlpatterns = [

    path(
        "raffle/<int:raffle_id>/reservar/",
        ReservarNumerosView.as_view(),
        name="reservar-numeros"
    ),
    path(
        "transacao/<int:transaction_id>/",
        TransactionDetailView.as_view(),
        name="transaction-detail"
    ),
    path(
        "transacao/<int:transaction_id>/comprovante/",
        UploadComprovanteView.as_view(),
        name="upload-comprovante"
    ),
    path(
        "organizador/transacoes/pendentes/",
        TransacoesPendentesView.as_view(),
        name="transacoes-pendentes"
    ),

    path(
        "transacao/<int:transaction_id>/aprovar/",
        AprovarTransacaoView.as_view(),
        name="aprovar-transacao"
    ),

    path(
        "transacao/<int:transaction_id>/rejeitar/",
        RejeitarTransacaoView.as_view(),
        name="rejeitar-transacao"
    ),  
    
    

]