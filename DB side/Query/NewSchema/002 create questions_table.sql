CREATE TABLE :schema_name.question
(
    id serial,
    questionnr integer,
	firedcounter integer default 0,
	ansOKcounter integer default 0,
	ansTOUTcounter integer default 0,
    CONSTRAINT question_pkey PRIMARY KEY (id)
)