CREATE TABLE "rating" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"folge_id" integer NOT NULL,
	"score" smallint NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "rating_user_id_folge_id_pk" PRIMARY KEY("user_id","folge_id"),
	CONSTRAINT "rating_score_range_check" CHECK ("rating"."score" between 1 and 6)
);
--> statement-breakpoint
ALTER TABLE "rating" ADD CONSTRAINT "rating_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "rating_folge_id_idx" ON "rating" USING btree ("folge_id");