CREATE TABLE :schema_name.fired_question
(
    id serial,
    qid integer,
	tmstamp timestamp,
	complete boolean,
    PRIMARY KEY (id)
)