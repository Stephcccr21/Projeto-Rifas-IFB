from celery import shared_task

from django.utils import timezone

from .models import Raffle

from .services import executar_sorteio


@shared_task
def verificar_sorteios():

    print("🔥 INICIANDO VERIFICAÇÃO DE SORTEIOS")

    rifas = Raffle.objects.filter(
        status="active",
        data_sorteio__lte=timezone.now()
    )

    print(f"🎟️ Rifas encontradas: {rifas.count()}")

    for rifa in rifas:

        print(
            f"➡️ Processando rifa: "
            f"{rifa.id} - {rifa.titulo}"
        )

        try:

            executar_sorteio(rifa)

            print(
                f"✅ Sorteio executado "
                f"para a rifa {rifa.id}"
            )

        except Exception as e:

            print(
                f"❌ Erro na rifa "
                f"{rifa.id}: {e}"
            )