export interface WordQuestion {
  word: string;
  type: 'synonym' | 'antonym' | 'definition';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
}

export const WORD_QUESTIONS: WordQuestion[] = [
  // === EASY ===
  { word: 'content', type: 'synonym', question: 'Synonyme de "content"', options: ['Heureux', 'Triste', 'Fatigué', 'Calme'], correctIndex: 0, difficulty: 'easy' },
  { word: 'rapide', type: 'synonym', question: 'Synonyme de "rapide"', options: ['Lent', 'Vif', 'Lourd', 'Doux'], correctIndex: 1, difficulty: 'easy' },
  { word: 'grand', type: 'antonym', question: 'Antonyme de "grand"', options: ['Petit', 'Large', 'Haut', 'Fort'], correctIndex: 0, difficulty: 'easy' },
  { word: 'chaud', type: 'antonym', question: 'Antonyme de "chaud"', options: ['Tiède', 'Brûlant', 'Froid', 'Doux'], correctIndex: 2, difficulty: 'easy' },
  { word: 'beau', type: 'synonym', question: 'Synonyme de "beau"', options: ['Laid', 'Joli', 'Sombre', 'Rude'], correctIndex: 1, difficulty: 'easy' },
  { word: 'triste', type: 'antonym', question: 'Antonyme de "triste"', options: ['Morose', 'Morne', 'Joyeux', 'Pensif'], correctIndex: 2, difficulty: 'easy' },
  { word: 'commencer', type: 'synonym', question: 'Synonyme de "commencer"', options: ['Finir', 'Débuter', 'Arrêter', 'Couper'], correctIndex: 1, difficulty: 'easy' },
  { word: 'ancien', type: 'antonym', question: 'Antonyme de "ancien"', options: ['Vieux', 'Moderne', 'Usé', 'Classique'], correctIndex: 1, difficulty: 'easy' },
  { word: 'facile', type: 'antonym', question: 'Antonyme de "facile"', options: ['Simple', 'Aisé', 'Difficile', 'Clair'], correctIndex: 2, difficulty: 'easy' },
  { word: 'riche', type: 'antonym', question: 'Antonyme de "riche"', options: ['Pauvre', 'Aisé', 'Fortuné', 'Noble'], correctIndex: 0, difficulty: 'easy' },
  { word: 'courage', type: 'synonym', question: 'Synonyme de "courage"', options: ['Peur', 'Bravoure', 'Lâcheté', 'Doute'], correctIndex: 1, difficulty: 'easy' },
  { word: 'donner', type: 'antonym', question: 'Antonyme de "donner"', options: ['Offrir', 'Prendre', 'Partager', 'Céder'], correctIndex: 1, difficulty: 'easy' },
  { word: 'ami', type: 'antonym', question: 'Antonyme de "ami"', options: ['Camarade', 'Compagnon', 'Ennemi', 'Voisin'], correctIndex: 2, difficulty: 'easy' },
  { word: 'parler', type: 'synonym', question: 'Synonyme de "parler"', options: ['Écouter', 'Dire', 'Voir', 'Sentir'], correctIndex: 1, difficulty: 'easy' },
  { word: 'maison', type: 'synonym', question: 'Synonyme de "maison"', options: ['Demeure', 'Jardin', 'Route', 'Pont'], correctIndex: 0, difficulty: 'easy' },

  // === MEDIUM ===
  { word: 'altruiste', type: 'definition', question: 'Que signifie "altruiste" ?', options: ['Égoïste', 'Généreux envers autrui', 'Courageux', 'Prudent'], correctIndex: 1, difficulty: 'medium' },
  { word: 'éphémère', type: 'synonym', question: 'Synonyme de "éphémère"', options: ['Éternel', 'Passager', 'Solide', 'Puissant'], correctIndex: 1, difficulty: 'medium' },
  { word: 'lucide', type: 'definition', question: 'Que signifie "lucide" ?', options: ['Confus', 'Clairvoyant', 'Endormi', 'Hésitant'], correctIndex: 1, difficulty: 'medium' },
  { word: 'pérenne', type: 'antonym', question: 'Antonyme de "pérenne"', options: ['Durable', 'Temporaire', 'Stable', 'Ancien'], correctIndex: 1, difficulty: 'medium' },
  { word: 'pragmatique', type: 'definition', question: 'Que signifie "pragmatique" ?', options: ['Rêveur', 'Orienté vers la pratique', 'Timide', 'Impulsif'], correctIndex: 1, difficulty: 'medium' },
  { word: 'véhément', type: 'synonym', question: 'Synonyme de "véhément"', options: ['Calme', 'Ardent', 'Timide', 'Doux'], correctIndex: 1, difficulty: 'medium' },
  { word: 'prolixe', type: 'definition', question: 'Que signifie "prolixe" ?', options: ['Bref', 'Qui parle beaucoup', 'Silencieux', 'Précis'], correctIndex: 1, difficulty: 'medium' },
  { word: 'tenace', type: 'synonym', question: 'Synonyme de "tenace"', options: ['Fragile', 'Persistant', 'Faible', 'Souple'], correctIndex: 1, difficulty: 'medium' },
  { word: 'austère', type: 'antonym', question: 'Antonyme de "austère"', options: ['Sévère', 'Fastueux', 'Strict', 'Rigide'], correctIndex: 1, difficulty: 'medium' },
  { word: 'concis', type: 'antonym', question: 'Antonyme de "concis"', options: ['Bref', 'Court', 'Verbeux', 'Précis'], correctIndex: 2, difficulty: 'medium' },
  { word: 'sagace', type: 'definition', question: 'Que signifie "sagace" ?', options: ['Étourdi', 'Fin et perspicace', 'Lent', 'Naïf'], correctIndex: 1, difficulty: 'medium' },
  { word: 'prodigue', type: 'definition', question: 'Que signifie "prodigue" ?', options: ['Avare', 'Qui dépense sans compter', 'Prudent', 'Modeste'], correctIndex: 1, difficulty: 'medium' },
  { word: 'stoïque', type: 'synonym', question: 'Synonyme de "stoïque"', options: ['Émotif', 'Impassible', 'Agité', 'Nerveux'], correctIndex: 1, difficulty: 'medium' },
  { word: 'ambigu', type: 'antonym', question: 'Antonyme de "ambigu"', options: ['Flou', 'Vague', 'Clair', 'Incertain'], correctIndex: 2, difficulty: 'medium' },
  { word: 'corroborer', type: 'synonym', question: 'Synonyme de "corroborer"', options: ['Contredire', 'Confirmer', 'Ignorer', 'Douter'], correctIndex: 1, difficulty: 'medium' },

  // === HARD ===
  { word: 'obséquieux', type: 'definition', question: 'Que signifie "obséquieux" ?', options: ['Insolent', 'Excessivement poli', 'Distrait', 'Courageux'], correctIndex: 1, difficulty: 'hard' },
  { word: 'acrimonie', type: 'synonym', question: 'Synonyme de "acrimonie"', options: ['Douceur', 'Aigreur', 'Bonté', 'Gaieté'], correctIndex: 1, difficulty: 'hard' },
  { word: 'pusillanime', type: 'definition', question: 'Que signifie "pusillanime" ?', options: ['Courageux', 'Qui manque de courage', 'Généreux', 'Ambitieux'], correctIndex: 1, difficulty: 'hard' },
  { word: 'apocryphe', type: 'definition', question: 'Que signifie "apocryphe" ?', options: ['Authentique', "D'authenticité douteuse", 'Ancien', 'Sacré'], correctIndex: 1, difficulty: 'hard' },
  { word: 'dirimant', type: 'definition', question: 'Que signifie "dirimant" ?', options: ['Qui annule', 'Qui confirme', 'Qui clarifie', 'Qui améliore'], correctIndex: 0, difficulty: 'hard' },
  { word: 'incurie', type: 'definition', question: 'Que signifie "incurie" ?', options: ['Compétence', 'Négligence', 'Curiosité', 'Soin'], correctIndex: 1, difficulty: 'hard' },
  { word: 'pléthorique', type: 'antonym', question: 'Antonyme de "pléthorique"', options: ['Abondant', 'Insuffisant', 'Excessif', 'Complet'], correctIndex: 1, difficulty: 'hard' },
  { word: 'laconique', type: 'synonym', question: 'Synonyme de "laconique"', options: ['Bavard', 'Bref', 'Explicite', 'Long'], correctIndex: 1, difficulty: 'hard' },
  { word: 'acerbe', type: 'synonym', question: 'Synonyme de "acerbe"', options: ['Doux', 'Caustique', 'Tendre', 'Aimable'], correctIndex: 1, difficulty: 'hard' },
  { word: 'délétère', type: 'definition', question: 'Que signifie "délétère" ?', options: ['Bénéfique', 'Nuisible', 'Neutre', 'Salutaire'], correctIndex: 1, difficulty: 'hard' },
  { word: 'mansuétude', type: 'definition', question: 'Que signifie "mansuétude" ?', options: ['Sévérité', 'Indulgence et douceur', 'Colère', 'Indifférence'], correctIndex: 1, difficulty: 'hard' },
  { word: 'résilience', type: 'definition', question: 'Que signifie "résilience" ?', options: ['Fragilité', 'Capacité à rebondir', 'Résistance passive', 'Faiblesse'], correctIndex: 1, difficulty: 'hard' },

  // === EXPERT ===
  { word: 'ataraxie', type: 'definition', question: 'Que signifie "ataraxie" ?', options: ['Anxiété', 'Tranquillité absolue', 'Agitation', 'Mélancolie'], correctIndex: 1, difficulty: 'expert' },
  { word: 'syncrétisme', type: 'definition', question: 'Que signifie "syncrétisme" ?', options: ['Séparation', 'Fusion de doctrines', 'Opposition', 'Analyse'], correctIndex: 1, difficulty: 'expert' },
  { word: 'aporétique', type: 'definition', question: 'Que signifie "aporétique" ?', options: ['Qui résout', 'Sans issue logique', 'Qui simplifie', 'Qui éclaircit'], correctIndex: 1, difficulty: 'expert' },
  { word: 'épiphanie', type: 'definition', question: 'Que signifie "épiphanie" (sens figuré) ?', options: ['Disparition', 'Révélation soudaine', 'Oubli', 'Confusion'], correctIndex: 1, difficulty: 'expert' },
  { word: 'palimpseste', type: 'definition', question: 'Que signifie "palimpseste" ?', options: ['Texte original', 'Manuscrit réécrit', 'Livre neuf', 'Parchemin vierge'], correctIndex: 1, difficulty: 'expert' },
  { word: 'antinomique', type: 'synonym', question: 'Synonyme de "antinomique"', options: ['Compatible', 'Contradictoire', 'Similaire', 'Complémentaire'], correctIndex: 1, difficulty: 'expert' },
  { word: 'solipsisme', type: 'definition', question: 'Que signifie "solipsisme" ?', options: ['Foi en autrui', 'Seul le sujet existe', 'Amour universel', 'Confiance absolue'], correctIndex: 1, difficulty: 'expert' },
  { word: 'aporie', type: 'definition', question: 'Que signifie "aporie" ?', options: ['Solution', 'Impasse logique', 'Clarté', 'Réponse'], correctIndex: 1, difficulty: 'expert' },
  { word: 'sérendipité', type: 'definition', question: 'Que signifie "sérendipité" ?', options: ['Malchance', 'Découverte heureuse par hasard', 'Prévision', 'Planification'], correctIndex: 1, difficulty: 'expert' },
  { word: 'thuriféraire', type: 'definition', question: 'Que signifie "thuriféraire" ?', options: ['Critique', 'Flatteur excessif', 'Opposant', 'Juge'], correctIndex: 1, difficulty: 'expert' },
];
