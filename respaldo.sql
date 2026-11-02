


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."set_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'pg_catalog'
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."set_updated_at"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."bitacora" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "action" "text" NOT NULL,
    "affected_table" "text",
    "record_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."bitacora" OWNER TO "postgres";


ALTER TABLE "public"."bitacora" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."bitacora_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."categorias" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "admin_id" bigint,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."categorias" OWNER TO "postgres";


ALTER TABLE "public"."categorias" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."categorias_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."detalle_ventas" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "sale_id" bigint NOT NULL,
    "product_id" bigint NOT NULL,
    "quantity" integer NOT NULL,
    "unit_price" numeric(12,2) NOT NULL,
    "subtotal" numeric(12,2) NOT NULL,
    CONSTRAINT "detalle_ventas_quantity_check" CHECK (("quantity" > 0)),
    CONSTRAINT "detalle_ventas_subtotal_calculation_check" CHECK (("subtotal" = (("quantity")::numeric * "unit_price"))),
    CONSTRAINT "detalle_ventas_subtotal_check" CHECK (("subtotal" >= (0)::numeric)),
    CONSTRAINT "detalle_ventas_unit_price_check" CHECK (("unit_price" >= (0)::numeric))
);


ALTER TABLE "public"."detalle_ventas" OWNER TO "postgres";


ALTER TABLE "public"."detalle_ventas" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."detalle_ventas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."empresas" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "address" "text",
    "status" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "foto_public_id" "text",
    "foto_url" "text"
);


ALTER TABLE "public"."empresas" OWNER TO "postgres";


ALTER TABLE "public"."empresas" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."empresas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."inventario" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "branch_id" bigint NOT NULL,
    "product_id" bigint NOT NULL,
    "quantity" integer DEFAULT 0 NOT NULL,
    "min_stock" integer DEFAULT 5 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "inventario_min_stock_check" CHECK (("min_stock" >= 0)),
    CONSTRAINT "inventario_quantity_check" CHECK (("quantity" >= 0))
);


ALTER TABLE "public"."inventario" OWNER TO "postgres";


ALTER TABLE "public"."inventario" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."inventario_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."metodos_pago" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "status" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."metodos_pago" OWNER TO "postgres";


ALTER TABLE "public"."metodos_pago" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."metodos_pago_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."productos" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "code" bigint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "price" numeric(12,2) NOT NULL,
    "category_id" bigint NOT NULL,
    "admin_id" bigint,
    "status" boolean DEFAULT true NOT NULL,
    "foto_url" "text",
    "foto_public_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "productos_price_check" CHECK (("price" >= (0)::numeric))
);


ALTER TABLE "public"."productos" OWNER TO "postgres";


ALTER TABLE "public"."productos" ALTER COLUMN "code" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."productos_code_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE "public"."productos" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."productos_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."roles" (
    "id" smallint NOT NULL,
    "name" "text" NOT NULL,
    "description" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."roles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sucursales" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "admin_id" bigint,
    "name" "text" NOT NULL,
    "direction" "text" NOT NULL,
    "phone" "text",
    "contact_info" "text",
    "status" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "foto_public_id" "text",
    "foto_url" "text"
);


ALTER TABLE "public"."sucursales" OWNER TO "postgres";


ALTER TABLE "public"."sucursales" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."sucursales_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."usuarios" (
    "id" bigint NOT NULL,
    "auth_user_id" "uuid" NOT NULL,
    "company_id" bigint NOT NULL,
    "rol_id" smallint NOT NULL,
    "name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "status" boolean DEFAULT true NOT NULL,
    "admin_id" bigint,
    "manager_id" bigint,
    "branch_id" bigint,
    "foto_url" "text",
    "foto_public_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "usuarios_admin_not_self" CHECK ((("admin_id" IS NULL) OR ("admin_id" <> "id"))),
    CONSTRAINT "usuarios_manager_not_self" CHECK ((("manager_id" IS NULL) OR ("manager_id" <> "id")))
);


ALTER TABLE "public"."usuarios" OWNER TO "postgres";


