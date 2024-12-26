-- Database schema for Australia Visa Tracker

-- Table for visa categories
CREATE TABLE IF NOT EXISTS public.visa_categories (
    id integer NOT NULL DEFAULT nextval('visa_categories_id_seq'::regclass),
    name character varying(100) NOT NULL,
    CONSTRAINT visa_categories_pkey PRIMARY KEY (id)
);

-- Base table for visa types
CREATE TABLE IF NOT EXISTS public.visa_types (
    id integer NOT NULL DEFAULT nextval('visa_types_id_seq'::regclass),
    code character varying(10) NOT NULL,
    name character varying(100) NOT NULL,
    category_id integer NOT NULL,
    CONSTRAINT visa_types_pkey PRIMARY KEY (id),
    CONSTRAINT fk_visa_category FOREIGN KEY (category_id)
        REFERENCES public.visa_categories (id)
);

-- Table for visa streams/subtypes
CREATE TABLE IF NOT EXISTS public.visa_streams (
    id integer NOT NULL DEFAULT nextval('visa_streams_id_seq'::regclass),
    visa_type_id integer NOT NULL,
    name character varying(100) NOT NULL,
    CONSTRAINT visa_streams_pkey PRIMARY KEY (id),
    CONSTRAINT fk_visa_type_id FOREIGN KEY (visa_type_id)
        REFERENCES public.visa_types (id)
);

-- Table for storing visa processing times
CREATE TABLE IF NOT EXISTS public.processing_times (
    id integer NOT NULL DEFAULT nextval('processing_times_id_seq'::regclass),
    visa_type_id integer NOT NULL,
    percent_50 integer NOT NULL,
    percent_90 integer NOT NULL,
    collected_at timestamp with time zone NOT NULL,
    CONSTRAINT processing_times_pkey PRIMARY KEY (id),
    CONSTRAINT fk_visa_type FOREIGN KEY (visa_type_id)
        REFERENCES public.visa_types (id)
);