-- À exécuter dans le dashboard Supabase > SQL Editor

create table if not exists responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),

  -- Section 0 : profil
  secteur text,
  taille_entreprise text,
  niveau_poste text,
  age_tranche text,
  usage_ia text,

  -- Section 1 : H1 — illectronisme fonctionnel
  frequence_usage text,
  connait_llm text,
  comprend_erreurs text,
  qualite_prompts text,
  verifie_reponses text,
  score_maitrise integer check (score_maitrise between 1 and 10),

  -- Section 2 : H2 — anxiété existentielle
  niveau_inquietude text,
  nature_inquietudes text[],
  risque_remplacement text,
  remise_en_question_valeur integer check (remise_en_question_valeur between 1 and 5),
  nature_resistance text,

  -- Section 3 : H3 — accompagnement institutionnel
  encouragement_entreprise text,
  formation_proposee text,
  apprentissage_modal text,
  competences_suffisantes text,
  qualification_approche text,

  -- Section 4 : open
  commentaire_libre text
);

-- RLS : autoriser les insertions publiques (formulaire), lecture uniquement authentifiée
alter table responses enable row level security;

create policy "insert_public" on responses
  for insert with check (true);

create policy "select_authenticated" on responses
  for select using (auth.role() = 'authenticated');

-- Index pour les requêtes dashboard
create index on responses (created_at desc);
create index on responses (secteur);
create index on responses (usage_ia);
