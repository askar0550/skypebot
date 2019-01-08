CREATE TABLE :schema_name.fired_answer
(
    id serial,
	convid text COLLATE pg_catalog."default",
	username text COLLATE pg_catalog."default",
	userid text COLLATE pg_catalog."default",
    qid integer,
	fqid integer,
	choises text COLLATE pg_catalog."default",
    PRIMARY KEY (id)
)