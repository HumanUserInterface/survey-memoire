export type QuestionType =
  | "select"
  | "radio"
  | "checkbox"
  | "slider"
  | "textarea";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  section: number;
  sectionLabel: string;
  question: string;
  type: QuestionType;
  options?: QuestionOption[];
  required: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  // Conditional logic: skip this question if the condition is met
  skipIf?: {
    questionId: string;
    values: string[];
  };
}

// Database column mapping
export const questionToColumn: Record<string, string> = {
  secteur: "secteur",
  taille_entreprise: "taille_entreprise",
  niveau_poste: "niveau_poste",
  age_tranche: "age_tranche",
  usage_ia: "usage_ia",
  frequence_usage: "frequence_usage",
  connait_llm: "connait_llm",
  comprend_erreurs: "comprend_erreurs",
  qualite_prompts: "qualite_prompts",
  verifie_reponses: "verifie_reponses",
  score_maitrise: "score_maitrise",
  niveau_inquietude: "niveau_inquietude",
  nature_inquietudes: "nature_inquietudes",
  risque_remplacement: "risque_remplacement",
  remise_en_question_valeur: "remise_en_question_valeur",
  nature_resistance: "nature_resistance",
  encouragement_entreprise: "encouragement_entreprise",
  formation_proposee: "formation_proposee",
  apprentissage_modal: "apprentissage_modal",
  competences_suffisantes: "competences_suffisantes",
  qualification_approche: "qualification_approche",
  commentaire_libre: "commentaire_libre",
};

