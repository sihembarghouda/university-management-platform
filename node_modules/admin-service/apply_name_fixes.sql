-- Apply corrected (unaccented) matiere names provided by user
BEGIN;

-- TI 11 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Developpement web et multimedia I', 'TI11-DEVWEB1'),
    ('Algorithmique et programmation 1', 'TI11-ALGO1'),
    ('Architecture des Ordinateurs', 'TI11-ARCHCPU'),
    ('Mathematique Appliquee', 'TI11-MATHA'),
    ('Systemes Logiques', 'TI11-SLOG'),
    ('Technique d''expression 1', 'TI11-TEXPR1'),
    ('IT Essentials', 'TI11-ITESS'),
    ('Business Culture', 'TI11-BUSC'),
    ('Bureautique', 'TI11-BUREAU'),
    ('2CN', 'TI11-2CN'),
    ('English for computing 1', 'TI11-ENG1')
) AS v(name, code)
WHERE m.code = v.code;

-- DSI 21 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Programmation Objet', 'DSI21-POBJ'),
    ('Modelisation Objet (UML2)', 'DSI21-UML2'),
    ('Bases de Donnees', 'DSI21-BDD'),
    ('High tech english', 'DSI21-HTE'),
    ('Outils de developpement collaboratif', 'DSI21-ODC'),
    ('Communication en entreprise', 'DSI21-COM'),
    ('Droit de L''informatique et proprietes', 'DSI21-DROIT'),
    ('Programmation Python Avancee', 'DSI21-PYADV')
) AS v(name, code)
WHERE m.code = v.code;

-- DSI 31 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Developpement Mobile', 'DSI31-DEVMOB'),
    ('Web 3.0', 'DSI31-WEB3'),
    ('Environnement de developpement', 'DSI31-ENVDEV'),
    ('Atelier developpement Mobile natif', 'DSI31-ATELMOBN'),
    ('Atelier Framework cross-platform', 'DSI31-ATELCROSS'),
    ('Preparing TOEIC', 'DSI31-TOEIC'),
    ('Projet d''Integration', 'DSI31-PROJ'),
    ('Methodologie de Conception Objet', 'DSI31-METHO'),
    ('Atelier Base de Donnees Avancee', 'DSI31-BDDADV'),
    ('SOA', 'DSI31-SOA'),
    ('Technique de recherche d''emploi et marketing de soi', 'DSI31-TRM'),
    ('Atelier SOA', 'DSI31-ATELSOA'),
    ('Gestion des donnees Massives', 'DSI31-BIGDATA')
) AS v(name, code)
WHERE m.code = v.code;

-- RSI 21 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Atelier Administration Systemes', 'RSI21-ADMINSYS'),
    ('Bases de Donnees', 'RSI21-BDD'),
    ('Reseaux Locaux et architecture TCP/IP', 'RSI21-TCPIP'),
    ('Programmation Objet', 'RSI21-POBJ'),
    ('LPIC1', 'RSI21-LPIC1'),
    ('Communication en entreprise', 'RSI21-COM'),
    ('Atelier bases de donnees', 'RSI21-ATELBDD'),
    ('Atelier Reseaux locaux et TCP/IP', 'RSI21-ATELNET'),
    ('Atelier Programmation Objet', 'RSI21-ATELPOBJ'),
    ('Droit de L''informatique et proprietes', 'RSI21-DROIT'),
    ('High tech english', 'RSI21-HTE'),
    ('Cybersecurity Essentials', 'RSI21-CYBER')
) AS v(name, code)
WHERE m.code = v.code;

