--
-- PostgreSQL database dump
--

-- Dumped from database version 10.4
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: applause; Type: TABLE; Schema: public; Owner: flannerykj
--

CREATE TABLE public.applause (
    id integer NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    date_created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.applause OWNER TO flannerykj;

--
-- Name: applause_id_seq; Type: SEQUENCE; Schema: public; Owner: flannerykj
--

CREATE SEQUENCE public.applause_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.applause_id_seq OWNER TO flannerykj;

--
-- Name: applause_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flannerykj
--

ALTER SEQUENCE public.applause_id_seq OWNED BY public.applause.id;


--
-- Name: artists; Type: TABLE; Schema: public; Owner: flannerykj
--

CREATE TABLE public.artists (
    id integer NOT NULL,
    name character varying NOT NULL,
    date_created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.artists OWNER TO flannerykj;

--
-- Name: artists_id_seq; Type: SEQUENCE; Schema: public; Owner: flannerykj
--

CREATE SEQUENCE public.artists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artists_id_seq OWNER TO flannerykj;

--
-- Name: artists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flannerykj
--

ALTER SEQUENCE public.artists_id_seq OWNED BY public.artists.id;


--
-- Name: locations; Type: TABLE; Schema: public; Owner: flannerykj
--

CREATE TABLE public.locations (
    id integer NOT NULL,
    lat character varying NOT NULL,
    lng character varying NOT NULL,
    google_place_id integer,
    city character varying,
    formatted_address character varying,
    date_created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.locations OWNER TO flannerykj;

--
-- Name: locations_id_seq; Type: SEQUENCE; Schema: public; Owner: flannerykj
--

CREATE SEQUENCE public.locations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.locations_id_seq OWNER TO flannerykj;

--
-- Name: locations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flannerykj
--

ALTER SEQUENCE public.locations_id_seq OWNED BY public.locations.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: flannerykj
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    image character varying NOT NULL,
    description character varying,
    date_posted timestamp with time zone DEFAULT now() NOT NULL,
    last_updated timestamp with time zone DEFAULT now() NOT NULL,
    artist_id integer NOT NULL,
    user_id integer NOT NULL,
    location_id integer NOT NULL
);


ALTER TABLE public.posts OWNER TO flannerykj;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: flannerykj
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.posts_id_seq OWNER TO flannerykj;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flannerykj
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: flannerykj
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying,
    email character varying NOT NULL,
    bio character varying,
    hash_pass character varying NOT NULL,
    date_created timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO flannerykj;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: flannerykj
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO flannerykj;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: flannerykj
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: applause id; Type: DEFAULT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.applause ALTER COLUMN id SET DEFAULT nextval('public.applause_id_seq'::regclass);


--
-- Name: artists id; Type: DEFAULT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.artists ALTER COLUMN id SET DEFAULT nextval('public.artists_id_seq'::regclass);


--
-- Name: locations id; Type: DEFAULT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.locations ALTER COLUMN id SET DEFAULT nextval('public.locations_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: applause applause_pkey; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.applause
    ADD CONSTRAINT applause_pkey PRIMARY KEY (id);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (id);


--
-- Name: locations locations_pkey; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.locations
    ADD CONSTRAINT locations_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: applause applause_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.applause
    ADD CONSTRAINT applause_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id);


--
-- Name: applause applause_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.applause
    ADD CONSTRAINT applause_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: posts posts_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id);


--
-- Name: posts posts_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_location_id_fkey FOREIGN KEY (location_id) REFERENCES public.locations(id);


--
-- Name: posts posts_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: flannerykj
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

