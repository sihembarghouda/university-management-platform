# Absence Service

Local microservice that provides absence management endpoints copied from the admin-service.

Quick start (PowerShell):

```powershell
cd backend\absence-service
copy .env.example .env # or create .env with DB and JWT secrets
npm install
npm run start:dev
```

Defaults in `.env.example`:
- DB: `localhost:5432`, user `postgres`, password `123456789`, database `university_db`
- JWT_SECRET: same as `auth-service` (ensure tokens are signed with the same secret)

Important: `.env` is ignored in git. Keep secrets out of the repo.

Endpoints (require Authorization: Bearer <token>):
- `GET /absences` — list absences
- `POST /absences` — create absence
- `GET /absences/statistiques` — summary statistics
- `GET /absences/etudiants-a-risque` — students at risk
- `GET /absences/etudiant/:etudiantId` — absences for a student
- `GET /absences/matiere/:matiereId` — absences for a subject
- `POST /absences/:id/justifier` — justify an absence

Teacher absence requests
- Teachers submit their own absence requests by `POST /absences` with `sujet: 'enseignant'`. The service will set `enseignantId` to the teacher's id and the request will be created with status `en_attente` for the director to review.
- Directors can filter teacher requests with `GET /absences?type=enseignant` and validate/refuse as usual.

Testing tip: generate a JWT with `node tools/gen-token.js` (uses `process.env.JWT_SECRET` or the example secret).

Database schema / migrations
 - The service previously used `synchronize: true` for quick local testing. That setting has been reverted to
	`synchronize: false` in `src/app.module.ts`. Before deploying or running this service in a shared environment,
	create a migration for the `absence` entity and other required tables using TypeORM (or run the SQL export below).

Quick migration steps (TypeORM CLI):
1. Install TypeORM globally (or use npx):
	```powershell
	cd backend\absence-service
	npm install --save-dev typeorm ts-node
	npx typeorm migration:generate -n initAbsence -- -d src/migrations
	npx typeorm migration:run
	```

2. If you prefer SQL, export the current schema created during testing and apply it to the target DB. Example (psql):
	```powershell
	pg_dump -h localhost -p 5432 -U postgres -s university_db > absence-schema.sql
	psql -h target_host -p target_port -U target_user -d target_db -f absence-schema.sql
	```

Notes:
 - Keep `synchronize: false` for production and use migrations to evolve schema safely.
 - Ensure `JWT_SECRET` is the same as in `auth-service` when sharing authentication between services.