-- RSI 31 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Introduction a l''Internet des Objets', 'RSI31-IOT'),
    ('Gestion d''un Data Center', 'RSI31-DATACENTER'),
    ('Preparing TOEIC', 'RSI31-TOEIC'),
    ('Securite systemes et reseaux', 'RSI31-SECNET'),
    ('Programmation reseaux', 'RSI31-PROGNET'),
    ('Atelier Cloud Computing', 'RSI31-ATELCLOUD'),
    ('Technique de recherche d''emploi et marketing de soi', 'RSI31-TRM'),
    ('Atelier Securite Systemes et reseaux', 'RSI31-ATELSEC'),
    ('Atelier conception et gestion de projets', 'RSI31-ATELPROJ'),
    ('Projet d''Integration Infrastructures Reseaux et Systemes', 'RSI31-PROJINFRA'),
    ('Technologies WAN', 'RSI31-WAN'),
    ('Atelier Technologies WAN', 'RSI31-ATELWAN'),
    ('CCNA Cybersecurity', 'RSI31-CCNACYB')
) AS v(name, code)
WHERE m.code = v.code;

-- Master DevOps 1 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Culture DevOps', 'MD1-DEVOPS-CULT'),
    ('Programmation reseaux', 'MD1-PROGNET'),
    ('Administration des systemes', 'MD1-ADMSYS'),
    ('Certification LPIC 1', 'MD1-LPIC1'),
    ('Virtualisation & Cloud Computing', 'MD1-CLOUD'),
    ('Developpement full stack', 'MD1-FULLSTACK'),
    ('Atelier Administration systemes et reseaux', 'MD1-ATELADM'),
    ('Anglais (Preparation au TOEIC 1)', 'MD1-TOEIC'),
    ('Conception de logiciels', 'MD1-CONCLOG'),
    ('Certification CCNA R&S', 'MD1-CCNA'),
    ('Gestion de projet', 'MD1-PM'),
    ('E-Services', 'MD1-ESERV')
) AS v(name, code)
WHERE m.code = v.code;

-- Master DevOps 2 materias
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Deploiement d''applications avance (CI/CD)', 'MD2-CICD'),
    ('Disponibilite des infrastructures et Performance', 'MD2-PERF'),
    ('Securite d''infrastructure', 'MD2-SECINFRA'),
    ('Administration d''une plateforme de conteneurs', 'MD2-CONTAIN'),
    ('Redaction d''un cahier de charges', 'MD2-CDC'),
    ('Cloud Security', 'MD2-CLOUDSEC'),
    ('Certification LPIC DevOps Tools Enaineer', 'MD2-LPICDEV'),
    ('Automatisation d''infrastructures', 'MD2-AUTOINFRA'),
    ('Projet annuel en entreprise 2', 'MD2-PROJENT'),
    ('Big Data', 'MD2-BIGDATA'),
    ('Droit informatique & legislations', 'MD2-DROIT'),
    ('Initation a la recherche', 'MD2-INITRES')
) AS v(name, code)
WHERE m.code = v.code;

-- GENIE MECANIQUE (GM) matieres
-- GM 11 (Tronc Commun - 1ere annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Statique cinematique', 'GM11-STAT'),
    ('Analyse', 'GM11-ANALYSE'),
    ('Technique de communication', 'GM11-COMM'),
    ('Sciences des materiaux', 'GM11-MATERS'),
    ('Technologie de construction', 'GM11-TECHCONST'),
    ('RDM1 (Resistance des Materiaux 1)', 'GM11-RDM1'),
    ('2CN', 'GM11-2CN'),
    ('Algebre', 'GM11-ALG'),
    ('Anglais', 'GM11-ANG'),
    ('Procedes et Methodes de production', 'GM11-PROC'),
    ('Atelier construction mecanique', 'GM11-ATELCONST'),
    ('Atelier procedes et methodes 1', 'GM11-ATELPROC1'),
    ('Atelier de mecanique', 'GM11-ATELMEC'),
    ('Atelier sciences des materiaux', 'GM11-ATELMAT')
) AS v(name, code)
WHERE m.code = v.code;

