.PHONY: up down logs bootstrap-validators doctor

up:
	docker compose up --build

down:
	docker compose down -v

logs:
	docker compose logs -f --tail=200

bootstrap-validators:
	./scripts/bootstrap_en16931.sh

doctor:
	./scripts/doctor.sh
