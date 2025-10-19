--
-- PostgreSQL database dump
--

\restrict I34ydiNhGhyFCYs3neHBuYGxELROMcji2NzCHqQwd7uFm5dfbkXrdhvIcbIpEYU

-- Dumped from database version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.19 (Ubuntu 14.19-0ubuntu0.22.04.1)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categorias_despesa; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.categorias_despesa (
    id character varying(255) NOT NULL,
    nome character varying(100) NOT NULL,
    descricao text,
    ativo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.categorias_despesa OWNER TO dentcarepro;

--
-- Name: comissoes; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.comissoes (
    id character varying(255) NOT NULL,
    dentista_id character varying(255),
    fatura_id character varying(255),
    valor numeric(10,2) NOT NULL,
    percentual numeric(5,2) NOT NULL,
    status character varying(50) DEFAULT 'pendente'::character varying,
    data_pagamento date,
    forma_pagamento character varying(100),
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.comissoes OWNER TO dentcarepro;

--
-- Name: config_clinica; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.config_clinica (
    id character varying(255) DEFAULT 'config-1'::character varying NOT NULL,
    nome_clinica character varying(255) NOT NULL,
    razao_social character varying(255),
    nif character varying(50),
    numero_registo character varying(100),
    telefone character varying(50),
    telemovel character varying(50),
    email character varying(255),
    website character varying(255),
    rua character varying(255),
    numero character varying(20),
    complemento character varying(255),
    codigo_postal character varying(20),
    cidade character varying(100),
    pais character varying(100),
    nome_fantasia character varying(255),
    logotipo text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.config_clinica OWNER TO dentcarepro;

--
-- Name: config_comissoes; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.config_comissoes (
    id character varying(255) NOT NULL,
    dentista_id character varying(255),
    percentual numeric(5,2) NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.config_comissoes OWNER TO dentcarepro;

--
-- Name: consultas; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.consultas (
    id character varying(255) NOT NULL,
    utente_id character varying(255),
    dentista_id character varying(255),
    data_hora timestamp without time zone NOT NULL,
    duracao integer DEFAULT 30,
    tipo character varying(100),
    status character varying(50) DEFAULT 'agendada'::character varying,
    observacoes text,
    valor numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.consultas OWNER TO dentcarepro;

--
-- Name: contas_pagar; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.contas_pagar (
    id character varying(255) NOT NULL,
    fornecedor_id character varying(255),
    categoria_id character varying(255),
    descricao character varying(255) NOT NULL,
    valor numeric(10,2) NOT NULL,
    data_vencimento date NOT NULL,
    data_pagamento date,
    status character varying(50) DEFAULT 'pendente'::character varying,
    forma_pagamento character varying(100),
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contas_pagar OWNER TO dentcarepro;

--
-- Name: dentistas; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.dentistas (
    id character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    especialidade character varying(255),
    numero_ordem character varying(50),
    email character varying(255),
    telefone character varying(50),
    telemovel character varying(50),
    ativo boolean DEFAULT true,
    cor_agenda character varying(20),
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.dentistas OWNER TO dentcarepro;

--
-- Name: faturas; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.faturas (
    id character varying(255) NOT NULL,
    numero_fatura character varying(50) NOT NULL,
    utente_id character varying(255),
    data_emissao date NOT NULL,
    data_vencimento date,
    valor_total numeric(10,2) NOT NULL,
    valor_pago numeric(10,2) DEFAULT 0,
    status character varying(50) DEFAULT 'pendente'::character varying,
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.faturas OWNER TO dentcarepro;

--
-- Name: formas_pagamento; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.formas_pagamento (
    id character varying(255) NOT NULL,
    nome character varying(100) NOT NULL,
    ativo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.formas_pagamento OWNER TO dentcarepro;

--
-- Name: fornecedores; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.fornecedores (
    id character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    nif character varying(50),
    email character varying(255),
    telefone character varying(50),
    rua character varying(255),
    cidade character varying(100),
    codigo_postal character varying(20),
    pais character varying(100) DEFAULT 'Portugal'::character varying,
    ativo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.fornecedores OWNER TO dentcarepro;

--
-- Name: itens_fatura; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.itens_fatura (
    id character varying(255) NOT NULL,
    fatura_id character varying(255),
    descricao character varying(255) NOT NULL,
    quantidade integer DEFAULT 1,
    valor_unitario numeric(10,2) NOT NULL,
    valor_total numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.itens_fatura OWNER TO dentcarepro;

--
-- Name: laboratorios; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.laboratorios (
    id character varying(255) NOT NULL,
    nome character varying(255) NOT NULL,
    responsavel character varying(255),
    email character varying(255),
    telefone character varying(50),
    rua character varying(255),
    cidade character varying(100),
    codigo_postal character varying(20),
    ativo boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.laboratorios OWNER TO dentcarepro;

--
-- Name: pagamentos; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.pagamentos (
    id character varying(255) NOT NULL,
    fatura_id character varying(255),
    data_pagamento date NOT NULL,
    valor numeric(10,2) NOT NULL,
    forma_pagamento character varying(100),
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.pagamentos OWNER TO dentcarepro;

--
-- Name: trabalhos_laboratorio; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.trabalhos_laboratorio (
    id character varying(255) NOT NULL,
    laboratorio_id character varying(255),
    utente_id character varying(255),
    dentista_id character varying(255),
    tipo_trabalho character varying(255) NOT NULL,
    descricao text,
    data_envio date,
    data_prevista_entrega date,
    data_entrega date,
    status character varying(50) DEFAULT 'enviado'::character varying,
    valor numeric(10,2),
    observacoes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.trabalhos_laboratorio OWNER TO dentcarepro;

--
-- Name: tratamentos; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.tratamentos (
    id character varying(255) NOT NULL,
    utente_id character varying(255),
    dentista_id character varying(255),
    consulta_id character varying(255),
    dente character varying(10),
    procedimento character varying(255) NOT NULL,
    descricao text,
    status character varying(50) DEFAULT 'planejado'::character varying,
    data_realizacao date,
    valor numeric(10,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tratamentos OWNER TO dentcarepro;

--
-- Name: users; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.users (
    id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    login_method character varying(50) NOT NULL,
    role character varying(50) DEFAULT 'user'::character varying,
    last_signed_in timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO dentcarepro;

--
-- Name: utentes; Type: TABLE; Schema: public; Owner: dentcarepro
--

CREATE TABLE public.utentes (
    id character varying(255) NOT NULL,
    codigo character varying(50) NOT NULL,
    nome character varying(255) NOT NULL,
    data_nascimento date,
    genero character varying(20),
    nif character varying(50),
    numero_sns character varying(50),
    email character varying(255),
    telefone character varying(50),
    telemovel character varying(50),
    rua character varying(255),
    numero character varying(20),
    complemento character varying(255),
    codigo_postal character varying(20),
    cidade character varying(100),
    pais character varying(100) DEFAULT 'Portugal'::character varying,
    estado character varying(50) DEFAULT 'ativo'::character varying,
    observacoes text,
    alergias text,
    medicamentos text,
    historico_medico text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.utentes OWNER TO dentcarepro;

--
-- Data for Name: categorias_despesa; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.categorias_despesa (id, nome, descricao, ativo, created_at) FROM stdin;
cat-1	Material Dentário	Materiais e equipamentos dentários	t	2025-10-17 15:57:02.404146
cat-2	Laboratório	Despesas com laboratórios externos	t	2025-10-17 15:57:02.404146
cat-3	Pessoal	Salários e encargos	t	2025-10-17 15:57:02.404146
cat-4	Instalações	Renda, água, luz, etc.	t	2025-10-17 15:57:02.404146
cat-5	Marketing	Publicidade e marketing	t	2025-10-17 15:57:02.404146
\.


--
-- Data for Name: comissoes; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.comissoes (id, dentista_id, fatura_id, valor, percentual, status, data_pagamento, forma_pagamento, observacoes, created_at, updated_at) FROM stdin;
com-001	dentista-001	fatura-001	10.00	20.00	pendente	\N	\N	\N	2025-10-17 16:04:35.403011	2025-10-17 16:04:35.403011
com-002	dentista-002	fatura-002	11.25	25.00	pendente	\N	\N	\N	2025-10-17 16:04:35.403011	2025-10-17 16:04:35.403011
\.


--
-- Data for Name: config_clinica; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.config_clinica (id, nome_clinica, razao_social, nif, numero_registo, telefone, telemovel, email, website, rua, numero, complemento, codigo_postal, cidade, pais, nome_fantasia, logotipo, created_at, updated_at) FROM stdin;
config-1	Clínica Dentária Sorrisos	Clínica Dentária Sorrisos Lda	123456789	\N	+351 21 123 4567	\N	geral@clinica.pt	\N	\N	\N	\N	\N	Lisboa	Portugal	\N	\N	2025-10-17 15:57:02.403193	2025-10-17 15:57:02.403193
\.


--
-- Data for Name: config_comissoes; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.config_comissoes (id, dentista_id, percentual, ativo, created_at, updated_at) FROM stdin;
config-com-001	dentista-001	20.00	t	2025-10-17 16:04:35.402188	2025-10-17 16:04:35.402188
config-com-002	dentista-002	25.00	t	2025-10-17 16:04:35.402188	2025-10-17 16:04:35.402188
config-com-003	dentista-003	30.00	t	2025-10-17 16:04:35.402188	2025-10-17 16:04:35.402188
\.


--
-- Data for Name: consultas; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.consultas (id, utente_id, dentista_id, data_hora, duracao, tipo, status, observacoes, valor, created_at, updated_at) FROM stdin;
consulta-001	utente-001	dentista-001	2025-10-18 09:00:00	30	Consulta de Rotina	agendada	\N	50.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-002	utente-002	dentista-002	2025-10-18 10:00:00	60	Tratamento de Canal	agendada	\N	150.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-003	utente-003	dentista-001	2025-10-18 14:00:00	30	Limpeza	agendada	\N	40.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-004	utente-004	dentista-003	2025-10-19 09:30:00	90	Implante	agendada	\N	800.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-005	utente-005	dentista-002	2025-10-19 11:00:00	30	Avaliação	agendada	\N	35.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-006	utente-001	dentista-001	2025-10-15 10:00:00	30	Consulta de Rotina	realizada	\N	50.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
consulta-007	utente-002	dentista-002	2025-10-14 15:00:00	45	Limpeza	realizada	\N	45.00	2025-10-17 16:04:35.390802	2025-10-17 16:04:35.390802
\.


--
-- Data for Name: contas_pagar; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.contas_pagar (id, fornecedor_id, categoria_id, descricao, valor, data_vencimento, data_pagamento, status, forma_pagamento, observacoes, created_at, updated_at) FROM stdin;
cp-001	forn-001	cat-1	Material dentário - Outubro	450.00	2025-10-30	\N	pendente	\N	\N	2025-10-17 16:04:35.403868	2025-10-17 16:04:35.403868
cp-002	forn-002	cat-1	Equipamentos diversos	1200.00	2025-11-05	\N	pendente	\N	\N	2025-10-17 16:04:35.403868	2025-10-17 16:04:35.403868
cp-003	forn-001	cat-1	Material dentário - Setembro	380.00	2025-09-30	2025-09-28	paga	Transferência Bancária	\N	2025-10-17 16:04:35.403868	2025-10-17 16:04:35.403868
\.


--
-- Data for Name: dentistas; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.dentistas (id, nome, especialidade, numero_ordem, email, telefone, telemovel, ativo, cor_agenda, observacoes, created_at, updated_at) FROM stdin;
dentista-001	Dr. João Costa	Ortodontia	OMD12345	joao.costa@clinica.pt	+351 91 234 5678	\N	t	#3b82f6	\N	2025-10-17 16:04:35.387497	2025-10-17 16:04:35.387497
dentista-002	Dra. Ana Ferreira	Endodontia	OMD12346	ana.ferreira@clinica.pt	+351 92 345 6789	\N	t	#10b981	\N	2025-10-17 16:04:35.387497	2025-10-17 16:04:35.387497
dentista-003	Dr. Carlos Silva	Implantologia	OMD12347	carlos.silva@clinica.pt	+351 93 456 7890	\N	t	#f59e0b	\N	2025-10-17 16:04:35.387497	2025-10-17 16:04:35.387497
\.


--
-- Data for Name: faturas; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.faturas (id, numero_fatura, utente_id, data_emissao, data_vencimento, valor_total, valor_pago, status, observacoes, created_at, updated_at) FROM stdin;
fatura-001	FT2025/00001	utente-001	2025-10-15	2025-11-15	50.00	50.00	paga	\N	2025-10-17 16:04:35.399773	2025-10-17 16:04:35.399773
fatura-002	FT2025/00002	utente-002	2025-10-14	2025-11-14	45.00	45.00	paga	\N	2025-10-17 16:04:35.399773	2025-10-17 16:04:35.399773
fatura-003	FT2025/00003	utente-003	2025-10-16	2025-11-16	120.00	0.00	pendente	\N	2025-10-17 16:04:35.399773	2025-10-17 16:04:35.399773
fatura-004	FT2025/00004	utente-004	2025-10-17	2025-11-17	800.00	400.00	parcial	\N	2025-10-17 16:04:35.399773	2025-10-17 16:04:35.399773
\.


--
-- Data for Name: formas_pagamento; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.formas_pagamento (id, nome, ativo, created_at) FROM stdin;
fp-1	Dinheiro	t	2025-10-17 15:57:02.403739
fp-2	Multibanco	t	2025-10-17 15:57:02.403739
fp-3	MB WAY	t	2025-10-17 15:57:02.403739
fp-4	Transferência Bancária	t	2025-10-17 15:57:02.403739
fp-5	Cartão de Crédito	t	2025-10-17 15:57:02.403739
\.


--
-- Data for Name: fornecedores; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.fornecedores (id, nome, nif, email, telefone, rua, cidade, codigo_postal, pais, ativo, created_at, updated_at) FROM stdin;
forn-001	Dental Supply Lda	500123456	vendas@dentalsupply.pt	+351 21 345 6789	\N	Lisboa	\N	Portugal	t	2025-10-17 16:04:35.399044	2025-10-17 16:04:35.399044
forn-002	MediDental Portugal	500234567	comercial@medidental.pt	+351 22 456 7890	\N	Porto	\N	Portugal	t	2025-10-17 16:04:35.399044	2025-10-17 16:04:35.399044
\.


--
-- Data for Name: itens_fatura; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.itens_fatura (id, fatura_id, descricao, quantidade, valor_unitario, valor_total, created_at) FROM stdin;
item-001	fatura-001	Consulta de Rotina	1	50.00	50.00	2025-10-17 16:04:35.400901
item-002	fatura-002	Limpeza Dentária	1	45.00	45.00	2025-10-17 16:04:35.400901
item-003	fatura-003	Tratamento de Canal	1	120.00	120.00	2025-10-17 16:04:35.400901
item-004	fatura-004	Implante Dentário	1	800.00	800.00	2025-10-17 16:04:35.400901
\.


--
-- Data for Name: laboratorios; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.laboratorios (id, nome, responsavel, email, telefone, rua, cidade, codigo_postal, ativo, created_at, updated_at) FROM stdin;
lab-001	Laboratório DentalTech	Pedro Santos	geral@dentaltech.pt	+351 21 234 5678	\N	Lisboa	\N	t	2025-10-17 16:04:35.398454	2025-10-17 16:04:35.398454
lab-002	ProLab Dental	Maria Costa	info@prolabdental.pt	+351 22 345 6789	\N	Porto	\N	t	2025-10-17 16:04:35.398454	2025-10-17 16:04:35.398454
\.


--
-- Data for Name: pagamentos; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.pagamentos (id, fatura_id, data_pagamento, valor, forma_pagamento, observacoes, created_at) FROM stdin;
pag-001	fatura-001	2025-10-15	50.00	Multibanco	\N	2025-10-17 16:04:35.401603
pag-002	fatura-002	2025-10-14	45.00	MB WAY	\N	2025-10-17 16:04:35.401603
pag-003	fatura-004	2025-10-17	400.00	Transferência Bancária	\N	2025-10-17 16:04:35.401603
\.


--
-- Data for Name: trabalhos_laboratorio; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.trabalhos_laboratorio (id, laboratorio_id, utente_id, dentista_id, tipo_trabalho, descricao, data_envio, data_prevista_entrega, data_entrega, status, valor, observacoes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tratamentos; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.tratamentos (id, utente_id, dentista_id, consulta_id, dente, procedimento, descricao, status, data_realizacao, valor, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.users (id, name, email, login_method, role, last_signed_in, created_at, updated_at) FROM stdin;
demo-user-001	Utilizador Demo	demo@dentcarepro.local	demo	admin	\N	2025-10-17 15:57:02.404553	2025-10-17 15:57:02.404553
KgrqhmZAuJtQDu6whJXAry	Eu Tu	etu462362@gmail.com	google	user	2025-10-17 16:15:47.254	2025-10-17 16:15:47.335464	2025-10-17 16:15:47.335464
\.


--
-- Data for Name: utentes; Type: TABLE DATA; Schema: public; Owner: dentcarepro
--

COPY public.utentes (id, codigo, nome, data_nascimento, genero, nif, numero_sns, email, telefone, telemovel, rua, numero, complemento, codigo_postal, cidade, pais, estado, observacoes, alergias, medicamentos, historico_medico, created_at, updated_at) FROM stdin;
utente-001	U001	Maria Silva Santos	1983-05-15	F	123456789	123456789	maria.silva@email.pt	212345678	912345678	Rua das Flores	45	\N	1000-100	Lisboa	Portugal	ativo	\N	Penicilina	Paracetamol	\N	2025-10-17 16:04:35.389228	2025-10-17 16:04:35.389228
utente-002	U002	João Pedro Costa	1990-08-22	M	234567890	234567890	joao.costa@email.pt	213456789	923456789	Avenida da Liberdade	123	\N	1250-140	Lisboa	Portugal	ativo	\N			\N	2025-10-17 16:04:35.389228	2025-10-17 16:04:35.389228
utente-003	U003	Ana Rita Ferreira	1978-12-10	F	345678901	345678901	ana.ferreira@email.pt	214567890	934567890	Rua do Comércio	78	\N	4000-200	Porto	Portugal	ativo	\N	Látex	Ibuprofeno	\N	2025-10-17 16:04:35.389228	2025-10-17 16:04:35.389228
utente-004	U004	Carlos Manuel Oliveira	1965-03-28	M	456789012	456789012	carlos.oliveira@email.pt	215678901	945678901	Praça da República	12	\N	3000-343	Coimbra	Portugal	ativo	\N			\N	2025-10-17 16:04:35.389228	2025-10-17 16:04:35.389228
utente-005	U005	Sofia Marques Rodrigues	2000-07-05	F	567890123	567890123	sofia.rodrigues@email.pt	216789012	956789012	Rua Nova	56	\N	2500-123	Caldas da Rainha	Portugal	ativo	\N			\N	2025-10-17 16:04:35.389228	2025-10-17 16:04:35.389228
\.


--
-- Name: categorias_despesa categorias_despesa_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.categorias_despesa
    ADD CONSTRAINT categorias_despesa_pkey PRIMARY KEY (id);


--
-- Name: comissoes comissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.comissoes
    ADD CONSTRAINT comissoes_pkey PRIMARY KEY (id);


--
-- Name: config_clinica config_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.config_clinica
    ADD CONSTRAINT config_clinica_pkey PRIMARY KEY (id);


--
-- Name: config_comissoes config_comissoes_dentista_id_key; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.config_comissoes
    ADD CONSTRAINT config_comissoes_dentista_id_key UNIQUE (dentista_id);


--
-- Name: config_comissoes config_comissoes_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.config_comissoes
    ADD CONSTRAINT config_comissoes_pkey PRIMARY KEY (id);


--
-- Name: consultas consultas_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_pkey PRIMARY KEY (id);


--
-- Name: contas_pagar contas_pagar_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_pkey PRIMARY KEY (id);


--
-- Name: dentistas dentistas_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.dentistas
    ADD CONSTRAINT dentistas_pkey PRIMARY KEY (id);


--
-- Name: faturas faturas_numero_fatura_key; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.faturas
    ADD CONSTRAINT faturas_numero_fatura_key UNIQUE (numero_fatura);


--
-- Name: faturas faturas_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.faturas
    ADD CONSTRAINT faturas_pkey PRIMARY KEY (id);


--
-- Name: formas_pagamento formas_pagamento_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.formas_pagamento
    ADD CONSTRAINT formas_pagamento_pkey PRIMARY KEY (id);


--
-- Name: fornecedores fornecedores_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.fornecedores
    ADD CONSTRAINT fornecedores_pkey PRIMARY KEY (id);


--
-- Name: itens_fatura itens_fatura_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.itens_fatura
    ADD CONSTRAINT itens_fatura_pkey PRIMARY KEY (id);


--
-- Name: laboratorios laboratorios_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.laboratorios
    ADD CONSTRAINT laboratorios_pkey PRIMARY KEY (id);


--
-- Name: pagamentos pagamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_pkey PRIMARY KEY (id);


--
-- Name: trabalhos_laboratorio trabalhos_laboratorio_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.trabalhos_laboratorio
    ADD CONSTRAINT trabalhos_laboratorio_pkey PRIMARY KEY (id);


--
-- Name: tratamentos tratamentos_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.tratamentos
    ADD CONSTRAINT tratamentos_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: utentes utentes_codigo_key; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.utentes
    ADD CONSTRAINT utentes_codigo_key UNIQUE (codigo);


--
-- Name: utentes utentes_pkey; Type: CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.utentes
    ADD CONSTRAINT utentes_pkey PRIMARY KEY (id);


--
-- Name: idx_comissoes_dentista; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_comissoes_dentista ON public.comissoes USING btree (dentista_id);


--
-- Name: idx_comissoes_status; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_comissoes_status ON public.comissoes USING btree (status);


--
-- Name: idx_consultas_data; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_consultas_data ON public.consultas USING btree (data_hora);


--
-- Name: idx_consultas_dentista; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_consultas_dentista ON public.consultas USING btree (dentista_id);


--
-- Name: idx_consultas_utente; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_consultas_utente ON public.consultas USING btree (utente_id);


--
-- Name: idx_faturas_status; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_faturas_status ON public.faturas USING btree (status);


--
-- Name: idx_faturas_utente; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_faturas_utente ON public.faturas USING btree (utente_id);


--
-- Name: idx_utentes_codigo; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_utentes_codigo ON public.utentes USING btree (codigo);


--
-- Name: idx_utentes_estado; Type: INDEX; Schema: public; Owner: dentcarepro
--

CREATE INDEX idx_utentes_estado ON public.utentes USING btree (estado);


--
-- Name: comissoes comissoes_dentista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.comissoes
    ADD CONSTRAINT comissoes_dentista_id_fkey FOREIGN KEY (dentista_id) REFERENCES public.dentistas(id) ON DELETE CASCADE;


--
-- Name: comissoes comissoes_fatura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.comissoes
    ADD CONSTRAINT comissoes_fatura_id_fkey FOREIGN KEY (fatura_id) REFERENCES public.faturas(id) ON DELETE CASCADE;


--
-- Name: config_comissoes config_comissoes_dentista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.config_comissoes
    ADD CONSTRAINT config_comissoes_dentista_id_fkey FOREIGN KEY (dentista_id) REFERENCES public.dentistas(id) ON DELETE CASCADE;


--
-- Name: consultas consultas_dentista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_dentista_id_fkey FOREIGN KEY (dentista_id) REFERENCES public.dentistas(id) ON DELETE SET NULL;


--
-- Name: consultas consultas_utente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.consultas
    ADD CONSTRAINT consultas_utente_id_fkey FOREIGN KEY (utente_id) REFERENCES public.utentes(id) ON DELETE CASCADE;


--
-- Name: contas_pagar contas_pagar_categoria_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias_despesa(id) ON DELETE SET NULL;


--
-- Name: contas_pagar contas_pagar_fornecedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.contas_pagar
    ADD CONSTRAINT contas_pagar_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.fornecedores(id) ON DELETE SET NULL;


--
-- Name: faturas faturas_utente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.faturas
    ADD CONSTRAINT faturas_utente_id_fkey FOREIGN KEY (utente_id) REFERENCES public.utentes(id) ON DELETE CASCADE;


--
-- Name: itens_fatura itens_fatura_fatura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.itens_fatura
    ADD CONSTRAINT itens_fatura_fatura_id_fkey FOREIGN KEY (fatura_id) REFERENCES public.faturas(id) ON DELETE CASCADE;


--
-- Name: pagamentos pagamentos_fatura_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.pagamentos
    ADD CONSTRAINT pagamentos_fatura_id_fkey FOREIGN KEY (fatura_id) REFERENCES public.faturas(id) ON DELETE CASCADE;


--
-- Name: trabalhos_laboratorio trabalhos_laboratorio_dentista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.trabalhos_laboratorio
    ADD CONSTRAINT trabalhos_laboratorio_dentista_id_fkey FOREIGN KEY (dentista_id) REFERENCES public.dentistas(id) ON DELETE SET NULL;


--
-- Name: trabalhos_laboratorio trabalhos_laboratorio_laboratorio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.trabalhos_laboratorio
    ADD CONSTRAINT trabalhos_laboratorio_laboratorio_id_fkey FOREIGN KEY (laboratorio_id) REFERENCES public.laboratorios(id) ON DELETE CASCADE;


--
-- Name: trabalhos_laboratorio trabalhos_laboratorio_utente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.trabalhos_laboratorio
    ADD CONSTRAINT trabalhos_laboratorio_utente_id_fkey FOREIGN KEY (utente_id) REFERENCES public.utentes(id) ON DELETE CASCADE;


--
-- Name: tratamentos tratamentos_consulta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.tratamentos
    ADD CONSTRAINT tratamentos_consulta_id_fkey FOREIGN KEY (consulta_id) REFERENCES public.consultas(id) ON DELETE SET NULL;


--
-- Name: tratamentos tratamentos_dentista_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.tratamentos
    ADD CONSTRAINT tratamentos_dentista_id_fkey FOREIGN KEY (dentista_id) REFERENCES public.dentistas(id) ON DELETE SET NULL;


--
-- Name: tratamentos tratamentos_utente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: dentcarepro
--

ALTER TABLE ONLY public.tratamentos
    ADD CONSTRAINT tratamentos_utente_id_fkey FOREIGN KEY (utente_id) REFERENCES public.utentes(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict I34ydiNhGhyFCYs3neHBuYGxELROMcji2NzCHqQwd7uFm5dfbkXrdhvIcbIpEYU