-- MI 2 (Maintenance Industrielle - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Automatisme industriel', 'MI2-AUTOM'),
    ('Anglais technique 1', 'MI2-ANGTECH1'),
    ('Thermodynamique', 'MI2-THERMO'),
    ('Qualite et securite industrielle', 'MI2-QUALSEC'),
    ('Analyse Systemes industriels', 'MI2-ANASYS'),
    ('Techniques de communication 1', 'MI2-COMM1'),
    ('Mecanique des fluides', 'MI2-FLUID'),
    ('Atelier asservissement', 'MI2-ATELASS'),
    ('Bases de donnees', 'MI2-BDD'),
    ('Regulation et asservissement', 'MI2-REGASS'),
    ('Atelier FPGA et VHDL', 'MI2-ATELFPGA'),
    ('Mesures, test et diagnostic', 'MI2-MESURES'),
    ('Atelier d''informatique', 'MI2-ATELINF'),
    ('Algorithme', 'MI2-ALGO'),
    ('Droit de travail', 'MI2-DROIT'),
    ('Atelier Mecanique 3', 'MI2-ATELMEC3'),
    ('Atelier Sys info', 'MI2-ATELSYS'),
    ('Atelier Automatisme industriel', 'MI2-ATELAUT'),
    ('Atelier Qualite et securite industrielle', 'MI2-ATELQUAL'),
    ('Atelier Systemes industriels', 'MI2-ATELSYSIND')
) AS v(name, code)
WHERE m.code = v.code;

-- MT 2 (Mecatronique - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Mecanique des fluides', 'MT2-FLUID'),
    ('Algorithme', 'MT2-ALGO'),
    ('Bases de donnees', 'MT2-BDD'),
    ('Regulation et asservissement', 'MT2-REGASS'),
    ('Atelier asservissement', 'MT2-ATELASS'),
    ('Techno. syst hydrau. Pneumat.', 'MT2-HYDRAU'),
    ('Analyse fonctionnelle des systemes', 'MT2-ANAFUNC'),
    ('Atelier Mecaique 3', 'MT2-ATELMEC3'),
    ('Thermodynamique', 'MT2-THERMO'),
    ('Droit de travail', 'MT2-DROIT'),
    ('Atelier d''informatique', 'MT2-ATELINF'),
    ('Techniques de communication 1', 'MT2-COMM1'),
    ('Automatisme industriel', 'MT2-AUTOM'),
    ('Anglais technique 1', 'MT2-ANGTECH1'),
    ('Architecture des systemes automatises', 'MT2-ARCHAUTO'),
    ('Mini Projet', 'MT2-MINIPROJ'),
    ('atelier Analyse fonctionnelle des systemes', 'MT2-ATELANAF'),
    ('Atelier Automatisme industrielle', 'MT2-ATELAUTIND'),
    ('Atelier systemes automatise', 'MT2-ATELSYST')
) AS v(name, code)
WHERE m.code = v.code;

-- MI 3 (Maintenance Industrielle - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Culture entrepreneuriale', 'MI3-ENTRE'),
    ('Installation et maintenance des IRV', 'MI3-IRV'),
    ('Methodes de la maintenance', 'MI3-MAINT'),
    ('Techniques de communication', 'MI3-COMM'),
    ('Techniques de reparation des systemes mecanique', 'MI3-REP'),
    ('Acquisition et traitements des donnees', 'MI3-ACQ'),
    ('Mini projet Installation et maintenance des IRV', 'MI3-MINIPROJ'),
    ('Commande des machines', 'MI3-CMDM'),
    ('Gestion de la maintenance', 'MI3-GESTION'),
    ('Metrologie dimensionnelle', 'MI3-METRO'),
    ('Anglais technique', 'MI3-ANGTECH'),
    ('Atelier Commande machines', 'MI3-ATELCMD'),
    ('Atelier GMAO', 'MI3-ATELGMAO'),
    ('Atelier Acquisition des donnees', 'MI3-ATELACQ'),
    ('Mini Projet', 'MI3-MINIP')
) AS v(name, code)
WHERE m.code = v.code;