export const questions: Question[] = [
  // Section 0 — Profil
  {
    id: "secteur",
    section: 0,
    sectionLabel: "Votre profil",
    question: "Dans quel secteur d'activité travaillez-vous ?",
    type: "select",
    required: true,
    options: [
      { value: "digital_tech", label: "Digital / Tech" },
      { value: "conseil", label: "Conseil" },
      { value: "finance", label: "Finance" },
      { value: "sante", label: "Santé" },
      { value: "industrie", label: "Industrie" },
      { value: "retail", label: "Retail / Commerce" },
      { value: "rh", label: "Ressources humaines" },
      { value: "education", label: "Éducation" },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    id: "taille_entreprise",
    section: 0,
    sectionLabel: "Votre profil",
    question: "Quelle est la taille de votre entreprise ?",
    type: "radio",
    required: true,
    options: [
      { value: "tpe", label: "TPE (moins de 10 salariés)" },
      { value: "pme", label: "PME (10 à 250 salariés)" },
      { value: "eti", label: "ETI (250 à 5 000 salariés)" },
      { value: "grand_groupe", label: "Grand groupe (plus de 5 000 salariés)" },
    ],
  },
  {
    id: "niveau_poste",
    section: 0,
    sectionLabel: "Votre profil",
    question: "Quel est votre niveau de poste ?",
    type: "radio",
    required: true,
    options: [
      { value: "executant", label: "Exécutant" },
      { value: "manager", label: "Manager intermédiaire" },
      { value: "cadre_dirigeant", label: "Cadre dirigeant" },
      { value: "independant", label: "Indépendant / Freelance" },
    ],
  },
  {
    id: "age_tranche",
    section: 0,
    sectionLabel: "Votre profil",
    question: "Quelle est votre tranche d'âge ?",
    type: "radio",
    required: true,
    options: [
      { value: "moins_25", label: "Moins de 25 ans" },
      { value: "25_34", label: "25 – 34 ans" },
      { value: "35_44", label: "35 – 44 ans" },
      { value: "45_54", label: "45 – 54 ans" },
      { value: "55_plus", label: "55 ans et plus" },
    ],
  },
  {
    id: "usage_ia",
    section: 0,
    sectionLabel: "Votre profil",
    question:
      "Utilisez-vous l'intelligence artificielle dans votre contexte professionnel ?",
    type: "radio",
    required: true,
    options: [
      { value: "oui_regulierement", label: "Oui, régulièrement" },
      { value: "oui_occasionnellement", label: "Oui, occasionnellement" },
      { value: "non_jamais", label: "Non, jamais" },
    ],
  },

  // Section 1 — Usage & compréhension (H1)
  {
    id: "frequence_usage",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question: "À quelle fréquence utilisez-vous l'IA ?",
    type: "radio",
    required: true,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
    options: [
      { value: "plusieurs_fois_jour", label: "Plusieurs fois par jour" },
      { value: "une_fois_jour", label: "Une fois par jour" },
      { value: "quelques_fois_semaine", label: "Quelques fois par semaine" },
      { value: "rarement", label: "Rarement" },
    ],
  },
  {
    id: "connait_llm",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question: "Savez-vous ce qu'est un LLM (Large Language Model) ?",
    type: "radio",
    required: true,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
    options: [
      { value: "oui_clairement", label: "Oui, clairement" },
      {
        value: "entendu_parler",
        label: "J'en ai entendu parler sans vraiment savoir",
      },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "comprend_erreurs",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question:
      "Savez-vous pourquoi l'IA peut produire des réponses incorrectes (hallucinations) ?",
    type: "radio",
    required: true,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
    options: [
      { value: "oui", label: "Oui" },
      { value: "pas_vraiment", label: "Pas vraiment" },
      { value: "non", label: "Non" },
    ],
  },
  {
    id: "qualite_prompts",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question: "Comment formulez-vous généralement vos demandes à l'IA ?",
    type: "radio",
    required: true,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
    options: [
      { value: "phrase_courte", label: "Une phrase courte et directe" },
      {
        value: "structuree",
        label: "Une demande structurée avec contexte et rôle",
      },
      { value: "varie", label: "Je varie selon les cas" },
    ],
  },
  {
    id: "verifie_reponses",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question: "Vérifiez-vous systématiquement les réponses de l'IA ?",
    type: "radio",
    required: true,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
    options: [
      { value: "toujours", label: "Toujours" },
      { value: "souvent", label: "Souvent" },
      { value: "rarement", label: "Rarement" },
      { value: "jamais", label: "Jamais" },
    ],
  },
  {
    id: "score_maitrise",
    section: 1,
    sectionLabel: "Usage & compréhension de l'IA",
    question:
      "Sur une échelle de 1 à 10, évaluez votre niveau de maîtrise réelle de l'IA (pas juste l'utilisation, mais la compréhension de ce que vous faites)",
    type: "slider",
    required: true,
    min: 1,
    max: 10,
    step: 1,
    skipIf: { questionId: "usage_ia", values: ["non_jamais"] },
  },

  // Section 2 — Freins & perceptions (H2)
  {
    id: "niveau_inquietude",
    section: 2,
    sectionLabel: "Freins & perceptions",
    question: "L'intelligence artificielle vous inspire-t-elle de l'inquiétude ?",
    type: "radio",
    required: true,
    options: [
      { value: "oui_beaucoup", label: "Oui, beaucoup" },
      { value: "oui_un_peu", label: "Oui, un peu" },
      { value: "non_pas_vraiment", label: "Non, pas vraiment" },
      { value: "non_pas_du_tout", label: "Non, pas du tout" },
    ],
  },
  {
    id: "nature_inquietudes",
    section: 2,
    sectionLabel: "Freins & perceptions",
    question: "Qu'est-ce qui vous inquiète principalement ? (plusieurs réponses possibles)",
    type: "checkbox",
    required: true,
    skipIf: { questionId: "niveau_inquietude", values: ["non_pas_du_tout"] },
    options: [
      { value: "dependance", label: "La dépendance à l'outil" },
      { value: "perte_competences", label: "La perte de compétences" },
      { value: "remplacement_poste", label: "Le remplacement de mon poste" },
      {
        value: "valeur_professionnelle",
        label: "La remise en question de ma valeur professionnelle",
      },
      { value: "qualite_outputs", label: "La qualité des outputs" },
      {
        value: "confidentialite",
        label: "La confidentialité des données",
      },
      { value: "autre", label: "Autre" },
    ],
  },
  {
    id: "risque_remplacement",
    section: 2,
    sectionLabel: "Freins & perceptions",
    question:
      "Pensez-vous que l'IA est susceptible de remplacer tout ou partie de votre travail ?",
    type: "radio",
    required: true,
    options: [
      { value: "oui_court_terme", label: "Oui, à court terme" },
      { value: "oui_moyen_terme", label: "Oui, à moyen terme" },
      { value: "non_mais_transformera", label: "Non, mais elle le transformera" },
      { value: "non_protege", label: "Non, mon métier est protégé" },
    ],
  },
  {
    id: "remise_en_question_valeur",
    section: 2,
    sectionLabel: "Freins & perceptions",
    question:
      "Avez-vous le sentiment que l'IA remet en question ce qui fait votre valeur professionnelle ?",
    type: "slider",
    required: true,
    min: 1,
    max: 5,
    step: 1,
    placeholder: "1 = Pas du tout — 5 = Tout à fait",
  },
  {
    id: "nature_resistance",
    section: 2,
    sectionLabel: "Freins & perceptions",
    question:
      "Votre résistance à l'IA est-elle plutôt liée à l'outil lui-même, ou à ce qu'il représente pour votre métier ?",
    type: "radio",
    required: true,
    options: [
      { value: "outil", label: "À l'outil lui-même" },
      { value: "representation", label: "À ce qu'il représente pour mon métier" },
      { value: "les_deux", label: "Les deux" },
      { value: "pas_de_resistance", label: "Je n'ai pas de résistance" },
    ],
  },

  // Section 3 — Accompagnement institutionnel (H3)
  {
    id: "encouragement_entreprise",
    section: 3,
    sectionLabel: "Accompagnement en entreprise",
    question: "Votre entreprise vous encourage-t-elle à utiliser l'IA ?",
    type: "radio",
    required: true,
    options: [
      { value: "oui_explicitement", label: "Oui, explicitement" },
      { value: "oui_implicitement", label: "Oui, implicitement" },
      { value: "non", label: "Non" },
      { value: "ne_sais_pas", label: "Je ne sais pas" },
    ],
  },
  {
    id: "formation_proposee",
    section: 3,
    sectionLabel: "Accompagnement en entreprise",
    question:
      "Votre entreprise vous a-t-elle proposé une formation structurée à l'IA ?",
    type: "radio",
    required: true,
    options: [
      { value: "formation_formelle", label: "Oui, une formation formelle" },
      {
        value: "ressources_libres",
        label: "Oui, des ressources en libre accès",
      },
      { value: "rien", label: "Non, rien de proposé" },
    ],
  },
  {
    id: "apprentissage_modal",
    section: 3,
    sectionLabel: "Accompagnement en entreprise",
    question:
      "Comment avez-vous principalement appris à utiliser l'IA ?",
    type: "radio",
    required: true,
    options: [
      { value: "seul_essais", label: "Seul·e, par essais-erreurs" },
      { value: "youtube_tutos", label: "Via YouTube ou des tutoriels en ligne" },
      { value: "collegue", label: "Via un·e collègue" },
      { value: "formation_interne", label: "Via une formation interne" },
      { value: "pas_utilise", label: "Je ne l'utilise pas" },
    ],
  },
  {
    id: "competences_suffisantes",
    section: 3,
    sectionLabel: "Accompagnement en entreprise",
    question:
      "Estimez-vous avoir les compétences suffisantes pour utiliser l'IA de manière efficace et critique ?",
    type: "radio",
    required: true,
    options: [
      { value: "oui_tout_a_fait", label: "Oui, tout à fait" },
      { value: "plutot_oui", label: "Plutôt oui" },
      { value: "plutot_non", label: "Plutôt non" },
      { value: "non_pas_du_tout", label: "Non, pas du tout" },
    ],
  },
  {
    id: "qualification_approche",
    section: 3,
    sectionLabel: "Accompagnement en entreprise",
    question:
      "Si votre entreprise vous encourageait à utiliser l'IA sans vous former, comment qualifieriez-vous cette approche ?",
    type: "radio",
    required: true,
    options: [
      { value: "responsable", label: "Responsable" },
      { value: "insuffisante", label: "Insuffisante" },
      { value: "acceptable", label: "Acceptable" },
      { value: "irresponsable", label: "Irresponsable" },
    ],
  },

  // Section 4 — Question ouverte
  {
    id: "commentaire_libre",
    section: 4,
    sectionLabel: "Pour conclure",
    question:
      "En une ou deux phrases, qu'est-ce qui vous permettrait de mieux adopter l'IA dans votre travail ?",
    type: "textarea",
    required: false,
    placeholder: "Votre réponse (facultatif)...",
  },
];

// Get visible questions based on current answers (handles conditional logic)
export function getVisibleQuestions(
  answers: Record<string, string | string[] | number>
): Question[] {
  return questions.filter((q) => {
    if (!q.skipIf) return true;
    const conditionAnswer = answers[q.skipIf.questionId];
    if (typeof conditionAnswer === "string") {
      return !q.skipIf.values.includes(conditionAnswer);
    }
    return true;
  });
}

// Total number of questions (for display, before conditional logic)
export const TOTAL_QUESTIONS = questions.length;
