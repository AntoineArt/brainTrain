import type fr from './fr';

const en: { [K in keyof typeof fr]: string } = {
  // Navigation
  'nav.home': 'Home',
  'nav.games': 'Games',
  'nav.stats': 'Stats',

  // Home page
  'home.greeting': 'Hello!',
  'home.subtitle': 'Ready to train your brain?',
  'home.chooseGame': 'Choose a game',
  'home.miniGames': '14 mini-games',
  'home.chainMode': 'Chain Mode',
  'home.randomGames': 'Random games',
  'home.yourSkills': 'Your skills',
  'home.popularGames': 'Popular games',
  'home.recentActivity': 'Recent activity',

  // Games page
  'games.title': 'Mini-games',
  'games.chainMode': 'Chain Mode',
  'games.chainDescription': 'Chain random mini-games together!',

  // Chain mode
  'chain.title': 'Chain Mode',
  'chain.description': 'Mini-games chain randomly. Stop whenever you want!',
  'chain.start': "Let's go!",
  'chain.backToGames': 'Back to games',
  'chain.sessionFinished': 'Session finished!',
  'chain.gameCount_one': '{count} game played',
  'chain.gameCount_other': '{count} games played',
  'chain.gameNumber': 'Game {number}',
  'chain.stop': 'Stop',
  'chain.endSession': 'End session',
  'chain.nextGame': 'Next game',
  'chain.totalScore': 'Total score: {score}',
  'chain.quit': 'Quit',
  'chain.replay': 'Replay',

  // Results / Statistics page
  'results.title': 'Statistics',
  'results.games': 'Games',
  'results.totalScore': 'Total score',
  'results.accuracy': 'Accuracy',
  'results.history': 'History',
  'results.noGames': "No games played yet. Let's start!",

  // Difficulty levels
  'difficulty.label': 'Difficulty',
  'difficulty.1': 'Easy',
  'difficulty.2': 'Medium',
  'difficulty.3': 'Hard',
  'difficulty.4': 'Expert',
  'difficulty.5': 'Master',

  // Game common
  'game.play': 'Play',
  'game.validate': 'Validate',
  'game.correct': 'Correct!',
  'game.wrong': 'Wrong!',
  'game.comingSoon': 'This game is coming soon!',
  'game.quit': 'Quit',
  'game.replay': 'Replay',
  'game.finished': 'Finished!',
  'game.points': 'points',
  'game.answers': 'Answers',
  'game.bestStreak': 'Best streak',
  'game.inputPlaceholder': 'Type your answer…',

  // Game names
  'game.speedMath.name': 'Speed Math',
  'game.speedMath.description': 'Solve operations as fast as you can!',
  'game.memorySequence.name': 'Memory Sequence',
  'game.memorySequence.description': 'Reproduce the sequence of lit cells.',
  'game.findIntruder.name': 'Find the Intruder',
  'game.findIntruder.description': "Find the element that doesn't belong in the grid.",
  'game.reflex.name': 'Reflex',
  'game.reflex.description': 'Test your reaction speed!',
  'game.logicPlus.name': 'Logic+',
  'game.logicPlus.description': 'Complete the logic sequences.',
  'game.rightWord.name': 'Right Word',
  'game.rightWord.description': 'Find the right word: synonyms, antonyms, definitions.',
  'game.rotation.name': 'Rotation',
  'game.rotation.description': 'Identify the correct rotation of the shape.',
  'game.searchCount.name': 'Search & Count',
  'game.searchCount.description': 'Count target elements among distractors.',
  'game.pairs.name': 'Pairs',
  'game.pairs.description': 'Find the matching card pairs.',
  'game.quickSort.name': 'Quick Sort',
  'game.quickSort.description': 'Put elements in the correct order.',
  'game.trivia.name': 'Trivia',
  'game.trivia.description': 'Test your general knowledge on many topics!',
  'game.wordDefinition.name': 'Word Finder',
  'game.wordDefinition.description': 'Find the word from its definition!',

  // Skills
  'skill.math': 'Math',
  'skill.memory': 'Memory',
  'skill.logic': 'Logic',
  'skill.speed': 'Speed',
  'skill.language': 'Language',
  'skill.attention': 'Attention',
  'skill.culture': 'Trivia',

  // Trivia categories
  'category.history': 'History',
  'category.geography': 'Geography',
  'category.science': 'Science',
  'category.art': 'Art & Literature',
  'category.sport': 'Sport',
  'category.cinema': 'Cinema & Series',
  'category.music': 'Music',
  'category.nature': 'Nature & Animals',
  'category.gastronomy': 'Gastronomy',
  'category.technology': 'Technology',
  'category.mythology': 'Mythology',
  'category.languages': 'Languages & Expressions',

  // Memory Sequence game
  'memorySequence.memorize': 'Memorize the sequence...',
  'memorySequence.reproduce': 'Reproduce ({count}/{total})',
  'memorySequence.bravo': 'Well done!',
  'memorySequence.length': 'Length: {length}',

  // Find Intruder game
  'findIntruder.instruction': 'Find the intruder!',

  // Reflex game
  'reflex.round': 'Round {current}/{total}',
  'reflex.instruction': 'Tap green, ignore red',
  'reflex.pause': 'Paused',
  'reflex.wait': 'Wait...',
  'reflex.go': 'TAP!',
  'reflex.noGo': "DON'T TAP",
  'reflex.tooEarly': 'Too early!',
  'reflex.good': 'Good!',

  // Logic Plus game
  'logicPlus.question': 'What number comes next?',

  // Rotation game
  'rotation.question': 'What is the rotation of this shape?',
  'rotation.label': 'Rotation: {angle}°',

  // Search & Count game
  'searchCount.question': 'How many {target}?',

  // Pairs game
  'pairs.found': 'Pairs found: {found}/{total}',

  // Quick Sort game
  'quickSort.instruction': 'Tap elements in order',
  'quickSort.undo': 'Undo last',
  'quickSort.chronological': 'Chronological order',
  'quickSort.reverseChronological': 'Reverse month order',
  'quickSort.ascending': 'Ascending order',
  'quickSort.descending': 'Descending order',

  // Word Definition game
  'wordDefinition.letters': '{count} letters',
  'wordDefinition.hint': 'Hint',
  'wordDefinition.hintCount': 'Hint ({count})',
  'wordDefinition.wordWas': 'The word was:',

  // Number Chain game
  'game.numberChain.name': 'Number Chain',
  'game.numberChain.description': 'Follow the operations and find the final result!',
  'numberChain.start': 'Start',
  'numberChain.step': 'Step {current}/{total}',
  'numberChain.whatIsResult': 'What is the result?',

  // Estimation game
  'game.estimation.name': 'Estimation',
  'game.estimation.description': 'Estimate quantities as precisely as you can!',
  'estimation.howMany': 'How many dots?',
  'estimation.whatPercentage': 'What percentage?',
  'estimation.whatResult': 'What result (approximately)?',
  'estimation.estimate': 'Give your estimate',
  'estimation.close': 'Close!',
  'estimation.actual': 'Answer',
  'estimation.error': 'Error',

  // Months
  'month.1': 'January',
  'month.2': 'February',
  'month.3': 'March',
  'month.4': 'April',
  'month.5': 'May',
  'month.6': 'June',
  'month.7': 'July',
  'month.8': 'August',
  'month.9': 'September',
  'month.10': 'October',
  'month.11': 'November',
  'month.12': 'December',

  // Settings / Language
  'settings.language': 'Language',
  'locale.switchTo': 'Passer en français',
  'game.back': 'Back',

  // Multiplayer
  'nav.multiplayer': 'Multi',
  'multi.title': 'Multiplayer',
  'multi.subtitle': 'Play with friends in real time!',
  'multi.createLobby': 'Create Lobby',
  'multi.createDescription': 'Start a game and invite your friends',
  'multi.joinLobby': 'Join Lobby',
  'multi.joinDescription': 'Join a game with a code',
  'multi.yourName': 'Your name',
  'multi.namePlaceholder': 'Enter your name...',
  'multi.continue': 'Continue',
  'multi.enterCode': 'Lobby code',
  'multi.join': 'Join',
  'multi.joinError': 'Could not join',
  'multi.lobby': 'Lobby',
  'multi.copyCode': 'Copy code',
  'multi.shareCode': 'Share this code with your friends',
  'multi.players': 'Players',
  'multi.you': 'you',
  'multi.host': 'Host',
  'multi.kick': 'Kick',
  'multi.chooseGame': 'Choose a game',
  'multi.selectGameFirst': 'Select a game',
  'multi.waitingPlayers': 'Waiting for players...',
  'multi.startGame': 'Start game!',
  'multi.gameStarting': 'Game starting...',
  'multi.waitingHost': 'Waiting for host...',
  'multi.leaveLobby': 'Leave lobby',
  'multi.loading': 'Loading...',
  'multi.lobbyNotFound': 'Lobby not found',
  'multi.backToHub': 'Back',
  'multi.leaderboard': 'Leaderboard',
  'multi.leave': 'Leave',
  'multi.playAgain': 'Play Again',
  'multi.changeName': 'Change name',
} as const;

export default en;