-- MT 3 (Mecatronique - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('FPGA et VHDL', 'MT3-FPGA'),
    ('mesures, test et diagnostic', 'MT3-MES'),
    ('Acquisition et trait. des donnees', 'MT3-ACQ'),
    ('Systemes embarques', 'MT3-EMB'),
    ('M. Op 6.1 Mini projet', 'MT3-MINIOP1'),
    ('Microcontroleurs', 'MT3-MICRO'),
    ('Robotique', 'MT3-ROBOT'),
    ('M. Op 5.1 Mini projet mesures test et diagnostic', 'MT3-MINIOP2'),
    ('Anglais technique', 'MT3-ANGTECH'),
    ('Techniques de communication', 'MT3-COMM'),
    ('Diagnostic des systemes mecatroniques', 'MT3-DIAG'),
    ('Culture entrepreneuriale', 'MT3-ENTRE'),
    ('Dimensionnement de reseaux hydraulique et pneumatique', 'MT3-DIM'),
    ('Atelier diagnostic systeme mecatronique', 'MT3-ATELDIAG'),
    ('Atelier systemes informatique 2', 'MT3-ATELINF2'),
    ('Atelier systemes electronique 2', 'MT3-ATELELEC2'),
    ('Atelier reparation systeme mecatronique', 'MT3-ATELREP'),
    ('Atelier systemes informatique 2', 'MT3-ATELINF2B')
) AS v(name, code)
WHERE m.code = v.code;

-- Master ENR 1 (Energies Renouvelables - Master 1)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Solaire photovoltaique', 'ENR1-SOLPV'),
    ('Environnement et Develop. durable', 'ENR1-ENV'),
    ('Reseau de distribution', 'ENR1-RESEAU'),
    ('Solaire thermique', 'ENR1-SOLTH'),
    ('Electronique de puissance', 'ENR1-ELECP'),
    ('Atelier energie solaire PV', 'ENR1-ATELPV'),
    ('Atelier electrique', 'ENR1-ATELLECT'),
    ('Energie eolienne', 'ENR1-EOL'),
    ('Thermodynamique appliquee', 'ENR1-THERMO'),
    ('Atelier energie solaire thermique', 'ENR1-ATELST'),
    ('Ateliers systeme hybride', 'ENR1-ATELHYB'),
    ('Systeme hybrides', 'ENR1-HYB'),
    ('Combustion', 'ENR1-COMB'),
    ('Mini projet', 'ENR1-MINIP')
) AS v(name, code)
WHERE m.code = v.code;

-- Master ENR 2 (Energies Renouvelables - Master 2)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('GRH', 'ENR2-GRH'),
    ('Audit energetique', 'ENR2-AUDIT'),
    ('Diagnostic et maintenance en genie climatique', 'ENR2-DIAG'),
    ('Fiabilite des installations energetiques', 'ENR2-FIAB'),
    ('Analyse numerique', 'ENR2-ANINUM'),
    ('Anglais technique', 'ENR2-ANGTECH'),
    ('Maitrise d''energie', 'ENR2-MAIT'),
    ('Reglementation environnemental', 'ENR2-REG'),
    ('Outils de simulation energetique', 'ENR2-OUTILS'),
    ('Conduite de projet', 'ENR2-PROJ'),
    ('Mini projet', 'ENR2-MINIP'),
    ('Atelier maintenance', 'ENR2-ATELMAINT'),
    ('Transport et Stockage d''energie', 'ENR2-TRANS')
) AS v(name, code)
WHERE m.code = v.code;

-- GENIE ELECTRIQUE (GE) matieres
-- GE 11 (Tronc Commun - 1ere annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Anglais 1', 'GE11-ANG1'),
    ('Circuits Electriques', 'GE11-CIRCUITS'),
    ('Installations Domestiques', 'GE11-INSTD'),
    ('Appareillages Electriques', 'GE11-APPAREIL'),
    ('Physique 1', 'GE11-PHY1'),
    ('Atelier Systemes Logiques 1', 'GE11-ATELSLOG1'),
    ('Mathematiques 1', 'GE11-MATH1'),
    ('Mesures et Metrologie', 'GE11-MESMET'),
    ('CAO Electronique 1', 'GE11-CAO1'),
    ('2CN', 'GE11-2CN'),
    ('Techniques de communication', 'GE11-COMM'),
    ('Atelier Programmation Structuree 1', 'GE11-ATELPROG1'),
    ('Atelier Installations Domestiques', 'GE11-ATELINSTD'),
    ('Systemes Logiques 1', 'GE11-SLOG1'),
    ('Atelier Circuits Electriques et Mesures', 'GE11-ATELCIRCMES'),
    ('Programmation Structuree 1', 'GE11-PROG1'),
    ('Atelier Physique', 'GE11-ATELPHY'),
    ('CAD Electrique 1', 'GE11-CADELEC1')
) AS v(name, code)
WHERE m.code = v.code;

