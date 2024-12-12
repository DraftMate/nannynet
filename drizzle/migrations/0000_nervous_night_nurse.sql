CREATE TABLE IF NOT EXISTS "auth" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"refreshTokenVersion" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "nanny" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"firstName" text NOT NULL,
	"lastName" text NOT NULL,
	"email" text NOT NULL,
	"yearsOfExperience" serial NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recommendations" (
	"id" serial PRIMARY KEY NOT NULL,
	"nannyId" uuid NOT NULL,
	"customerName" text NOT NULL,
	"customerEmail" text NOT NULL,
	"text" text NOT NULL,
	"rating" serial NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workHistory" (
	"id" serial PRIMARY KEY NOT NULL,
	"nannyId" uuid NOT NULL,
	"jobTitle" text NOT NULL,
	"description" text,
	"startDate" timestamp NOT NULL,
	"endDate" timestamp
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "nameIdx" ON "nanny" USING btree ("firstName");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nannyRecommendationsIdx" ON "recommendations" USING btree ("nannyId");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "nannyWorkHistoryIdx" ON "workHistory" USING btree ("nannyId");