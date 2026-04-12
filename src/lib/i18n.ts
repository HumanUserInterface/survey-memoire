export type Locale = "fr" | "en";

export const translations = {
  fr: {
    // UI
    questionOf: "Question {current} sur {total}",
    next: "Suivant",
    back: "Retour",
    submit: "Envoyer",
    pressEnter: "Appuyez sur Entrée ↵",
    selectPlaceholder: "Sélectionnez une option",
    optional: "Facultatif",
    textareaPlaceholder: "Votre réponse (facultatif)...",
    errorSubmit: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
    // Thank you
    thankYouTitle: "Merci pour votre participation !",
    thankYouText: "Vos réponses ont bien été enregistrées. Elles contribueront à la recherche sur l'adoption de l'IA en entreprise.",
    shareText: "Partagez ce questionnaire avec vos collègues :",
    copied: "Copié",
    copy: "Copier",
    // Language
    switchLang: "EN",
    // Section labels
    sectionLabels: {
      0: "Votre profil",
      1: "Usage & compréhension de l'IA",
      2: "Freins & perceptions",
      3: "Accompagnement en entreprise",
      4: "Pour conclure",
    } as Record<number, string>,
    // Questions
    questions: {
      secteur: "Dans quel secteur d'activité travaillez-vous ?",
      taille_entreprise: "Quelle est la taille de votre entreprise ?",
      niveau_poste: "Quel est votre niveau de poste ?",
      age_tranche: "Quelle est votre tranche d'âge ?",
      usage_ia: "Utilisez-vous l'intelligence artificielle dans votre contexte professionnel ?",
      frequence_usage: "À quelle fréquence utilisez-vous l'IA ?",
      connait_llm: "Savez-vous ce qu'est un LLM (Large Language Model) ?",
      comprend_erreurs: "Savez-vous pourquoi l'IA peut produire des réponses incorrectes (hallucinations) ?",
      qualite_prompts: "Comment formulez-vous généralement vos demandes à l'IA ?",
      verifie_reponses: "Vérifiez-vous systématiquement les réponses de l'IA ?",
      score_maitrise: "Sur une échelle de 1 à 10, évaluez votre niveau de maîtrise réelle de l'IA (pas juste l'utilisation, mais la compréhension de ce que vous faites)",
      niveau_inquietude: "L'intelligence artificielle vous inspire-t-elle de l'inquiétude ?",
      nature_inquietudes: "Qu'est-ce qui vous inquiète principalement ? (plusieurs réponses possibles)",
      risque_remplacement: "Pensez-vous que l'IA est susceptible de remplacer tout ou partie de votre travail ?",
      remise_en_question_valeur: "Avez-vous le sentiment que l'IA remet en question ce qui fait votre valeur professionnelle ?",
      nature_resistance: "Votre résistance à l'IA est-elle plutôt liée à l'outil lui-même, ou à ce qu'il représente pour votre métier ?",
      encouragement_entreprise: "Votre entreprise vous encourage-t-elle à utiliser l'IA ?",
      formation_proposee: "Votre entreprise vous a-t-elle proposé une formation structurée à l'IA ?",
      apprentissage_modal: "Comment avez-vous principalement appris à utiliser l'IA ?",
      competences_suffisantes: "Estimez-vous avoir les compétences suffisantes pour utiliser l'IA de manière efficace et critique ?",
      qualification_approche: "Si votre entreprise vous encourageait à utiliser l'IA sans vous former, comment qualifieriez-vous cette approche ?",
      commentaire_libre: "En une ou deux phrases, qu'est-ce qui vous permettrait de mieux adopter l'IA dans votre travail ?",
    } as Record<string, string>,
    // Options (keyed by question id then option value)
    options: {
      secteur: {
        digital_tech: "Digital / Tech",
        conseil: "Conseil",
        finance: "Finance",
        sante: "Santé",
        industrie: "Industrie",
        retail: "Retail / Commerce",
        rh: "Ressources humaines",
        education: "Éducation",
        autre: "Autre",
      },
      taille_entreprise: {
        tpe: "TPE (moins de 10 salariés)",
        pme: "PME (10 à 250 salariés)",
        eti: "ETI (250 à 5 000 salariés)",
        grand_groupe: "Grand groupe (plus de 5 000 salariés)",
      },
      niveau_poste: {
        executant: "Exécutant",
        manager: "Manager intermédiaire",
        cadre_dirigeant: "Cadre dirigeant",
        independant: "Indépendant / Freelance",
      },
      age_tranche: {
        moins_25: "Moins de 25 ans",
        "25_34": "25 – 34 ans",
        "35_44": "35 – 44 ans",
        "45_54": "45 – 54 ans",
        "55_plus": "55 ans et plus",
      },
      usage_ia: {
        oui_regulierement: "Oui, régulièrement",
        oui_occasionnellement: "Oui, occasionnellement",
        non_jamais: "Non, jamais",
      },
      frequence_usage: {
        plusieurs_fois_jour: "Plusieurs fois par jour",
        une_fois_jour: "Une fois par jour",
        quelques_fois_semaine: "Quelques fois par semaine",
        rarement: "Rarement",
      },
      connait_llm: {
        oui_clairement: "Oui, clairement",
        entendu_parler: "J'en ai entendu parler sans vraiment savoir",
        non: "Non",
      },
      comprend_erreurs: {
        oui: "Oui",
        pas_vraiment: "Pas vraiment",
        non: "Non",
      },
      qualite_prompts: {
        phrase_courte: "Une phrase courte et directe",
        structuree: "Une demande structurée avec contexte et rôle",
        varie: "Je varie selon les cas",
      },
      verifie_reponses: {
        toujours: "Toujours",
        souvent: "Souvent",
        rarement: "Rarement",
        jamais: "Jamais",
      },
      niveau_inquietude: {
        oui_beaucoup: "Oui, beaucoup",
        oui_un_peu: "Oui, un peu",
        non_pas_vraiment: "Non, pas vraiment",
        non_pas_du_tout: "Non, pas du tout",
      },
      nature_inquietudes: {
        dependance: "La dépendance à l'outil",
        perte_competences: "La perte de compétences",
        remplacement_poste: "Le remplacement de mon poste",
        valeur_professionnelle: "La remise en question de ma valeur professionnelle",
        qualite_outputs: "La qualité des outputs",
        confidentialite: "La confidentialité des données",
        autre: "Autre",
      },
      risque_remplacement: {
        oui_court_terme: "Oui, à court terme",
        oui_moyen_terme: "Oui, à moyen terme",
        non_mais_transformera: "Non, mais elle le transformera",
        non_protege: "Non, mon métier est protégé",
      },
      nature_resistance: {
        outil: "À l'outil lui-même",
        representation: "À ce qu'il représente pour mon métier",
        les_deux: "Les deux",
        pas_de_resistance: "Je n'ai pas de résistance",
      },
      encouragement_entreprise: {
        oui_explicitement: "Oui, explicitement",
        oui_implicitement: "Oui, implicitement",
        non: "Non",
        ne_sais_pas: "Je ne sais pas",
      },
      formation_proposee: {
        formation_formelle: "Oui, une formation formelle",
        ressources_libres: "Oui, des ressources en libre accès",
        rien: "Non, rien de proposé",
      },
      apprentissage_modal: {
        seul_essais: "Seul·e, par essais-erreurs",
        youtube_tutos: "Via YouTube ou des tutoriels en ligne",
        collegue: "Via un·e collègue",
        formation_interne: "Via une formation interne",
        pas_utilise: "Je ne l'utilise pas",
      },
      competences_suffisantes: {
        oui_tout_a_fait: "Oui, tout à fait",
        plutot_oui: "Plutôt oui",
        plutot_non: "Plutôt non",
        non_pas_du_tout: "Non, pas du tout",
      },
      qualification_approche: {
        responsable: "Responsable",
        insuffisante: "Insuffisante",
        acceptable: "Acceptable",
        irresponsable: "Irresponsable",
      },
    } as Record<string, Record<string, string>>,
    sliderLabels: {
      remise_en_question_valeur: "1 = Pas du tout — 5 = Tout à fait",
    } as Record<string, string>,
  },
  en: {
    questionOf: "Question {current} of {total}",
    next: "Next",
    back: "Back",
    submit: "Submit",
    pressEnter: "Press Enter ↵",
    selectPlaceholder: "Select an option",
    optional: "Optional",
    textareaPlaceholder: "Your answer (optional)...",
    errorSubmit: "An error occurred while submitting. Please try again.",
    thankYouTitle: "Thank you for your participation!",
    thankYouText: "Your answers have been recorded. They will contribute to research on AI adoption in the workplace.",
    shareText: "Share this survey with your colleagues:",
    copied: "Copied",
    copy: "Copy",
    switchLang: "FR",
    sectionLabels: {
      0: "Your profile",
      1: "AI usage & understanding",
      2: "Concerns & perceptions",
      3: "Workplace support",
      4: "To conclude",
    } as Record<number, string>,
    questions: {
      secteur: "What industry do you work in?",
      taille_entreprise: "What is your company size?",
      niveau_poste: "What is your job level?",
      age_tranche: "What is your age range?",
      usage_ia: "Do you use artificial intelligence in your professional context?",
      frequence_usage: "How often do you use AI?",
      connait_llm: "Do you know what an LLM (Large Language Model) is?",
      comprend_erreurs: "Do you know why AI can produce incorrect answers (hallucinations)?",
      qualite_prompts: "How do you generally formulate your requests to AI?",
      verifie_reponses: "Do you systematically verify AI responses?",
      score_maitrise: "On a scale of 1 to 10, rate your real level of AI mastery (not just usage, but understanding of what you're doing)",
      niveau_inquietude: "Does artificial intelligence cause you concern?",
      nature_inquietudes: "What concerns you the most? (multiple answers possible)",
      risque_remplacement: "Do you think AI could replace all or part of your work?",
      remise_en_question_valeur: "Do you feel that AI questions what makes your professional value?",
      nature_resistance: "Is your resistance to AI more related to the tool itself, or to what it represents for your profession?",
      encouragement_entreprise: "Does your company encourage you to use AI?",
      formation_proposee: "Has your company offered you structured AI training?",
      apprentissage_modal: "How did you mainly learn to use AI?",
      competences_suffisantes: "Do you feel you have sufficient skills to use AI effectively and critically?",
      qualification_approche: "If your company encouraged you to use AI without training you, how would you describe this approach?",
      commentaire_libre: "In one or two sentences, what would help you better adopt AI in your work?",
    } as Record<string, string>,
    options: {
      secteur: {
        digital_tech: "Digital / Tech",
        conseil: "Consulting",
        finance: "Finance",
        sante: "Healthcare",
        industrie: "Industry",
        retail: "Retail / Commerce",
        rh: "Human Resources",
        education: "Education",
        autre: "Other",
      },
      taille_entreprise: {
        tpe: "Micro (less than 10 employees)",
        pme: "Small/Medium (10–250 employees)",
        eti: "Mid-size (250–5,000 employees)",
        grand_groupe: "Large corporation (5,000+ employees)",
      },
      niveau_poste: {
        executant: "Individual contributor",
        manager: "Middle manager",
        cadre_dirigeant: "Senior executive",
        independant: "Freelance / Independent",
      },
      age_tranche: {
        moins_25: "Under 25",
        "25_34": "25–34",
        "35_44": "35–44",
        "45_54": "45–54",
        "55_plus": "55+",
      },
      usage_ia: {
        oui_regulierement: "Yes, regularly",
        oui_occasionnellement: "Yes, occasionally",
        non_jamais: "No, never",
      },
      frequence_usage: {
        plusieurs_fois_jour: "Several times a day",
        une_fois_jour: "Once a day",
        quelques_fois_semaine: "A few times a week",
        rarement: "Rarely",
      },
      connait_llm: {
        oui_clairement: "Yes, clearly",
        entendu_parler: "I've heard of it without really knowing",
        non: "No",
      },
      comprend_erreurs: {
        oui: "Yes",
        pas_vraiment: "Not really",
        non: "No",
      },
      qualite_prompts: {
        phrase_courte: "A short, direct sentence",
        structuree: "A structured request with context and role",
        varie: "It varies depending on the case",
      },
      verifie_reponses: {
        toujours: "Always",
        souvent: "Often",
        rarement: "Rarely",
        jamais: "Never",
      },
      niveau_inquietude: {
        oui_beaucoup: "Yes, a lot",
        oui_un_peu: "Yes, a little",
        non_pas_vraiment: "Not really",
        non_pas_du_tout: "Not at all",
      },
      nature_inquietudes: {
        dependance: "Dependency on the tool",
        perte_competences: "Loss of skills",
        remplacement_poste: "Replacement of my job",
        valeur_professionnelle: "Questioning my professional value",
        qualite_outputs: "Quality of outputs",
        confidentialite: "Data privacy",
        autre: "Other",
      },
      risque_remplacement: {
        oui_court_terme: "Yes, short-term",
        oui_moyen_terme: "Yes, medium-term",
        non_mais_transformera: "No, but it will transform it",
        non_protege: "No, my job is protected",
      },
      nature_resistance: {
        outil: "The tool itself",
        representation: "What it represents for my profession",
        les_deux: "Both",
        pas_de_resistance: "I have no resistance",
      },
      encouragement_entreprise: {
        oui_explicitement: "Yes, explicitly",
        oui_implicitement: "Yes, implicitly",
        non: "No",
        ne_sais_pas: "I don't know",
      },
      formation_proposee: {
        formation_formelle: "Yes, formal training",
        ressources_libres: "Yes, self-service resources",
        rien: "No, nothing offered",
      },
      apprentissage_modal: {
        seul_essais: "Self-taught, trial and error",
        youtube_tutos: "Via YouTube or online tutorials",
        collegue: "Via a colleague",
        formation_interne: "Via internal training",
        pas_utilise: "I don't use it",
      },
      competences_suffisantes: {
        oui_tout_a_fait: "Yes, absolutely",
        plutot_oui: "Mostly yes",
        plutot_non: "Mostly no",
        non_pas_du_tout: "Not at all",
      },
      qualification_approche: {
        responsable: "Responsible",
        insuffisante: "Insufficient",
        acceptable: "Acceptable",
        irresponsable: "Irresponsible",
      },
    } as Record<string, Record<string, string>>,
    sliderLabels: {
      remise_en_question_valeur: "1 = Not at all — 5 = Completely",
    } as Record<string, string>,
  },
} as const;

export interface Translations {
  questionOf: string;
  next: string;
  back: string;
  submit: string;
  pressEnter: string;
  selectPlaceholder: string;
  optional: string;
  textareaPlaceholder: string;
  errorSubmit: string;
  thankYouTitle: string;
  thankYouText: string;
  shareText: string;
  copied: string;
  copy: string;
  switchLang: string;
  sectionLabels: Record<number, string>;
  questions: Record<string, string>;
  options: Record<string, Record<string, string>>;
  sliderLabels: Record<string, string>;
}

export function t(locale: Locale): Translations {
  return translations[locale];
}