-- AII 21 (Automatisme et Informatique Industrielle - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Traitement de Signal', 'AII21-TREATSIG'),
    ('Electronique de Puissance', 'AII21-ELECP'),
    ('Automatismes Industriels', 'AII21-AUTO'),
    ('Systemes Embarques', 'AII21-EMB'),
    ('Droit', 'AII21-DROIT'),
    ('Instrumentation Industrielle', 'AII21-INSTR'),
    ('Electrotechnique', 'AII21-ELECTRO'),
    ('Preparation a la Certification en Francais 1', 'AII21-CERTFR'),
    ('Anglais Technique', 'AII21-ANGTECH'),
    ('Electronique Analogique', 'AII21-ELECAN'),
    ('Atelier Instrumentation Industrielle', 'AII21-ATELINSTR'),
    ('Atelier Programmation Python', 'AII21-ATELPY'),
    ('Atelier Electronique Analogique', 'AII21-ATELAN'),
    ('Systemes Asservis Lineaires Continus', 'AII21-SALC'),
    ('Atelier Mini Projets', 'AII21-ATELMINI'),
    ('Atelier Automatique', 'AII21-ATELAUT'),
    ('Atelier Automatismes Industriels', 'AII21-ATELAUTOIND')
) AS v(name, code)
WHERE m.code = v.code;

-- EI 2 (Electrotechnique Industrielle - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Instrumentation Industrielle', 'EI2-INSTR'),
    ('Electronique Analogique', 'EI2-ELECAN'),
    ('Systemes Asservis Lineaires Continus', 'EI2-SALC'),
    ('Preparation a la Certification en Francais 1', 'EI2-CERTFR'),
    ('Circuits Speciaux', 'EI2-CIRCSPE'),
    ('Anglais Technique', 'EI2-ANGTECH'),
    ('Electronique de Puissance', 'EI2-ELECP'),
    ('Electrotechnique', 'EI2-ELECTRO'),
    ('Microcontroleur', 'EI2-MICRO'),
    ('Droit', 'EI2-DROIT'),
    ('Atelier Mini Projets', 'EI2-ATELMINI'),
    ('Atelier Microcontroleur', 'EI2-ATELMICRO'),
    ('Automatismes Industriels', 'EI2-AUTO'),
    ('Atelier Electrotechnique', 'EI2-ATELLECT'),
    ('Atelier Automatique', 'EI2-ATELAUT'),
    ('Atelier Automatismes Industriels', 'EI2-ATELAUTOIND'),
    ('Atelier Instrumentation Industrielle', 'EI2-ATELINSTR')
) AS v(name, code)
WHERE m.code = v.code;

-- EI 3 (Electrotechnique Industrielle - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Qualite', 'EI3-QUAL'),
    ('Creation d''Entreprise', 'EI3-ENTRE'),
    ('Conception des Installations Industrielles', 'EI3-CONCINST'),
    ('Preparation a la Certification en Analais 2', 'EI3-CERTAN'),
    ('Variateurs de Vitesse', 'EI3-VARY'),
    ('At. Conception Installations Domotiques', 'EI3-CONCDOM'),
    ('Conception des Installations Domotiques', 'EI3-CONCDOM2'),
    ('Maintenance et Fiabilite', 'EI3-MAINT'),
    ('Energies Renouvelables', 'EI3-ENR'),
    ('Atelier Qualite et maintenance', 'EI3-ATELQUAL'),
    ('Atelier Commande des Machines', 'EI3-ATELCMD'),
    ('Supervision de Processus Industriels', 'EI3-SUPERV'),
    ('Distribution et Exploitation', 'EI3-DIST'),
    ('Atelier Energies Renouvelables', 'EI3-ATELENR'),
    ('At. Supervision de Processus Industriels', 'EI3-ATELSUP'),
    ('Atelier Distribution et Exploitation', 'EI3-ATELDIST')
) AS v(name, code)
WHERE m.code = v.code;