ALTER TABLE "public"."usuarios" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."usuarios_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."ventas" (
    "id" bigint NOT NULL,
    "company_id" bigint NOT NULL,
    "branch_id" bigint NOT NULL,
    "cashier_id" bigint NOT NULL,
    "payment_method_id" bigint NOT NULL,
    "sale_date" timestamp with time zone DEFAULT "now"() NOT NULL,
    "subtotal" numeric(12,2) NOT NULL,
    "tax_rate" numeric(5,4) NOT NULL,
    "tax_amount" numeric(12,2) NOT NULL,
    "total" numeric(12,2) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ventas_subtotal_check" CHECK (("subtotal" >= (0)::numeric)),
    CONSTRAINT "ventas_tax_amount_check" CHECK (("tax_amount" >= (0)::numeric)),
    CONSTRAINT "ventas_tax_rate_check" CHECK ((("tax_rate" >= (0)::numeric) AND ("tax_rate" <= (1)::numeric))),
    CONSTRAINT "ventas_total_check" CHECK (("total" >= (0)::numeric)),
    CONSTRAINT "ventas_total_sum_check" CHECK (("total" = ("subtotal" + "tax_amount")))
);


ALTER TABLE "public"."ventas" OWNER TO "postgres";


ALTER TABLE "public"."ventas" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "public"."ventas_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



