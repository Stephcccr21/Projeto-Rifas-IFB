from django.db import transaction

def create_order(buyer, raffle, tickets):
    with transaction.atomic():
        # validate + lock tickets
        # create order
        # mark tickets as sold
        pass