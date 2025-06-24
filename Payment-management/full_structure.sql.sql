--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: audit; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA audit;


ALTER SCHEMA audit OWNER TO postgres;

--
-- Name: user_management; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA user_management;


ALTER SCHEMA user_management OWNER TO postgres;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: audit_metadata; Type: TYPE; Schema: audit; Owner: postgres
--

CREATE TYPE audit.audit_metadata AS (
	created_by uuid,
	created_date timestamp with time zone,
	modified_by uuid,
	modified_date timestamp with time zone,
	header jsonb
);


ALTER TYPE audit.audit_metadata OWNER TO postgres;

--
-- Name: user_info_type; Type: TYPE; Schema: user_management; Owner: postgres
--

CREATE TYPE user_management.user_info_type AS (
	user_id integer,
	emp_id text,
	name text,
	email text,
	designation text,
	dept_name text,
	status text
);


ALTER TYPE user_management.user_info_type OWNER TO postgres;

--
-- Name: insert_audit_log(uuid, character varying, character varying, character varying, character varying, uuid, jsonb, jsonb, character varying, inet, text, character varying, audit.audit_metadata); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.insert_audit_log(p_actor_id uuid, p_actor_type character varying, p_actor_role character varying, p_action character varying, p_entity_type character varying, p_entity_id uuid, p_prev_state jsonb, p_new_state jsonb, p_action_result character varying, p_ip_address inet, p_user_agent text, p_channel character varying, p_metadata audit.audit_metadata) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit.audit_trail (
        actor_id, actor_type, actor_role, action, entity_type, entity_id,
        prev_state, new_state, action_result, ip_address,
        user_agent, channel, metadata
    ) VALUES (
        p_actor_id, p_actor_type, p_actor_role, p_action, p_entity_type, p_entity_id,
        p_prev_state, p_new_state, COALESCE(p_action_result, 'SUCCESS'), p_ip_address,
        p_user_agent, p_channel, p_metadata
    );
END;
$$;


ALTER FUNCTION audit.insert_audit_log(p_actor_id uuid, p_actor_type character varying, p_actor_role character varying, p_action character varying, p_entity_type character varying, p_entity_id uuid, p_prev_state jsonb, p_new_state jsonb, p_action_result character varying, p_ip_address inet, p_user_agent text, p_channel character varying, p_metadata audit.audit_metadata) OWNER TO postgres;

--
-- Name: log_application_error(character varying, character varying, character varying, text, character varying, character varying, jsonb, jsonb); Type: FUNCTION; Schema: audit; Owner: postgres
--