-- AII 3 (Automatisme et Informatique Industrielle - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Conception des Installations Domotiques', 'AII3-CONCDOM'),
    ('Supervision de Processus Industriels', 'AII3-SUPERV'),
    ('Regulation Industrielle', 'AII3-REG'),
    ('Systemes Robotises', 'AII3-ROBOT'),
    ('Intelligence Artificielle', 'AII3-AI'),
    ('Creation d''Entreprise', 'AII3-ENTRE'),
    ('Atelier Circuits Proarammables', 'AII3-ATELFPGA'),
    ('Atelier Qualite et Maintenance', 'AII3-ATELQUAL'),
    ('Systemes Temps Reel', 'AII3-REALTIME'),
    ('Atelier Intelligence Artificielle', 'AII3-ATELAI'),
    ('Qualite et Maintenance', 'AII3-QUALMAINT'),
    ('At. Supervision de Processus Industriels', 'AII3-ATELSUP'),
    ('Atelier Regulation Industrielle', 'AII3-ATELREG'),
    ('Preparation a la Certification en Analais 2', 'AII3-CERTAN'),
    ('Atelier Systemes Temps Reel', 'AII3-ATELRT'),
    ('Atelier Bureau d''Etudes', 'AII3-ATELBUREAU'),
    ('Circuits FPGA', 'AII3-FPGA'),
    ('Atelier Systemes Robotises', 'AII3-ATELROBOT'),
    ('Circuits DSPs', 'AII3-DSP')
) AS v(name, code)
WHERE m.code = v.code;

-- GENIE CIVIL (GC) matieres
-- GC 11 (Tronc Commun - 1ere annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Statique', 'GC11-STAT'),
    ('2CN', 'GC11-2CN'),
    ('Mathematique 1', 'GC11-MATH1'),
    ('Topographie generale 1', 'GC11-TOPO'),
    ('Materiaux de Construction 1', 'GC11-MATCON1'),
    ('Technologies de Construction 1', 'GC11-TECHCONST1'),
    ('Atelier Technologies de Construction 1', 'GC11-ATELTC1'),
    ('Anglais 1', 'GC11-ANG1'),
    ('Francais', 'GC11-FR'),
    ('Atelier de genie civil', 'GC11-ATELGC'),
    ('Dessin 1', 'GC11-DESSIN1'),
    ('Atelier Materiaux de Construction', 'GC11-ATELMAT'),
    ('Atelier Topographie', 'GC11-ATELTOPO')
) AS v(name, code)
WHERE m.code = v.code;

-- BAT 2 (Batiment - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Charpente Metallique', 'BAT2-CHARP'),
    ('Calcul des Structures', 'BAT2-CALCSTR'),
    ('Beton Arme 1', 'BAT2-BETON1'),
    ('Anglais Technique', 'BAT2-ANGTECH'),
    ('Atelier Calcul des Structures', 'BAT2-ATELCALC'),
    ('DAO 2', 'BAT2-DAO2'),
    ('Mecanique des sols 1', 'BAT2-MSOL1'),
    ('Preparation a la certification Francais', 'BAT2-CERTFR'),
    ('Hydraulique et Hydrologie', 'BAT2-HYDRO'),
    ('CAO Ossatures Metalliques', 'BAT2-CAOOSS'),
    ('Culture Entrepreneuriale', 'BAT2-ENTRE'),
    ('Structural optimization', 'BAT2-STRUCOPT'),
    ('Atelier Mecanique des sols 1', 'BAT2-ATELMSOL'),
    ('Atelier Hydraulique', 'BAT2-ATELHYD')
) AS v(name, code)
WHERE m.code = v.code;

