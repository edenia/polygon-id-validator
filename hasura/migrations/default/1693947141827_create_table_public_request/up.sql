CREATE TABLE "public"."request" ("session_id" uuid NOT NULL DEFAULT gen_random_uuid(), "auth" jsonb NOT NULL, PRIMARY KEY ("session_id") );COMMENT ON TABLE "public"."request" IS E'Store every proofRequest object for every session';
CREATE EXTENSION IF NOT EXISTS pgcrypto;