CREATE FUNCTION audit.log_application_error(p_service_name character varying, p_module_name character varying, p_log_level character varying, p_message text, p_error_no character varying, p_request_method character varying, p_request_payload jsonb, p_header jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO audit.application_error_log (
        service_name, module_name, log_level, message,
        error_no, request_method, request_payload, header
    ) VALUES (
        p_service_name, p_module_name, p_log_level, p_message,
        p_error_no, p_request_method, p_request_payload, p_header
    );
END;
$$;


ALTER FUNCTION audit.log_application_error(p_service_name character varying, p_module_name character varying, p_log_level character varying, p_message text, p_error_no character varying, p_request_method character varying, p_request_payload jsonb, p_header jsonb) OWNER TO postgres;

--
-- Name: department_details(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.department_details() RETURNS TABLE(designation_id smallint, designation_desc character varying, dept_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN  
  RETURN query
  select a.designation_id,a.designation_desc,b.dept_name 
from user_management."tbl_Designation" a join user_management."tbl_Department" b on
a.dept_id=b.dept_id;
END;
$$;


ALTER FUNCTION public.department_details() OWNER TO postgres;

--
-- Name: insert_audit_trail(text, text, text, text, timestamp without time zone, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp without time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public."AuditTrail" (
        entity_name,
        entity_id,
        action,
        changed_by,
        changed_on,
        old_values,
        new_values,
        changed_columns,
        source_ip
    )
    VALUES (
        p_entity_name,
        p_entity_id,
        p_action,
        p_changed_by,
        p_changed_on,
        p_old_values,
        p_new_values,
        p_changed_columns,
        p_source_ip
    );
END;
$$;


ALTER FUNCTION public.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp without time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) OWNER TO postgres;

--
-- Name: insert_audit_trail(text, text, text, text, timestamp with time zone, text, text, text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp with time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO public."AuditTrail" (
        entity_name,
        entity_id,
        action,
        changed_by,
        changed_on,
        old_values,
        new_values,
        changed_columns,
        source_ip
    )
    VALUES (
        p_entity_name,
        p_entity_id,
        p_action,
        p_changed_by,
        p_changed_on,
        p_old_values,
        p_new_values,
        p_changed_columns,
        p_source_ip
    );
END;
$$;


ALTER FUNCTION public.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp with time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) OWNER TO postgres;

--
-- Name: user_creation_fn(character varying, integer, text, text, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  response VARCHAR;
BEGIN
  IF EXISTS (
    SELECT 1 FROM user_table 
    WHERE name = p_name AND email = p_email
  ) THEN
    response := 'The user already exists';
  ELSE
    INSERT INTO user_table(name, age, email, password, user_type, created_at)
    VALUES (p_name, p_age, p_email, crypt(p_password, gen_salt('bf')), p_user_type, now() AT TIME ZONE 'Asia/Kolkata');

    response := 'The new user is created';
  END IF;

  RETURN response;
END;
$$;


ALTER FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer) OWNER TO postgres;

--
-- Name: user_creation_fn(character varying, integer, text, text, text, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_empid text, p_department_name character varying, p_position character varying, p_pages_info character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  response VARCHAR;
BEGIN
  IF EXISTS (
    SELECT 1 FROM user_table 
    WHERE name = p_name AND email = p_email
  ) THEN
    response := 'The user already exists';
  ELSE
    INSERT INTO user_table(name, age, email, password, user_type, created_at,"EMPID",department_name,pages_info,position)
    VALUES (p_name, p_age, p_email, crypt(p_password, gen_salt('bf')),2, now() AT TIME ZONE 'Asia/Kolkata',
	'EMP'||p_empid,p_department_name,p_pages_info,p_position);
    response := 'The new user is created';
  END IF;

  RETURN response;
END;
$$;


ALTER FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_empid text, p_department_name character varying, p_position character varying, p_pages_info character varying) OWNER TO postgres;

--
-- Name: user_creation_fn(character varying, smallint, character varying, text, text, smallint, smallint, character varying, integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_creation_fn(p_emp_id character varying, p_dept_id smallint, p_name character varying, p_email text, p_password text, p_status_id smallint, p_module_access_id smallint, p_created_by character varying, p_user_type integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    response VARCHAR;
BEGIN
    -- Check if user already exists
    IF EXISTS (
        SELECT 1 FROM "User Management"."tbl_Users"
        WHERE LOWER(name) = LOWER(p_name)
          AND LOWER(email) = LOWER(p_email)
    ) THEN
        response := '⚠️ The user already exists';
    ELSE
        -- Insert new user
        INSERT INTO "User Management"."tbl_Users" (
            emp_id, "Dept_ID", name, email, password,
            status_id, module_access_id, created_at,
            user_type, created_by
        )
        VALUES (
            p_emp_id, p_dept_id, p_name, p_email,
            crypt(p_password, gen_salt('bf')),
            p_status_id, p_module_access_id,
            now() AT TIME ZONE 'Asia/Kolkata',
            p_user_type, p_created_by
        );

        response := '✅ New user created successfully';
    END IF;

    RETURN response;
END;
$$;


ALTER FUNCTION public.user_creation_fn(p_emp_id character varying, p_dept_id smallint, p_name character varying, p_email text, p_password text, p_status_id smallint, p_module_access_id smallint, p_created_by character varying, p_user_type integer) OWNER TO postgres;

--
-- Name: user_creation_fn(character varying, integer, text, text, integer, text, character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer, p_empid text, p_department_name character varying, p_position character varying, p_pages_info character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  response VARCHAR;
BEGIN
  IF EXISTS (
    SELECT 1 FROM user_table 
    WHERE name = p_name AND email = p_email
  ) THEN
    response := 'The user already exists';
  ELSE
    INSERT INTO user_table(name, age, email, password, user_type, created_at,"EMPID",department_name,pages_info,position)
    VALUES (p_name, p_age, p_email, crypt(p_password, gen_salt('bf')),p_user_type, now() AT TIME ZONE 'Asia/Kolkata',
	'EMP'||p_empid,p_department_name,p_pages_info,p_position);
    response := 'The new user is created';
  END IF;

  RETURN response;
END;
$$;


ALTER FUNCTION public.user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer, p_empid text, p_department_name character varying, p_position character varying, p_pages_info character varying) OWNER TO postgres;

--
-- Name: user_department_creations(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_department_creations(dept_name character varying, designation_name character varying) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    response VARCHAR;
    new_dept_id INTEGER;
BEGIN
    -- Check if department already exists
    IF EXISTS (
        SELECT 1 FROM "User Management"."tbl_Department"
        WHERE "Dept_Name" = dept_name
    ) THEN
        response := 'The department name already exists';
    ELSE
        -- Insert new department and retrieve Dept_ID
        INSERT INTO "User Management"."tbl_Department" ("Dept_Name")
        VALUES (dept_name)
        RETURNING "Dept_ID" INTO new_dept_id;

        -- Insert designation with new Dept_ID
        INSERT INTO "User Management"."tbl_Designation" ("Dept_ID", "Designation_Desc")
        OVERRIDING SYSTEM VALUE
        VALUES (new_dept_id, designation_name);


        response := 'The department and designation have been created';
    END IF;

    RETURN response;
END;
$$;


ALTER FUNCTION public.user_department_creations(dept_name character varying, designation_name character varying) OWNER TO postgres;

--
-- Name: user_dept_details(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_dept_details(p_department_name character varying) RETURNS TABLE("P_NAME" character varying, "P_EMPID" text, "POSITION" character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  -- Only return results if department_name is one of the expected values
  IF p_department_name IN ('IT', 'HR', 'developer', 'Testing') THEN
    RETURN QUERY
    SELECT name, "EMPID", position
    FROM user_table
    WHERE department_name = p_department_name;
  END IF;
END;
$$;


ALTER FUNCTION public.user_dept_details(p_department_name character varying) OWNER TO postgres;

--
-- Name: user_details(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_details() RETURNS TABLE("NAME" character varying, "AGE" integer, "USER_TYPE" character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN  
  RETURN query
  SELECT "name" as "NAME", u."age" as "AGE",a.user_type as  "USERTYPE"
  FROM "user_table" u 
JOIN user_admin_table a ON u."user_type" = a.role_id  order by a.user_type;
END;
$$;


ALTER FUNCTION public.user_details() OWNER TO postgres;

--
-- Name: user_password_check(text, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_password_check(p_username text, p_password text) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  db_password TEXT;
  response VARCHAR;
BEGIN
  -- Try to get the password hash from the user table
  SELECT password INTO db_password
  FROM user_management."tbl_Users"
  WHERE name = p_username;

  -- If no row found
  IF NOT FOUND THEN
    response := 'the user does not exist';
  ELSIF crypt(p_password, db_password) = db_password THEN
    response := 'the user exists and password matched';
  ELSE
    response := 'the user exists and password not matched';
  END IF;

  RETURN response;
END;
$$;


ALTER FUNCTION public.user_password_check(p_username text, p_password text) OWNER TO postgres;

--
-- Name: user_password_check(character varying, text); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.user_password_check(p_username character varying, p_password text) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
  db_password TEXT;
  response VARCHAR;
BEGIN
  -- Try to get the password hash from the user table
  SELECT password INTO db_password
  FROM user_management."tbl_Users"
  WHERE name = p_username;

  -- If no row found
  IF NOT FOUND THEN
    response := 'the user does not exist';
  ELSIF crypt(p_password, db_password) = db_password THEN
    response := 'the user exists and password matched';
  ELSE
    response := 'the user exists and password not matched';
  END IF;

  RETURN response;
END;
$$;


ALTER FUNCTION public.user_password_check(p_username character varying, p_password text) OWNER TO postgres;

--
-- Name: add_module_with_screens(character varying, text[], smallint); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens text[], p_designation_id smallint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_module_id SMALLINT;
    screen TEXT;
BEGIN
    -- Insert into tbl_Module and get new Module_ID
    INSERT INTO "user_management"."tbl_Module" (module_Description)
    VALUES (p_module_desc)
    RETURNING module_id INTO new_module_id;

    -- Insert each screen for the new module
    FOREACH screen IN ARRAY p_screens LOOP
        INSERT INTO "user_management"."tbl_Screens" (Screen_Desc, module_id)
        VALUES (screen, new_module_id);
    END LOOP;

    -- Grant access to the module for the given designation
    INSERT INTO "user_management"."tbl_ModuleAccess" (module_id,designation_id)
    VALUES (new_module_id, p_designation_id);

    RETURN '✅ Module, Screens, and Access added.';
END;
$$;


ALTER FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens text[], p_designation_id smallint) OWNER TO postgres;

--
-- Name: add_module_with_screens(character varying, character varying, smallint); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens character varying, p_designation_id smallint) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
	new_module_id smallint;
BEGIN
	-- Insert the new module and retrieve the module_id
	INSERT INTO user_management."tbl_Module" (module_description)
	VALUES (p_module_desc)
	RETURNING module_id INTO new_module_id;

	-- Insert the screen related to the module
	INSERT INTO user_management."tbl_Screens" (Screen_Desc, module_id)
	VALUES (p_screens, new_module_id);

	-- Grant access to the module for the given designation
	INSERT INTO user_management."tbl_ModuleAccess" (module_id, designation_id)
	VALUES (new_module_id, p_designation_id);

	RETURN '✅ Module, Screen, and Access added.';
END;
$$;


ALTER FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens character varying, p_designation_id smallint) OWNER TO postgres;

--
-- Name: add_module_with_screens(character varying, character varying, integer); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens character varying, p_designation_id integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
	new_module_id INTEGER;
BEGIN
	INSERT INTO user_management."tbl_Module" (module_description)
	VALUES (p_module_desc)
	RETURNING module_id INTO new_module_id;

	INSERT INTO user_management."tbl_Screens" (Screen_Desc,module_id)
	VALUES (p_screens, new_module_id);

	INSERT INTO user_management."tbl_ModuleAccess" (module_id, designation_id)
	VALUES (new_module_id, p_designation_id);

	RETURN '✅ Module, Screen, and Access added.';
END;
$$;


ALTER FUNCTION user_management.add_module_with_screens(p_module_desc character varying, p_screens character varying, p_designation_id integer) OWNER TO postgres;

--
-- Name: audit_tbl_superusers_changes(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.audit_tbl_superusers_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Prevent recursion if accidentally attached to audit table
    IF TG_TABLE_NAME = 'tbl_SuperUsers_Audit' THEN
        RETURN NULL;
    END IF;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_management."tbl_SuperUsers_Audit" (
            user_id, action_type, new_data, changed_by, table_name
        )
        VALUES (
            NEW.user_id, 'INSERT', to_jsonb(NEW), current_user, TG_TABLE_NAME
        );

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO user_management."tbl_SuperUsers_Audit" (
            user_id, action_type, old_data, new_data, changed_by, table_name
        )
        VALUES (
            OLD.user_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user, TG_TABLE_NAME
        );

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO user_management."tbl_SuperUsers_Audit" (
            user_id, action_type, old_data, changed_by, table_name
        )
        VALUES (
            OLD.user_id, 'DELETE', to_jsonb(OLD), current_user, TG_TABLE_NAME
        );
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION user_management.audit_tbl_superusers_changes() OWNER TO postgres;

--
-- Name: audit_tbl_users_changes(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.audit_tbl_users_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Prevent recursion if accidentally attached to audit table
    IF TG_TABLE_NAME = 'tbl_Users' THEN
        RETURN NULL;
    END IF;

    IF TG_OP = 'INSERT' THEN
        INSERT INTO user_management."tbl_Users" (
            user_id, action_type, new_data, changed_by, table_name
        )
        VALUES (
            NEW.user_id, 'INSERT', to_jsonb(NEW), current_user, TG_TABLE_NAME
        );

    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO user_management."tbl_Users" (
            user_id, action_type, old_data, new_data, changed_by, table_name
        )
        VALUES (
            OLD.user_id, 'UPDATE', to_jsonb(OLD), to_jsonb(NEW), current_user, TG_TABLE_NAME
        );

    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO user_management."tbl_Users" (
            user_id, action_type, old_data, changed_by, table_name
        )
        VALUES (
            OLD.user_id, 'DELETE', to_jsonb(OLD), current_user, TG_TABLE_NAME
        );
    END IF;

    RETURN NULL;
END;
$$;


ALTER FUNCTION user_management.audit_tbl_users_changes() OWNER TO postgres;

--
-- Name: department_details(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.department_details() RETURNS TABLE(designation_id smallint, designation_desc character varying, dept_name character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN  
  RETURN query
  select a.designation_id,a.dept_id,a.designation_desc,b.dept_name 
from user_management."tbl_Designation" a join user_management."tbl_Department" b on
a.dept_id=b.dept_id;
END;
$$;


ALTER FUNCTION user_management.department_details() OWNER TO postgres;

--
-- Name: get_all_normal_users_access_details(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.get_all_normal_users_access_details() RETURNS TABLE("NAME" text, "EMPID" text, "STATUS DESCRIPTION" text, "DESIGNATION DESCRIPTION" text, "DEPARTMENT NAME" text, "SCREEN DESCRIPTION" text)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.name::TEXT,
    u.emp_id::TEXT,
    us.status_description::TEXT,
    d.designation_desc::TEXT,
    dept.dept_name::TEXT,
    s.screen_desc::TEXT
  FROM user_management."tbl_Users" u
  JOIN user_management."tbl_UserStatus" us ON u.status_id = us.status_id
  JOIN user_management."tbl_Designation" d ON u.designation_id = d.designation_id
  JOIN user_management."tbl_Department" dept ON d.dept_id = dept.dept_id
  JOIN user_management."tbl_ModuleAccess" ma ON ma.designation_id = d.designation_id
  JOIN user_management."tbl_Screens" s ON s.module_id = ma.module_id
  JOIN public.user_admin_table ua ON u.user_type = ua.role_id
  WHERE LOWER(ua.user_type) = 'normal_user';
END;
$$;


ALTER FUNCTION user_management.get_all_normal_users_access_details() OWNER TO postgres;

--
-- Name: get_user_info(integer); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.get_user_info(p_user_id integer) RETURNS user_management.user_info_type
    LANGUAGE plpgsql
    AS $$
DECLARE
    result user_management.user_info_type;
BEGIN
    SELECT 
        u.user_id,
        u.emp_id,
        u.name,
        u.email,
        d.designation_desc,
        dept.dept_name,
        s.status_description
    INTO result
    FROM user_management."tbl_Users" u
    JOIN user_management."tbl_Designation" d ON u.designation_id = d.designation_id
    JOIN user_management."tbl_Department" dept ON d.dept_id = dept.dept_id
    JOIN user_management."tbl_UserStatus" s ON u.status_id = s.status_id
    WHERE u.user_id = p_user_id;

    RETURN result;
END;
$$;


ALTER FUNCTION user_management.get_user_info(p_user_id integer) OWNER TO postgres;

--
-- Name: insert_audit_trail(text, text, text, text, timestamp without time zone, text, text, text, text); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp without time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
    INSERT INTO user_management."AuditTrail" (
        entity_name,
        entity_id,
        action,
        changed_by,
        changed_on,
        old_values,
        new_values,
        changed_columns,
        source_ip
    )
    VALUES (
        p_entity_name,
        p_entity_id,
        p_action,
        p_changed_by,
        p_changed_on,
        p_old_values,
        p_new_values,
        p_changed_columns,
        p_source_ip
    );
END;
$$;


ALTER FUNCTION user_management.insert_audit_trail(p_entity_name text, p_entity_id text, p_action text, p_changed_by text, p_changed_on timestamp without time zone, p_old_values text, p_new_values text, p_changed_columns text, p_source_ip text) OWNER TO postgres;

--
-- Name: module_details(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.module_details() RETURNS TABLE(module_id smallint, module_description character varying, screen_id smallint, screen_desc character varying, module_access smallint, designation_id smallint)
    LANGUAGE plpgsql
    AS $$
BEGIN  
  RETURN query
  SELECT t1.module_id,t1.module_description,t2.screen_id,t2.screen_desc,t3.module_access_id,t4.designation_id
FROM "user_management"."tbl_Module" t1
JOIN "user_management"."tbl_Screens" t2 ON t1.module_id = t2.module_id
JOIN "user_management"."tbl_ModuleAccess" t3 ON t2.module_id = t3.module_id
join "user_management"."tbl_Designation" t4 on t4.designation_id=t3.designation_id;
END;
$$;


ALTER FUNCTION user_management.module_details() OWNER TO postgres;

--
-- Name: status_details(); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.status_details() RETURNS TABLE(status_id smallint, status_description character varying)
    LANGUAGE plpgsql
    AS $$
BEGIN
  RETURN QUERY
  SELECT ts.status_id, ts.status_description
  FROM user_management."tbl_UserStatus" ts;
END;
$$;


ALTER FUNCTION user_management.status_details() OWNER TO postgres;

--
-- Name: super_user_creation_fn(character varying, integer, text, text, integer); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.super_user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    response VARCHAR;
BEGIN
    -- Check if user already exists by name and email
    IF EXISTS (
        SELECT 1 FROM user_management."tbl_super_users"
        WHERE name = p_name AND email = p_email
    ) THEN
        response := 'The user already exists';
    ELSE
        -- Insert new user with encrypted password and current timestamp
        INSERT INTO user_management."tbl_super_users"
        (name, age, email, password, user_type, created_at)
        VALUES (
            p_name,
            p_age,
            p_email,
            crypt(p_password, gen_salt('bf')),
            p_user_type,
            now() AT TIME ZONE 'Asia/Kolkata'
        );

        response := 'The new user is created';
    END IF;

    RETURN response;
END;
$$;


ALTER FUNCTION user_management.super_user_creation_fn(p_name character varying, p_age integer, p_email text, p_password text, p_user_type integer) OWNER TO postgres;

--
-- Name: user_creation_fn(character varying, smallint, character varying, text, text, smallint, character varying, integer); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.user_creation_fn(p_emp_id character varying, p_dept_id smallint, p_name character varying, p_email text, p_password text, p_status_id smallint, p_created_by character varying, p_user_type integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    response VARCHAR;
BEGIN
    -- Check if user already exists
    IF EXISTS (
        SELECT 1 FROM "User Management"."tbl_Users"
        WHERE LOWER(name) = LOWER(p_name)
          AND LOWER(email) = LOWER(p_email)
    ) THEN
        response := '⚠️ The user already exists';
    ELSE
        -- Insert new user
        INSERT INTO "User Management"."tbl_Users" (
            emp_id, "Dept_ID", name, email, password,
            status_id,created_at,
            user_type, created_by
        )
        VALUES (
            p_emp_id, p_dept_id, p_name, p_email,
            crypt(p_password, gen_salt('bf')),
            p_status_id,now() AT TIME ZONE 'Asia/Kolkata',
            p_user_type, p_created_by
        );

        response := '✅ New user created successfully';
    END IF;

    RETURN response;
END;
$$;


ALTER FUNCTION user_management.user_creation_fn(p_emp_id character varying, p_dept_id smallint, p_name character varying, p_email text, p_password text, p_status_id smallint, p_created_by character varying, p_user_type integer) OWNER TO postgres;

--
-- Name: user_creation_fn(text, integer, integer, text, text, text, integer, integer, text, integer); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.user_creation_fn(p_emp_id text, p_dept_id integer, p_designation_id integer, p_name text, p_email text, p_password text, p_status_id integer, p_module_access_id integer, p_created_by text, p_user_type integer) RETURNS character varying
    LANGUAGE plpgsql
    AS $$
DECLARE
    response VARCHAR;
BEGIN
    -- Check if user already exists
    IF EXISTS (
        SELECT 1 FROM user_management."tbl_Users"
        WHERE LOWER(name) = LOWER(p_name)
          AND LOWER(email) = LOWER(p_email)
    ) THEN
        response := '⚠️ The user already exists';
    ELSE
        -- Insert new user
        INSERT INTO user_management."tbl_Users" (
            emp_id, "Dept_ID",designation_id,name, email, password,
            status_id,module_access_id,created_at,
            user_type, created_by
        )
        VALUES (
            p_emp_id, p_dept_id, p_designation_id,p_name, p_email,
            crypt(p_password, gen_salt('bf')),
            p_status_id,p_module_access_id,now()::timestamp(0) AT TIME ZONE 'Asia/Kolkata',
            2, p_created_by
        );

        response := '✅ New user created successfully';
    END IF;

    RETURN response;
END;
$$;


ALTER FUNCTION user_management.user_creation_fn(p_emp_id text, p_dept_id integer, p_designation_id integer, p_name text, p_email text, p_password text, p_status_id integer, p_module_access_id integer, p_created_by text, p_user_type integer) OWNER TO postgres;

--
-- Name: user_department_creations(character varying, character varying); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.user_department_creations(p_dept_name character varying, p_designation_name character varying) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_dept_id INTEGER;
    designation_exists BOOLEAN := FALSE;
BEGIN
    -- Check if department exists (case-insensitive)
    SELECT dept_id INTO new_dept_id
    FROM user_management."tbl_Department"
    WHERE LOWER(dept_name) = LOWER(p_dept_name);

    -- If department does not exist, insert it
    IF new_dept_id IS NULL THEN
        INSERT INTO user_management."tbl_Department" (dept_name)
        VALUES (p_dept_name)
        RETURNING dept_id INTO new_dept_id;

        -- Insert designation
        INSERT INTO user_management."tbl_Designation" (dept_id, designation_desc)
        VALUES (new_dept_id, p_designation_name);

        RETURN '✅ Department and Designation created';
    ELSE
        -- Check if designation already exists for that department
        SELECT EXISTS (
            SELECT 1 FROM user_management."tbl_Designation"
            WHERE dept_id = new_dept_id
              AND LOWER(designation_desc) = LOWER(p_designation_name)
        ) INTO designation_exists;

        IF NOT designation_exists THEN
            INSERT INTO user_management."tbl_Designation" (dept_id, designation_desc)
            VALUES (new_dept_id, p_designation_name);

            RETURN '⚠️ Department already exists, Designation added';
        ELSE
            RETURN '⚠️ Department and Designation already exist';
        END IF;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RETURN FORMAT('❌ Error occurred: %s', SQLERRM);
END;
$$;


ALTER FUNCTION user_management.user_department_creations(p_dept_name character varying, p_designation_name character varying) OWNER TO postgres;

--
-- Name: user_password_check(text, text); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.user_password_check(p_username text, p_password text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    stored_password TEXT;
    match BOOLEAN;
BEGIN
    SELECT password INTO stored_password
    FROM user_management."tbl_Users"
    WHERE name = p_username;

    IF stored_password IS NULL THEN
        RETURN 'User Not Found';
    END IF;

    -- Compare hash if applicable, adjust this if using bcrypt or others
    IF stored_password = p_password THEN
        RETURN 'Success';
    ELSE
        RETURN 'Invalid Credentials';
    END IF;
END;
$$;


ALTER FUNCTION user_management.user_password_check(p_username text, p_password text) OWNER TO postgres;

--
-- Name: user_password_check_details(text, text); Type: FUNCTION; Schema: user_management; Owner: postgres
--

CREATE FUNCTION user_management.user_password_check_details(p_name text, p_password text) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    user_record RECORD;
BEGIN
    SELECT 
        emp_id, name, email, "Dept_ID", designation_id,
        module_access_id, user_type, '✅ Login successful' AS message
    INTO user_record
    FROM user_management."tbl_Users"
    WHERE LOWER(name) = LOWER(p_name)
      AND password = crypt(p_password, password);

    IF NOT FOUND THEN
        RETURN json_build_object('message', '❌ Invalid username or password');
    ELSE
        RETURN json_build_object(
            'message', user_record.message,
            'emp_id', user_record.emp_id,
            'name', user_record.name,
            'email', user_record.email,
            'Dept_ID', user_record."Dept_ID",
            'designation_id', user_record.designation_id,
            'module_access_id', user_record.module_access_id,
            'user_type', user_record.user_type
        );
    END IF;
END;
$$;


ALTER FUNCTION user_management.user_password_check_details(p_name text, p_password text) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: application_error_log; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.application_error_log (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    "timestamp" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    service_name character varying(100) NOT NULL,
    module_name character varying(100),
    log_level character varying(10) NOT NULL,
    message text NOT NULL,
    error_no character varying(3),
    request_method character varying(100),
    request_payload jsonb,
    header jsonb,
    CONSTRAINT application_error_log_log_level_check CHECK (((log_level)::text = ANY ((ARRAY['INFO'::character varying, 'WARN'::character varying, 'ERROR'::character varying, 'CRITICAL'::character varying])::text[])))
);


ALTER TABLE audit.application_error_log OWNER TO postgres;

--
-- Name: audit_trail; Type: TABLE; Schema: audit; Owner: postgres
--

CREATE TABLE audit.audit_trail (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    actor_id uuid NOT NULL,
    actor_type character varying(20) NOT NULL,
    actor_role character varying(20),
    action character varying(100) NOT NULL,
    entity_type character varying(50) NOT NULL,
    entity_id uuid,
    prev_state jsonb,
    new_state jsonb,
    action_result character varying(20) DEFAULT 'SUCCESS'::character varying,
    ip_address inet,
    user_agent text,
    channel character varying(20),
    metadata audit.audit_metadata,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE audit.audit_trail OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    "Id" integer NOT NULL,
    "Username" text,
    "Age" integer NOT NULL,
    "Email" text,
    "Password" text,
    "Usertype" integer NOT NULL
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: __EFMigrationsHistory; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."__EFMigrationsHistory" (
    "MigrationId" character varying(150) NOT NULL,
    "ProductVersion" character varying(32) NOT NULL
);


ALTER TABLE public."__EFMigrationsHistory" OWNER TO postgres;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    department_id integer NOT NULL,
    department_name character varying(100) NOT NULL
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_department_id_seq OWNER TO postgres;

--
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- Name: positions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.positions (
    position_id integer NOT NULL,
    position_title character varying(100) NOT NULL
);


ALTER TABLE public.positions OWNER TO postgres;

--
-- Name: positions_position_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.positions_position_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.positions_position_id_seq OWNER TO postgres;

--
-- Name: positions_position_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.positions_position_id_seq OWNED BY public.positions.position_id;


--
-- Name: user_admin_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_admin_table (
    role_id integer NOT NULL,
    user_type character varying(200) NOT NULL
);


ALTER TABLE public.user_admin_table OWNER TO postgres;

--
-- Name: user_admin_table_role_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_admin_table_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_admin_table_role_id_seq OWNER TO postgres;

--
-- Name: user_admin_table_role_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_admin_table_role_id_seq OWNED BY public.user_admin_table.role_id;


--
-- Name: user_departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_departments (
    id integer NOT NULL,
    dept_name character varying(200) NOT NULL,
    "position" character varying(200) NOT NULL
);


ALTER TABLE public.user_departments OWNER TO postgres;

--
-- Name: user_departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_departments_id_seq OWNER TO postgres;

--
-- Name: user_departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_departments_id_seq OWNED BY public.user_departments.id;


--
-- Name: user_pages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_pages (
    id integer NOT NULL,
    pages_info text NOT NULL
);


ALTER TABLE public.user_pages OWNER TO postgres;

--
-- Name: user_pages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_pages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_pages_id_seq OWNER TO postgres;

--
-- Name: user_pages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_pages_id_seq OWNED BY public.user_pages.id;


--
-- Name: user_record; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_record (
    emp_id character varying,
    name character varying(70),
    email text,
    "Dept_ID" smallint,
    designation_id smallint,
    module_access_id smallint,
    user_type integer,
    message text
);


ALTER TABLE public.user_record OWNER TO postgres;

--
-- Name: user_table; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_table (
    user_id integer NOT NULL,
    name character varying(20) NOT NULL,
    age integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    user_type integer,
    created_at timestamp without time zone DEFAULT now(),
    "EMPID" text,
    department_name character varying(50),
    "position" character varying(50),
    pages_info character varying(50)
);


ALTER TABLE public.user_table OWNER TO postgres;

--
-- Name: user_table_copy; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_table_copy (
    user_id integer,
    name character varying(200),
    age integer,
    email text,
    password text,
    user_type integer,
    created_at timestamp without time zone,
    "EMPID" text,
    department_name character varying(250),
    "position" character varying(250),
    pages_info character varying(250)
);


ALTER TABLE public.user_table_copy OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying,
    age integer
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: user_table_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_table_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_table_id_seq OWNER TO postgres;

--
-- Name: user_table_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_table_id_seq OWNED BY public.users.id;


--
-- Name: user_table_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_table_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_table_user_id_seq OWNER TO postgres;

--
-- Name: user_table_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_table_user_id_seq OWNED BY public.user_table.user_id;


--
-- Name: AuditTrail; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."AuditTrail" (
    id integer NOT NULL,
    entity_name text NOT NULL,
    entity_id text,
    action text NOT NULL,
    changed_by text,
    changed_on timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    old_values text,
    new_values text,
    changed_columns text,
    source_ip text,
    location text,
    CONSTRAINT "AuditTrail_action_check" CHECK ((action = ANY (ARRAY['INSERT'::text, 'UPDATE'::text, 'DELETE'::text])))
);


ALTER TABLE user_management."AuditTrail" OWNER TO postgres;

--
-- Name: AuditTrail_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

CREATE SEQUENCE user_management."AuditTrail_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_management."AuditTrail_id_seq" OWNER TO postgres;

--
-- Name: AuditTrail_id_seq; Type: SEQUENCE OWNED BY; Schema: user_management; Owner: postgres
--

ALTER SEQUENCE user_management."AuditTrail_id_seq" OWNED BY user_management."AuditTrail".id;


--
-- Name: tbl_Department; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Department" (
    dept_id smallint NOT NULL,
    dept_name character varying(50)
);


ALTER TABLE user_management."tbl_Department" OWNER TO postgres;

--
-- Name: tbl_Department_dept_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_Department" ALTER COLUMN dept_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_Department_dept_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_Designation; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Designation" (
    designation_id smallint NOT NULL,
    dept_id smallint NOT NULL,
    designation_desc character varying(50)
);


ALTER TABLE user_management."tbl_Designation" OWNER TO postgres;

--
-- Name: tbl_Designation_designation_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_Designation" ALTER COLUMN designation_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_Designation_designation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_Module; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Module" (
    module_id smallint NOT NULL,
    module_description character varying(50)
);


ALTER TABLE user_management."tbl_Module" OWNER TO postgres;

--
-- Name: tbl_ModuleAccess; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_ModuleAccess" (
    module_access_id smallint NOT NULL,
    module_id smallint NOT NULL,
    designation_id smallint NOT NULL
);


ALTER TABLE user_management."tbl_ModuleAccess" OWNER TO postgres;

--
-- Name: tbl_ModuleAccess_ModuleAccess_ID_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_ModuleAccess" ALTER COLUMN module_access_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_ModuleAccess_ModuleAccess_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_Module_Module_ID_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_Module" ALTER COLUMN module_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_Module_Module_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_Screens; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Screens" (
    screen_id smallint NOT NULL,
    screen_desc character varying(50),
    module_id smallint
);


ALTER TABLE user_management."tbl_Screens" OWNER TO postgres;

--
-- Name: tbl_Screens_Screen_ID_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_Screens" ALTER COLUMN screen_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_Screens_Screen_ID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_SuperUsers_Audit; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_SuperUsers_Audit" (
    audit_id integer NOT NULL,
    user_id integer,
    action_type text,
    old_data jsonb,
    new_data jsonb,
    changed_by text,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    table_name text
);


ALTER TABLE user_management."tbl_SuperUsers_Audit" OWNER TO postgres;

--
-- Name: tbl_SuperUsers_Audit_audit_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

CREATE SEQUENCE user_management."tbl_SuperUsers_Audit_audit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_management."tbl_SuperUsers_Audit_audit_id_seq" OWNER TO postgres;

--
-- Name: tbl_SuperUsers_Audit_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: user_management; Owner: postgres
--

ALTER SEQUENCE user_management."tbl_SuperUsers_Audit_audit_id_seq" OWNED BY user_management."tbl_SuperUsers_Audit".audit_id;


--
-- Name: tbl_UserStatus; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_UserStatus" (
    status_id smallint NOT NULL,
    status_description character varying(30)
);


ALTER TABLE user_management."tbl_UserStatus" OWNER TO postgres;

--
-- Name: tbl_Users; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Users" (
    user_id integer NOT NULL,
    emp_id character varying,
    "Dept_ID" smallint,
    designation_id smallint,
    name character varying(70),
    email text,
    status_id smallint,
    module_access_id smallint,
    password text,
    created_at timestamp without time zone,
    user_type integer,
    created_by character varying
);


ALTER TABLE user_management."tbl_Users" OWNER TO postgres;

--
-- Name: tbl_Users_Audit; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management."tbl_Users_Audit" (
    audit_id integer NOT NULL,
    user_id integer,
    action_type text,
    old_data jsonb,
    new_data jsonb,
    changed_by text,
    changed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    table_name text
);


ALTER TABLE user_management."tbl_Users_Audit" OWNER TO postgres;

--
-- Name: tbl_Users_Audit_audit_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

CREATE SEQUENCE user_management."tbl_Users_Audit_audit_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_management."tbl_Users_Audit_audit_id_seq" OWNER TO postgres;

--
-- Name: tbl_Users_Audit_audit_id_seq; Type: SEQUENCE OWNED BY; Schema: user_management; Owner: postgres
--

ALTER SEQUENCE user_management."tbl_Users_Audit_audit_id_seq" OWNED BY user_management."tbl_Users_Audit".audit_id;


--
-- Name: tbl_Users_user_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

ALTER TABLE user_management."tbl_Users" ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME user_management."tbl_Users_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: tbl_super_users; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management.tbl_super_users (
    user_id integer NOT NULL,
    name text,
    age integer NOT NULL,
    email text,
    password text,
    user_type integer NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE user_management.tbl_super_users OWNER TO postgres;

--
-- Name: tbl_super_users_user_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

CREATE SEQUENCE user_management.tbl_super_users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_management.tbl_super_users_user_id_seq OWNER TO postgres;

--
-- Name: tbl_super_users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: user_management; Owner: postgres
--

ALTER SEQUENCE user_management.tbl_super_users_user_id_seq OWNED BY user_management.tbl_super_users.user_id;


--
-- Name: user_admin_table; Type: TABLE; Schema: user_management; Owner: postgres
--

CREATE TABLE user_management.user_admin_table (
    role_id integer NOT NULL,
    user_type character varying(200) NOT NULL
);


ALTER TABLE user_management.user_admin_table OWNER TO postgres;

--
-- Name: user_admin_table_role_id_seq; Type: SEQUENCE; Schema: user_management; Owner: postgres
--

CREATE SEQUENCE user_management.user_admin_table_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE user_management.user_admin_table_role_id_seq OWNER TO postgres;

--
-- Name: user_admin_table_role_id_seq; Type: SEQUENCE OWNED BY; Schema: user_management; Owner: postgres
--

ALTER SEQUENCE user_management.user_admin_table_role_id_seq OWNED BY user_management.user_admin_table.role_id;


--
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- Name: positions position_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions ALTER COLUMN position_id SET DEFAULT nextval('public.positions_position_id_seq'::regclass);


--
-- Name: user_admin_table role_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_admin_table ALTER COLUMN role_id SET DEFAULT nextval('public.user_admin_table_role_id_seq'::regclass);


--
-- Name: user_departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_departments ALTER COLUMN id SET DEFAULT nextval('public.user_departments_id_seq'::regclass);


--
-- Name: user_pages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_pages ALTER COLUMN id SET DEFAULT nextval('public.user_pages_id_seq'::regclass);


--
-- Name: user_table user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table ALTER COLUMN user_id SET DEFAULT nextval('public.user_table_user_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.user_table_id_seq'::regclass);


--
-- Name: AuditTrail id; Type: DEFAULT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."AuditTrail" ALTER COLUMN id SET DEFAULT nextval('user_management."AuditTrail_id_seq"'::regclass);


--
-- Name: tbl_SuperUsers_Audit audit_id; Type: DEFAULT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_SuperUsers_Audit" ALTER COLUMN audit_id SET DEFAULT nextval('user_management."tbl_SuperUsers_Audit_audit_id_seq"'::regclass);


--
-- Name: tbl_Users_Audit audit_id; Type: DEFAULT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users_Audit" ALTER COLUMN audit_id SET DEFAULT nextval('user_management."tbl_Users_Audit_audit_id_seq"'::regclass);


--
-- Name: tbl_super_users user_id; Type: DEFAULT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management.tbl_super_users ALTER COLUMN user_id SET DEFAULT nextval('user_management.tbl_super_users_user_id_seq'::regclass);


--
-- Name: user_admin_table role_id; Type: DEFAULT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management.user_admin_table ALTER COLUMN role_id SET DEFAULT nextval('user_management.user_admin_table_role_id_seq'::regclass);


--
-- Name: application_error_log application_error_log_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.application_error_log
    ADD CONSTRAINT application_error_log_pkey PRIMARY KEY (id);


--
-- Name: audit_trail audit_trail_pkey; Type: CONSTRAINT; Schema: audit; Owner: postgres
--

ALTER TABLE ONLY audit.audit_trail
    ADD CONSTRAINT audit_trail_pkey PRIMARY KEY (id);


--
-- Name: __EFMigrationsHistory PK___EFMigrationsHistory; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."__EFMigrationsHistory"
    ADD CONSTRAINT "PK___EFMigrationsHistory" PRIMARY KEY ("MigrationId");


--
-- Name: Users Users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("Id");


--
-- Name: departments departments_department_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_department_name_key UNIQUE (department_name);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: positions positions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_pkey PRIMARY KEY (position_id);


--
-- Name: positions positions_position_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.positions
    ADD CONSTRAINT positions_position_title_key UNIQUE (position_title);


--
-- Name: user_admin_table user_admin_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_admin_table
    ADD CONSTRAINT user_admin_table_pkey PRIMARY KEY (role_id);


--
-- Name: user_departments user_departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_departments
    ADD CONSTRAINT user_departments_pkey PRIMARY KEY (id);


--
-- Name: user_table user_table_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT user_table_email_key UNIQUE (email);


--
-- Name: users user_table_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_table_pkey PRIMARY KEY (id);


--
-- Name: user_table user_table_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT user_table_pkey1 PRIMARY KEY (user_id);


--
-- Name: AuditTrail AuditTrail_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."AuditTrail"
    ADD CONSTRAINT "AuditTrail_pkey" PRIMARY KEY (id);


--
-- Name: tbl_Department tbl_Department_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Department"
    ADD CONSTRAINT "tbl_Department_pkey" PRIMARY KEY (dept_id);


--
-- Name: tbl_Designation tbl_Designation_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Designation"
    ADD CONSTRAINT "tbl_Designation_pkey" PRIMARY KEY (designation_id);


--
-- Name: tbl_ModuleAccess tbl_ModuleAccess_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_ModuleAccess"
    ADD CONSTRAINT "tbl_ModuleAccess_pkey" PRIMARY KEY (module_access_id);


--
-- Name: tbl_Module tbl_Module_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Module"
    ADD CONSTRAINT "tbl_Module_pkey" PRIMARY KEY (module_id);


--
-- Name: tbl_Screens tbl_Screens_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Screens"
    ADD CONSTRAINT "tbl_Screens_pkey" PRIMARY KEY (screen_id);


--
-- Name: tbl_SuperUsers_Audit tbl_SuperUsers_Audit_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_SuperUsers_Audit"
    ADD CONSTRAINT "tbl_SuperUsers_Audit_pkey" PRIMARY KEY (audit_id);


--
-- Name: tbl_UserStatus tbl_UserStatus_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_UserStatus"
    ADD CONSTRAINT "tbl_UserStatus_pkey" PRIMARY KEY (status_id);


--
-- Name: tbl_Users_Audit tbl_Users_Audit_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users_Audit"
    ADD CONSTRAINT "tbl_Users_Audit_pkey" PRIMARY KEY (audit_id);


--
-- Name: tbl_Users tbl_Users_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users"
    ADD CONSTRAINT "tbl_Users_pkey" PRIMARY KEY (user_id);


--
-- Name: tbl_super_users tbl_super_users_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management.tbl_super_users
    ADD CONSTRAINT tbl_super_users_pkey PRIMARY KEY (user_id);


--
-- Name: tbl_ModuleAccess unq_module_designation; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_ModuleAccess"
    ADD CONSTRAINT unq_module_designation UNIQUE (module_id, designation_id);


--
-- Name: user_admin_table user_admin_table_pkey; Type: CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management.user_admin_table
    ADD CONSTRAINT user_admin_table_pkey PRIMARY KEY (role_id);


--
-- Name: tbl_Users trg_audit_tbl_superusers; Type: TRIGGER; Schema: user_management; Owner: postgres
--

CREATE TRIGGER trg_audit_tbl_superusers AFTER INSERT OR DELETE OR UPDATE ON user_management."tbl_Users" FOR EACH ROW EXECUTE FUNCTION user_management.audit_tbl_superusers_changes();


--
-- Name: tbl_super_users trg_audit_tbl_superusers; Type: TRIGGER; Schema: user_management; Owner: postgres
--

CREATE TRIGGER trg_audit_tbl_superusers AFTER INSERT OR DELETE OR UPDATE ON user_management.tbl_super_users FOR EACH ROW EXECUTE FUNCTION user_management.audit_tbl_superusers_changes();


--
-- Name: user_table user_table_user_type_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_table
    ADD CONSTRAINT user_table_user_type_fkey FOREIGN KEY (user_type) REFERENCES public.user_admin_table(role_id);


--
-- Name: tbl_Designation fk_department; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Designation"
    ADD CONSTRAINT fk_department FOREIGN KEY (dept_id) REFERENCES user_management."tbl_Department"(dept_id) ON DELETE CASCADE;


--
-- Name: tbl_ModuleAccess fk_moduleaccess_module; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_ModuleAccess"
    ADD CONSTRAINT fk_moduleaccess_module FOREIGN KEY (module_id) REFERENCES user_management."tbl_Module"(module_id);


--
-- Name: tbl_Screens fk_screen_module; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Screens"
    ADD CONSTRAINT fk_screen_module FOREIGN KEY (module_id) REFERENCES user_management."tbl_Module"(module_id);


--
-- Name: tbl_Users fk_users_moduleaccess; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users"
    ADD CONSTRAINT fk_users_moduleaccess FOREIGN KEY (module_access_id) REFERENCES user_management."tbl_ModuleAccess"(module_access_id);


--
-- Name: tbl_Users fk_users_status; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users"
    ADD CONSTRAINT fk_users_status FOREIGN KEY (status_id) REFERENCES user_management."tbl_UserStatus"(status_id);


--
-- Name: tbl_Users user_table_user_type_fkey; Type: FK CONSTRAINT; Schema: user_management; Owner: postgres
--

ALTER TABLE ONLY user_management."tbl_Users"
    ADD CONSTRAINT user_table_user_type_fkey FOREIGN KEY (user_type) REFERENCES public.user_admin_table(role_id);


--
-- PostgreSQL database dump complete
--

