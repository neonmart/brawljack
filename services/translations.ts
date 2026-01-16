export type Language = 'es' | 'en' | 'zh' | 'pt' | 'fr' | 'de';

export const TRANSLATIONS = {
  es: {
    // Menu
    title: "BRAWLJACK",
    play: "JUGAR",
    menu: "MENÚ",
    orientationTitle: "GIRA EL DISPOSITIVO",
    orientationDesc: "Brawljack está optimizado para jugarse en modo vertical.",
    
    // HUD & UI
    round: "Ronda",
    waiting: "ESPERANDO...",
    player: "JUGADOR",
    ai: "IA",
    limit: "Límite",
    hp: "HP",
    battleLog: "REGISTRO DE BATALLA",
    
    // Actions
    hit: "PEDIR",
    stand: "PLANTARSE",
    surrender: "RENDIRSE",
    confirm: "CONFIRMAR",
    pass: "PASAR",
    use: "USAR",
    understood: "ENTENDIDO",
    cancel: "Cancelar",
    
    // Game Status / Floats
    tie: "¡ EMPATE !",
    playerLose: "PIERDE",
    dealerLose: "PIERDE",
    stands: "SE PLANTA",
    brawljack: "Brawljack!",
    poisoned: "¡ENVENENADO!",
    damage: "DAÑO",
    
    // Logs & Notifications
    shuffling: "Barajando las barajas de cada jugador...",
    poisonDamagePlayer: "Veneno daña al Jugador",
    poisonDamageRival: "Veneno daña al Rival",
    rivalFound: "Rival encontró",
    rivalSwapped: "Rival cambió",
    rivalUsed: "Rival usó",
    youUsed: "Tú usaste",
    playerUsed: "El Jugador usó", // Feedback
    rivalUsedItem: "El Rival usó", // Feedback
    bustWarning: "¡TE PASASTE! Usa un objeto o pierde.",
    rivalBack: "¡El Rival vuelve al juego!",
    youBack: "¡Vuelves al juego!",
    stole: "Robaste",
    stolenFromYou: "Te robaron",
    
    // Modals & Screens
    rewardTitle: "RECOMPENSA",
    rewardDesc: "Elige un objeto para la siguiente ronda",
    inventoryFull: "Inventario lleno. Elige qué descartar:",
    backpackTitle: "MOCHILA",
    backpackEmpty: "Tu mochila está vacía.",
    capacity: "Capacidad",
    
    // Game Over
    victory: "¡VICTORIA!",
    defeat: "DERROTA",
    playAgain: "JUGAR DE NUEVO",
    finalScore: "Puntuación Final",
    
    // Specific Item Modals
    viewingDeck: "Futuro de tu Baraja",
    spying: "Espiando la Baraja Rival",
    val: "Val",
    configRules: "CONFIGURAR REGLAS",
    yourLimit: "Tu Límite",
    rivalLimit: "Límite Rival",
    chooseDestiny: "ELIGE TU DESTINO",
    currentScore: "Tu puntuación actual",
  },
  en: {
    // Menu
    title: "BRAWLJACK",
    play: "PLAY",
    menu: "MENU",
    orientationTitle: "ROTATE DEVICE",
    orientationDesc: "Brawljack is optimized for portrait mode.",

    // HUD & UI
    round: "Round",
    waiting: "WAITING...",
    player: "PLAYER",
    ai: "AI",
    limit: "Limit",
    hp: "HP",
    battleLog: "BATTLE LOGS",
    
    // Actions
    hit: "HIT",
    stand: "STAND",
    surrender: "SURRENDER",
    confirm: "CONFIRM",
    pass: "PASS",
    use: "USE",
    understood: "GOT IT",
    cancel: "Cancel",
    
    // Game Status / Floats
    tie: "¡ TIE !",
    playerLose: "LOSE",
    dealerLose: "LOSE",
    stands: "STANDS",
    brawljack: "Brawljack!",
    poisoned: "POISONED!",
    damage: "DAMAGE",
    
    // Logs & Notifications
    shuffling: "Shuffling both decks...",
    poisonDamagePlayer: "Poison damages Player",
    poisonDamageRival: "Poison damages Rival",
    rivalFound: "Rival found",
    rivalSwapped: "Rival swapped",
    rivalUsed: "Rival used",
    youUsed: "You used",
    playerUsed: "Player used",
    rivalUsedItem: "Rival used",
    bustWarning: "BUST! Use an item or lose.",
    rivalBack: "Rival is back in the game!",
    youBack: "You are back in the game!",
    stole: "You stole",
    stolenFromYou: "Stolen from you",
    
    // Modals & Screens
    rewardTitle: "REWARD",
    rewardDesc: "Choose an item for the next round",
    inventoryFull: "Inventory full. Choose item to discard:",
    backpackTitle: "BACKPACK",
    backpackEmpty: "Your backpack is empty.",
    capacity: "Capacity",
    
    // Game Over
    victory: "VICTORY!",
    defeat: "DEFEAT",
    playAgain: "PLAY AGAIN",
    finalScore: "Final Score",
    
    // Specific Item Modals
    viewingDeck: "Future of your Deck",
    spying: "Spying on Rival's Deck",
    val: "Val",
    configRules: "CONFIGURE RULES",
    yourLimit: "Your Limit",
    rivalLimit: "Rival Limit",
    chooseDestiny: "CHOOSE YOUR DESTINY",
    currentScore: "Your current score",
  },
  zh: {
    // Menu
    title: "BRAWLJACK",
    play: "开始游戏",
    menu: "菜单",
    orientationTitle: "旋转设备",
    orientationDesc: "Brawljack 专为竖屏模式优化。",

    // HUD & UI
    round: "回合",
    waiting: "等待中...",
    player: "玩家",
    ai: "电脑",
    limit: "上限",
    hp: "生命",
    battleLog: "战斗日志",
    
    // Actions
    hit: "要牌",
    stand: "停牌",
    surrender: "投降",
    confirm: "确认",
    pass: "跳过",
    use: "使用",
    understood: "明白了",
    cancel: "取消",
    
    // Game Status / Floats
    tie: "¡ 平局 !",
    playerLose: "失败",
    dealerLose: "失败",
    stands: "停牌",
    brawljack: "Brawljack!",
    poisoned: "中毒！",
    damage: "伤害",
    
    // Logs & Notifications
    shuffling: "正在洗牌...",
    poisonDamagePlayer: "毒药伤害玩家",
    poisonDamageRival: "毒药伤害对手",
    rivalFound: "对手找到了",
    rivalSwapped: "对手交换了",
    rivalUsed: "对手使用了",
    youUsed: "你使用了",
    playerUsed: "玩家使用了", // Feedback
    rivalUsedItem: "对手使用了", // Feedback
    bustWarning: "爆牌！使用物品或输掉。",
    rivalBack: "对手回到了游戏中！",
    youBack: "你回到了游戏中！",
    stole: "你偷取了",
    stolenFromYou: "被偷走了",
    
    // Modals & Screens
    rewardTitle: "奖励",
    rewardDesc: "为下一轮选择一个物品",
    inventoryFull: "背包已满。选择要丢弃的物品：",
    backpackTitle: "背包",
    backpackEmpty: "你的背包是空的。",
    capacity: "容量",
    
    // Game Over
    victory: "胜利！",
    defeat: "失败",
    playAgain: "再玩一次",
    finalScore: "最终得分",
    
    // Specific Item Modals
    viewingDeck: "预知未来",
    spying: "窥探对手牌组",
    val: "点数",
    configRules: "配置规则",
    yourLimit: "你的上限",
    rivalLimit: "对手上限",
    chooseDestiny: "选择命运",
    currentScore: "当前分数",
  },
  pt: {
    // Menu
    title: "BRAWLJACK",
    play: "JOGAR",
    menu: "MENU",
    orientationTitle: "GIRAR DISPOSITIVO",
    orientationDesc: "Brawljack é otimizado para o modo retrato.",

    // HUD & UI
    round: "Ronda",
    waiting: "AGUARDANDO...",
    player: "JOGADOR",
    ai: "IA",
    limit: "Limite",
    hp: "Vida",
    battleLog: "REGISTRO DE BATALHA",
    
    // Actions
    hit: "PEDIR",
    stand: "MANTER",
    surrender: "RENDER-SE",
    confirm: "CONFIRMAR",
    pass: "PASSAR",
    use: "USAR",
    understood: "ENTENDI",
    cancel: "Cancelar",
    
    // Game Status / Floats
    tie: "¡ EMPATE !",
    playerLose: "PERDEU",
    dealerLose: "PERDEU",
    stands: "MANTEVE",
    brawljack: "Brawljack!",
    poisoned: "ENVENENADO!",
    damage: "DANO",
    
    // Logs & Notifications
    shuffling: "Embaralhando...",
    poisonDamagePlayer: "Veneno fere o Jogador",
    poisonDamageRival: "Veneno fere o Rival",
    rivalFound: "Rival encontrou",
    rivalSwapped: "Rival trocou",
    rivalUsed: "Rival usou",
    youUsed: "Você usou",
    playerUsed: "Jogador usou",
    rivalUsedItem: "Rival usou",
    bustWarning: "ESTOUROU! Use um item ou perca.",
    rivalBack: "Rival voltou ao jogo!",
    youBack: "Você voltou ao jogo!",
    stole: "Você roubou",
    stolenFromYou: "Roubaram de você",
    
    // Modals & Screens
    rewardTitle: "RECOMPENSA",
    rewardDesc: "Escolha um item para a próxima rodada",
    inventoryFull: "Inventário cheio. Escolha algo para descartar:",
    backpackTitle: "MOCHILA",
    backpackEmpty: "Sua mochila está vazia.",
    capacity: "Capacidade",
    
    // Game Over
    victory: "VITÓRIA!",
    defeat: "DERROTA",
    playAgain: "JOGAR NOVAMENTE",
    finalScore: "Placar Final",
    
    // Specific Item Modals
    viewingDeck: "Futuro do Baralho",
    spying: "Espiando o Baralho Rival",
    val: "Val",
    configRules: "CONFIGURAR REGRAS",
    yourLimit: "Seu Limite",
    rivalLimit: "Limite Rival",
    chooseDestiny: "ESCOLHA SEU DESTINO",
    currentScore: "Sua pontuação atual",
  },
  fr: {
    // Menu
    title: "BRAWLJACK",
    play: "JOUER",
    menu: "MENU",
    orientationTitle: "PIVOTER L'APPAREIL",
    orientationDesc: "Brawljack est optimisé pour le mode portrait.",

    // HUD & UI
    round: "Manche",
    waiting: "EN ATTENTE...",
    player: "JOUEUR",
    ai: "IA",
    limit: "Limite",
    hp: "PV",
    battleLog: "JOURNAL DE COMBAT",
    
    // Actions
    hit: "TIRER",
    stand: "RESTER",
    surrender: "ABANDONNER",
    confirm: "CONFIRMER",
    pass: "PASSER",
    use: "UTILISER",
    understood: "COMPRIS",
    cancel: "Annuler",
    
    // Game Status / Floats
    tie: "¡ ÉGALITÉ !",
    playerLose: "PERDU",
    dealerLose: "PERDU",
    stands: "RESTE",
    brawljack: "Brawljack!",
    poisoned: "EMPOISONNÉ!",
    damage: "DÉGÂTS",
    
    // Logs & Notifications
    shuffling: "Mélange des cartes...",
    poisonDamagePlayer: "Le poison blesse le Joueur",
    poisonDamageRival: "Le poison blesse le Rival",
    rivalFound: "Rival a trouvé",
    rivalSwapped: "Rival a échangé",
    rivalUsed: "Rival a utilisé",
    youUsed: "Vous avez utilisé",
    playerUsed: "Le Joueur a utilisé",
    rivalUsedItem: "Le Rival a utilisé",
    bustWarning: "SAUTÉ! Utilisez un objet ou perdez.",
    rivalBack: "Le Rival est de retour !",
    youBack: "Vous êtes de retour !",
    stole: "Vous avez volé",
    stolenFromYou: "Volé",
    
    // Modals & Screens
    rewardTitle: "RÉCOMPENSE",
    rewardDesc: "Choisissez un objet pour la prochaine manche",
    inventoryFull: "Inventaire plein. Choisissez quoi jeter :",
    backpackTitle: "SAC À DOS",
    backpackEmpty: "Votre sac est vide.",
    capacity: "Capacité",
    
    // Game Over
    victory: "VICTOIRE !",
    defeat: "DÉFAITE",
    playAgain: "REJOUER",
    finalScore: "Score Final",
    
    // Specific Item Modals
    viewingDeck: "Avenir du Deck",
    spying: "Espionnage du Deck Rival",
    val: "Val",
    configRules: "CONFIGURER RÈGLES",
    yourLimit: "Votre Limite",
    rivalLimit: "Limite Rival",
    chooseDestiny: "CHOISISSEZ VOTRE DESTIN",
    currentScore: "Votre score actuel",
  },
  de: {
    // Menu
    title: "BRAWLJACK",
    play: "SPIELEN",
    menu: "MENÜ",
    orientationTitle: "GERÄT DREHEN",
    orientationDesc: "Brawljack ist für den Hochformat-Modus optimiert.",

    // HUD & UI
    round: "Runde",
    waiting: "WARTEN...",
    player: "SPIELER",
    ai: "KI",
    limit: "Limit",
    hp: "LP",
    battleLog: "KAMPFPROTOKOLL",
    
    // Actions
    hit: "KARTE",
    stand: "BLEIBEN",
    surrender: "AUFGEBEN",
    confirm: "BESTÄTIGEN",
    pass: "PASSEN",
    use: "BENUTZEN",
    understood: "VERSTANDEN",
    cancel: "Abbrechen",
    
    // Game Status / Floats
    tie: "¡ UNENTSCHIEDEN !",
    playerLose: "VERLOREN",
    dealerLose: "VERLOREN",
    stands: "BLEIBT",
    brawljack: "Brawljack!",
    poisoned: "VERGIFTET!",
    damage: "SCHADEN",
    
    // Logs & Notifications
    shuffling: "Karten werden gemischt...",
    poisonDamagePlayer: "Gift schadet dem Spieler",
    poisonDamageRival: "Gift schadet dem Rivalen",
    rivalFound: "Rival hat gefunden",
    rivalSwapped: "Rival hat getauscht",
    rivalUsed: "Rival hat benutzt",
    youUsed: "Du hast benutzt",
    playerUsed: "Spieler hat benutzt",
    rivalUsedItem: "Rival hat benutzt",
    bustWarning: "ÜBERKAUFT! Nutze Item oder verliere.",
    rivalBack: "Rival ist zurück im Spiel!",
    youBack: "Du bist zurück im Spiel!",
    stole: "Du hast gestohlen",
    stolenFromYou: "Von dir gestohlen",
    
    // Modals & Screens
    rewardTitle: "BELOHNUNG",
    rewardDesc: "Wähle ein Item für die nächste Runde",
    inventoryFull: "Inventar voll. Wähle Abwurf:",
    backpackTitle: "RUCKSACK",
    backpackEmpty: "Dein Rucksack ist leer.",
    capacity: "Kapazität",
    
    // Game Over
    victory: "SIEG!",
    defeat: "NIEDERLAGE",
    playAgain: "NEU SPIELEN",
    finalScore: "Endstand",
    
    // Specific Item Modals
    viewingDeck: "Zukunft des Decks",
    spying: "Rivalen-Deck ausspionieren",
    val: "Wert",
    configRules: "REGELN KONFIGURIEREN",
    yourLimit: "Dein Limit",
    rivalLimit: "Rivalen Limit",
    chooseDestiny: "WÄHLE DEIN SCHICKSAL",
    currentScore: "Dein aktueller Punktestand",
  }
};