ALTER TABLE ONLY "public"."bitacora"
    ADD CONSTRAINT "bitacora_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_company_name_unique" UNIQUE ("company_id", "name");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."empresas"
    ADD CONSTRAINT "empresas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_branch_product_unique" UNIQUE ("branch_id", "product_id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."metodos_pago"
    ADD CONSTRAINT "metodos_pago_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."metodos_pago"
    ADD CONSTRAINT "metodos_pago_company_name_unique" UNIQUE ("company_id", "name");



ALTER TABLE ONLY "public"."metodos_pago"
    ADD CONSTRAINT "metodos_pago_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."roles"
    ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."sucursales"
    ADD CONSTRAINT "sucursales_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."sucursales"
    ADD CONSTRAINT "sucursales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_auth_user_id_key" UNIQUE ("auth_user_id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_company_id_id_unique" UNIQUE ("company_id", "id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_pkey" PRIMARY KEY ("id");



CREATE INDEX "bitacora_company_date_idx" ON "public"."bitacora" USING "btree" ("company_id", "created_at");



CREATE INDEX "detalle_ventas_company_sale_idx" ON "public"."detalle_ventas" USING "btree" ("company_id", "sale_id");



CREATE INDEX "inventario_company_branch_idx" ON "public"."inventario" USING "btree" ("company_id", "branch_id");



CREATE INDEX "usuarios_company_branch_idx" ON "public"."usuarios" USING "btree" ("company_id", "branch_id");



CREATE INDEX "ventas_company_branch_date_idx" ON "public"."ventas" USING "btree" ("company_id", "branch_id", "sale_date");



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."categorias" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."empresas" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."inventario" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."productos" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."sucursales" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



CREATE OR REPLACE TRIGGER "set_updated_at" BEFORE UPDATE ON "public"."usuarios" FOR EACH ROW EXECUTE FUNCTION "public"."set_updated_at"();



ALTER TABLE ONLY "public"."bitacora"
    ADD CONSTRAINT "bitacora_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."bitacora"
    ADD CONSTRAINT "bitacora_user_fkey" FOREIGN KEY ("company_id", "user_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_admin_fkey" FOREIGN KEY ("company_id", "admin_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."categorias"
    ADD CONSTRAINT "categorias_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_product_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."productos"("company_id", "id");



ALTER TABLE ONLY "public"."detalle_ventas"
    ADD CONSTRAINT "detalle_ventas_sale_fkey" FOREIGN KEY ("company_id", "sale_id") REFERENCES "public"."ventas"("company_id", "id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_branch_fkey" FOREIGN KEY ("company_id", "branch_id") REFERENCES "public"."sucursales"("company_id", "id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."inventario"
    ADD CONSTRAINT "inventario_product_fkey" FOREIGN KEY ("company_id", "product_id") REFERENCES "public"."productos"("company_id", "id");



ALTER TABLE ONLY "public"."metodos_pago"
    ADD CONSTRAINT "metodos_pago_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_admin_fkey" FOREIGN KEY ("company_id", "admin_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_category_fkey" FOREIGN KEY ("company_id", "category_id") REFERENCES "public"."categorias"("company_id", "id");



ALTER TABLE ONLY "public"."productos"
    ADD CONSTRAINT "productos_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."sucursales"
    ADD CONSTRAINT "sucursales_admin_fkey" FOREIGN KEY ("company_id", "admin_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."sucursales"
    ADD CONSTRAINT "sucursales_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_admin_fkey" FOREIGN KEY ("company_id", "admin_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_auth_user_id_fkey" FOREIGN KEY ("auth_user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_branch_fkey" FOREIGN KEY ("company_id", "branch_id") REFERENCES "public"."sucursales"("company_id", "id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_manager_fkey" FOREIGN KEY ("company_id", "manager_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."usuarios"
    ADD CONSTRAINT "usuarios_rol_id_fkey" FOREIGN KEY ("rol_id") REFERENCES "public"."roles"("id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_branch_fkey" FOREIGN KEY ("company_id", "branch_id") REFERENCES "public"."sucursales"("company_id", "id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_cashier_fkey" FOREIGN KEY ("company_id", "cashier_id") REFERENCES "public"."usuarios"("company_id", "id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."empresas"("id");



ALTER TABLE ONLY "public"."ventas"
    ADD CONSTRAINT "ventas_payment_method_fkey" FOREIGN KEY ("company_id", "payment_method_id") REFERENCES "public"."metodos_pago"("company_id", "id");



ALTER TABLE "public"."bitacora" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."categorias" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."detalle_ventas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."empresas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."inventario" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."metodos_pago" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."productos" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."roles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sucursales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usuarios" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."ventas" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";






















































































































































GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_updated_at"() TO "service_role";


















GRANT ALL ON TABLE "public"."bitacora" TO "anon";
GRANT ALL ON TABLE "public"."bitacora" TO "authenticated";
GRANT ALL ON TABLE "public"."bitacora" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bitacora_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bitacora_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bitacora_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."categorias" TO "anon";
GRANT ALL ON TABLE "public"."categorias" TO "authenticated";
GRANT ALL ON TABLE "public"."categorias" TO "service_role";



GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."categorias_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."detalle_ventas" TO "anon";
GRANT ALL ON TABLE "public"."detalle_ventas" TO "authenticated";
GRANT ALL ON TABLE "public"."detalle_ventas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."detalle_ventas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."empresas" TO "anon";
GRANT ALL ON TABLE "public"."empresas" TO "authenticated";
GRANT ALL ON TABLE "public"."empresas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."empresas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."empresas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."empresas_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."inventario" TO "anon";
GRANT ALL ON TABLE "public"."inventario" TO "authenticated";
GRANT ALL ON TABLE "public"."inventario" TO "service_role";



GRANT ALL ON SEQUENCE "public"."inventario_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."inventario_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."inventario_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."metodos_pago" TO "anon";
GRANT ALL ON TABLE "public"."metodos_pago" TO "authenticated";
GRANT ALL ON TABLE "public"."metodos_pago" TO "service_role";



GRANT ALL ON SEQUENCE "public"."metodos_pago_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."metodos_pago_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."metodos_pago_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."productos" TO "anon";
GRANT ALL ON TABLE "public"."productos" TO "authenticated";
GRANT ALL ON TABLE "public"."productos" TO "service_role";



GRANT ALL ON SEQUENCE "public"."productos_code_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."productos_code_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."productos_code_seq" TO "service_role";



GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."productos_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."roles" TO "anon";
GRANT ALL ON TABLE "public"."roles" TO "authenticated";
GRANT ALL ON TABLE "public"."roles" TO "service_role";



GRANT ALL ON TABLE "public"."sucursales" TO "anon";
GRANT ALL ON TABLE "public"."sucursales" TO "authenticated";
GRANT ALL ON TABLE "public"."sucursales" TO "service_role";



GRANT ALL ON SEQUENCE "public"."sucursales_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."sucursales_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."sucursales_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."usuarios" TO "anon";
GRANT ALL ON TABLE "public"."usuarios" TO "authenticated";
GRANT ALL ON TABLE "public"."usuarios" TO "service_role";



GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."usuarios_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."ventas" TO "anon";
GRANT ALL ON TABLE "public"."ventas" TO "authenticated";
GRANT ALL ON TABLE "public"."ventas" TO "service_role";



GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."ventas_id_seq" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































