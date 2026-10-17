CREATE TABLE "listened" (
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"folge_id" integer NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "listened_user_id_folge_id_pk" PRIMARY KEY("user_id","folge_id")
);
--> statement-breakpoint
ALTER TABLE "listened" ADD CONSTRAINT "listened_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "listened_user_created_at_idx" ON "listened" USING btree ("user_id","created_at");