-- TP 2 (Travaux Publics - 2eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Construction Routiere 1', 'TP2-ROUTE1'),
    ('Calcul des Structures', 'TP2-CALCSTR'),
    ('Beton Arme 1', 'TP2-BETON1'),
    ('Anglais Technique', 'TP2-ANGTECH'),
    ('Atelier Calcul des Structures', 'TP2-ATELCALC'),
    ('DAO 2', 'TP2-DAO2'),
    ('Mecanique des sols 1', 'TP2-MSOL1'),
    ('Preparation a la certification Francais', 'TP2-CERTFR'),
    ('Hydraulique et Hydrologie', 'TP2-HYDRO'),
    ('Atelier Routes et produits noirs', 'TP2-ATELROUTE'),
    ('Culture Entrepreneuriale', 'TP2-ENTRE'),
    ('Structural optimization', 'TP2-STRUCOPT'),
    ('Atelier Mecanique des sols 1', 'TP2-ATELMSOL'),
    ('Atelier Hydraulique', 'TP2-ATELHYD')
) AS v(name, code)
WHERE m.code = v.code;

-- TP 3 (Travaux Publics - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Qualite et Controle des travaux', 'TP3-QUAL'),
    ('Metre et estimation des prix', 'TP3-METRE'),
    ('Atelier Techniques de Recherche d''emploi et marketing de soi', 'TP3-ATELTRM'),
    ('Atelier Planification et gestion des chantiers', 'TP3-ATELPLAN'),
    ('Technologie BP', 'TP3-TECHBP'),
    ('Planification et gestion des chantiers', 'TP3-PLAN'),
    ('Technologie des ouvrages speciaux', 'TP3-TECHOS'),
    ('Pathologies des routes et des ouvrages', 'TP3-PATH'),
    ('Mini projet batiment', 'TP3-MINIP'),
    ('Preparation a la certification Anglais 2', 'TP3-CERTANG2'),
    ('Ouvrage d''art 2', 'TP3-OUV2'),
    ('CAO Ossatures metalliques', 'TP3-CAOOSS'),
    ('Creation d''entreprise', 'TP3-ENTRE'),
    ('Mini projet VRD', 'TP3-MINIPVRD'),
    ('DAO Avance', 'TP3-DAOAV'),
    ('Mini projet Route', 'TP3-MINIPR')
) AS v(name, code)
WHERE m.code = v.code;

-- BAT 3 (Batiment - 3eme annee)
UPDATE matiere m
SET nom = v.name
FROM (
  VALUES
    ('Qualite et Controle des travaux', 'BAT3-QUAL'),
    ('Metre et estimation des prix', 'BAT3-METRE'),
    ('Atelier Techniques de Recherche d''emploi et marketing de soi', 'BAT3-ATELTRM'),
    ('Atelier Planification et gestion des chantiers', 'BAT3-ATELPLAN'),
    ('Mini projet VRD', 'BAT3-MINIPVRD'),
    ('Technologie BP', 'BAT3-TECHBP'),
    ('Planification et gestion des chantiers', 'BAT3-PLAN'),
    ('Technologie des ouvrages speciaux', 'BAT3-TECHOS'),
    ('DAO Avance', 'BAT3-DAOAV'),
    ('Preparation a la certification Anglais 2', 'BAT3-CERTANG2'),
    ('Second oeuvres et Decoration', 'BAT3-DECOR'),
    ('Mini projet Batiment', 'BAT3-MINIPB'),
    ('Mini projet CM', 'BAT3-MINIPCM'),
    ('Creation d''entreprise', 'BAT3-ENTRE'),
    ('Pathologies et Renovation des batiments', 'BAT3-PATHREN')
) AS v(name, code)
WHERE m.code = v.code;

COMMIT;
