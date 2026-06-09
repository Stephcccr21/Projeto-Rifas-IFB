import random

from apps.sales.models import (
    TransactionItem
)

from .models import (
    ResultadoSorteio,
    NumeroRifa
)


def executar_sorteio(rifa):

    premios = rifa.premios.order_by(
        "posicao"
    )

    numeros_pagos = list(
        NumeroRifa.objects.filter(
            rifa=rifa,
            status="pago"
        )
    )

    if not numeros_pagos:

        raise Exception(
            "Não existem números pagos"
        )

    sorteados = []

    for premio in premios:

        disponiveis = [

            n for n in numeros_pagos

            if n.id not in sorteados
        ]

        if not disponiveis:

            break

        numero = random.choice(
            disponiveis
        )

        item = (
           TransactionItem.objects
          .filter(numero=numero)
          .order_by("-id")
          .first()
        )

        ResultadoSorteio.objects.create(
            rifa=rifa,
            premio=premio,
            numero_sorteado=numero,
            comprador_nome=(
                item.transaction.comprador_nome
            )
        )

        sorteados.append(
            numero.id
        )

    rifa.status = "closed"

    rifa.save()

    return True