-- migrations/0001_add_uuid.sql

ALTER TABLE nanny ADD COLUMN new_id UUID DEFAULT gen_random_uuid();


UPDATE nanny
SET new_id = gen_random_uuid();


ALTER TABLE nanny
DROP COLUMN id;


ALTER TABLE nanny RENAME COLUMN new_id TO id;


ALTER TABLE nanny
ALTER COLUMN id
SET NOT NULL;


ALTER TABLE nanny ADD PRIMARY KEY (id);

-- Do similar for other tables (workHistory, recommendations, etc.)

ALTER TABLE "workHistory" ADD COLUMN new_nannyId UUID;


UPDATE "workHistory"
SET new_nannyId = gen_random_uuid();


ALTER TABLE "workHistory"
DROP COLUMN "nannyId";


ALTER TABLE "workHistory" RENAME COLUMN new_nannyId TO "nannyId";

-- Repeat for other tables with foreign key references