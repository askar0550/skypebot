CREATE TABLE :schema_name.fired_answer
(
    id serial,
	username text COLLATE pg_catalog."default",
	userid text COLLATE pg_catalog."default",
    qid integer,
	fqid integer,
	choises text COLLATE pg_catalog."default",
	mark text COLLATE pg_catalog."default",
    PRIMARY KEY (id)
)