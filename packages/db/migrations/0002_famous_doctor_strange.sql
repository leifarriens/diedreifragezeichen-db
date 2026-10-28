CREATE TABLE "bookmark" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"folge_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "bookmark_user_id_folge_id_pk" PRIMARY KEY("user_id","folge_id")
);
--> statement-breakpoint
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "bookmark_user_created_at_idx" ON "bookmark" USING btree ("user_id","created_at");