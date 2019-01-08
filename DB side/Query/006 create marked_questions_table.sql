CREATE TABLE :schema_name.complaints
(
    id serial,
	convid text COLLATE pg_catalog."default",
	username text COLLATE pg_catalog."default",
	userid text COLLATE pg_catalog."default",
	tmstamp timestamp,
    qid integer,
    complaint text COLLATE pg_catalog."default",
    CONSTRAINT qid_pkey PRIMARY KEY (id)
)