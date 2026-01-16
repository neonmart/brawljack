import React, { useState, useEffect, useRef } from 'react';
import { Card, GameStatus, ScoreState, Winner, InventoryItem, ItemType, Suit } from './types';
import { createDeck, shuffleDeck, calculateScore } from './services/deckService';
import { generateLootOptions, ITEMS } from './services/itemService';
import { TRANSLATIONS, Language } from './services/translations';
import PlayingCard from './components/PlayingCard';
import Button from './components/Button';
import { Trophy, Heart, Skull, Swords, ScrollText, AlertTriangle, Package, X, Bot, User, Settings, ShieldAlert, Eye, Target, Zap, Backpack, Biohazard, Bomb, Home } from 'lucide-react';

const INITIAL_HP = 40;
const MAX_INVENTORY = 3;
const MAX_ROUNDS = 20;

// Static configuration for bubble particles to ensure consistent rendering
const POISON_BUBBLES = [
    { left: '10%', size: '15px', delay: '0ms' },
    { left: '30%', size: '25px', delay: '200ms' },
    { left: '50%', size: '10px', delay: '500ms' },
    { left: '70%', size: '20px', delay: '100ms' },
    { left: '90%', size: '18px', delay: '300ms' },
    { left: '20%', size: '12px', delay: '400ms' },
    { left: '60%', size: '22px', delay: '600ms' },
    { left: '40%', size: '16px', delay: '800ms' },
    { left: '80%', size: '24px', delay: '150ms' },
];

const DECORATIVE_CARDS: Card[] = [
    { suit: Suit.Spades, rank: 'A', value: 11 },
    { suit: Suit.Hearts, rank: 'A', value: 11 },
    { suit: Suit.Clubs, rank: 'A', value: 11 },
    { suit: Suit.Diamonds, rank: 'A', value: 11 },
];

const App: React.FC = () => {
  // Language State
  const [language, setLanguage] = useState<Language>('es');
  
  // Decks state
  const [playerDeck, setPlayerDeck] = useState<Card[]>([]);
  const [dealerDeck, setDealerDeck] = useState<Card[]>([]);
  
  // Game State
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.Idle);
  const [winner, setWinner] = useState<Winner>(Winner.None);
  const [lastDamage, setLastDamage] = useState<number>(0);
  
  // Custom Limits
  const [playerScoreLimit, setPlayerScoreLimit] = useState(21);
  const [dealerScoreLimit, setDealerScoreLimit] = useState(21);
  
  // Status Effects
  const [playerPoisonStacks, setPlayerPoisonStacks] = useState(0);
  const [dealerPoisonStacks, setDealerPoisonStacks] = useState(0);
  const [playerPoisonFlash, setPlayerPoisonFlash] = useState(false);
  const [dealerPoisonFlash, setDealerPoisonFlash] = useState(false);

  // Turn Logic States
  const [playerStood, setPlayerStood] = useState(false);
  const [dealerStood, setDealerStood] = useState(false);

  // Flash States
  const [playerStandFlash, setPlayerStandFlash] = useState(false);
  const [dealerStandFlash, setDealerStandFlash] = useState(false);
  const [playerLimitFlash, setPlayerLimitFlash] = useState(false);
  const [dealerLimitFlash, setDealerLimitFlash] = useState(false);
  const [playerDamageFlash, setPlayerDamageFlash] = useState(false);
  const [dealerDamageFlash, setDealerDamageFlash] = useState(false);
  const [playerHealFlash, setPlayerHealFlash] = useState(false);
  const [dealerHealFlash, setDealerHealFlash] = useState(false);
  
  // New State for Explosion Text
  const [recentDamage, setRecentDamage] = useState<{player: number | null, dealer: number | null}>({player: null, dealer: null});
  
  // End Game Message States
  const [showTieMessage, setShowTieMessage] = useState(false);
  const [showPlayerLoseMessage, setShowPlayerLoseMessage] = useState(false);
  const [showDealerLoseMessage, setShowDealerLoseMessage] = useState(false);
  
  // Visual FX
  const [slashTarget, setSlashTarget] = useState<'player' | 'dealer' | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  
  const [actionFeedback, setActionFeedback] = useState<{
      player: { text: string, icon: string } | null, 
      dealer: { text: string, icon: string } | null
  }>({player: null, dealer: null});
  
  const [isSwapping, setIsSwapping] = useState(false);

  // UI State
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [showLog, setShowLog] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState<boolean>(false);
  
  // Inventory & Modifiers
  const [playerInventory, setPlayerInventory] = useState<InventoryItem[]>([]);
  const [dealerInventory, setDealerInventory] = useState<InventoryItem[]>([]);
  const [lootOptions, setLootOptions] = useState<InventoryItem[]>([]);
  // Split modifiers to track individually
  const [playerScoreModifier, setPlayerScoreModifier] = useState<number>(0);
  const [dealerScoreModifier, setDealerScoreModifier] = useState<number>(0);
  
  // Special UI States
  const [selectedLootId, setSelectedLootId] = useState<string | null>(null);
  const [selectedSwapIndex, setSelectedSwapIndex] = useState<number | null>(null);
  const [randomChoices, setRandomChoices] = useState<Card[]>([]);

  const [scores, setScores] = useState<ScoreState>({
    playerHp: INITIAL_HP,
    dealerHp: INITIAL_HP,
    roundsPlayed: 0
  });

  const playerDeckRef = useRef<Card[]>([]);
  const dealerDeckRef = useRef<Card[]>([]);
  const playerHandRef = useRef<Card[]>([]);
  const dealerHandRef = useRef<Card[]>([]);
  const languageRef = useRef<Language>('es');

  // Translation Helper
  const t = TRANSLATIONS[language];

  useEffect(() => { playerHandRef.current = playerHand; }, [playerHand]);
  useEffect(() => { dealerHandRef.current = dealerHand; }, [dealerHand]);
  useEffect(() => { playerDeckRef.current = playerDeck; }, [playerDeck]);
  useEffect(() => { dealerDeckRef.current = dealerDeck; }, [dealerDeck]);
  useEffect(() => { languageRef.current = language; }, [language]);

  const addLog = (message: string) => {
    setGameLog(prev => [`[${new Date().toLocaleTimeString([], { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })}] ${message}`, ...prev]);
  };

  const showActionFeedback = (actor: 'player' | 'dealer', itemName: string, itemIcon: string) => {
      // Use current translations
      const currentT = TRANSLATIONS[languageRef.current];
      const actorName = actor === 'player' ? currentT.playerUsed : currentT.rivalUsedItem;
      setActionFeedback(prev => ({...prev, [actor]: { text: `${actorName} ${itemName}`, icon: itemIcon }}));
      setTimeout(() => {
          setActionFeedback(prev => ({...prev, [actor]: null}));
      }, 2500);
  };

  const applyPoison = (): boolean => {
    let pDmg = playerPoisonStacks;
    let dDmg = dealerPoisonStacks;
    let gameOverTriggered = false;
    const currentT = TRANSLATIONS[languageRef.current];
    
    if (pDmg > 0) {
      setPlayerPoisonFlash(true);
      addLog(`${currentT.poisonDamagePlayer}: -${pDmg}`);
      setTimeout(() => setPlayerPoisonFlash(false), 2000);
    }
    
    if (dDmg > 0) {
      setDealerPoisonFlash(true);
      addLog(`${currentT.poisonDamageRival}: -${dDmg}`);
      setTimeout(() => setDealerPoisonFlash(false), 2000);
    }
    
    if (pDmg > 0 || dDmg > 0) {
      const nextPlayerHp = Math.max(0, scores.playerHp - pDmg);
      const nextDealerHp = Math.max(0, scores.dealerHp - dDmg);

      setScores(prev => ({ ...prev, playerHp: nextPlayerHp, dealerHp: nextDealerHp }));

      if (nextPlayerHp === 0 || nextDealerHp === 0) {
         setWinner(nextPlayerHp === 0 ? Winner.Dealer : Winner.Player);
         setStatus(GameStatus.GameOver);
         gameOverTriggered = true;
      }
    }
    return gameOverTriggered;
  };

  const dealRound = (ignorePoison: boolean = false, overrideRoundNum?: number) => {
    // If ignorePoison is true (new game start), skip the check.
    // Otherwise, check for poison damage.
    if (!ignorePoison && applyPoison()) return;
    const currentT = TRANSLATIONS[languageRef.current];

    // Reshuffle BOTH decks every round as requested
    const newPlayerDeck = shuffleDeck(createDeck());
    const newDealerDeck = shuffleDeck(createDeck());
    addLog(currentT.shuffling);

    const pCard1 = newPlayerDeck.pop()!;
    const dCard1 = newDealerDeck.pop()!;
    const pCard2 = newPlayerDeck.pop()!;
    const dCard2 = newDealerDeck.pop()!; 

    setPlayerHand([pCard1, pCard2]);
    setDealerHand([dCard1, dCard2]);
    
    playerDeckRef.current = newPlayerDeck;
    dealerDeckRef.current = newDealerDeck;
    setPlayerDeck(newPlayerDeck);
    setDealerDeck(newDealerDeck);
    
    setWinner(Winner.None);
    setLastDamage(0);
    setPlayerScoreModifier(0);
    setDealerScoreModifier(0);
    setPlayerStandFlash(false);
    setDealerStandFlash(false);
    setRecentDamage({player: null, dealer: null});
    
    // Reset Round Messages
    setShowTieMessage(false);
    setShowPlayerLoseMessage(false);
    setShowDealerLoseMessage(false);
    
    setPlayerStood(false);
    setDealerStood(false);
    
    // Use override if provided (mostly for round 1 where state isn't flushed yet), else use state
    const roundNum = overrideRoundNum !== undefined ? overrideRoundNum : (scores.roundsPlayed + 1);
    addLog(`--- ${currentT.round} ${roundNum} ---`);
    setStatus(GameStatus.PlayerTurn);
  };

  const startGame = () => {
    setScores({ playerHp: INITIAL_HP, dealerHp: INITIAL_HP, roundsPlayed: 0 });
    setPlayerInventory([]);
    setDealerInventory([]);
    setGameLog([]);
    setPlayerPoisonStacks(0);
    setDealerPoisonStacks(0);
    setPlayerScoreLimit(21);
    setDealerScoreLimit(21);
    // Call dealRound with ignorePoison = true to prevent stale state from triggering poison death on restart
    // Pass 1 explicitly because scores.roundsPlayed is still old state value in this tick
    dealRound(true, 1);
  };

  const processAiLoot = () => {
    setDealerInventory(prev => {
        let newInv = [...prev];
        const currentT = TRANSLATIONS[languageRef.current];
        // Remove Thief from banned items so AI can get it
        const bannedItems = [ItemType.SeeNext3, ItemType.Spy];
        // Items limited to 1 copy for opponent
        const uniqueLimitItems = [ItemType.ScoreModifier, ItemType.ChoiceCard, ItemType.ScoreBoost, ItemType.HandSwap];

        // Filter options to exclude banned items - Pass current language
        let options = generateLootOptions(3, dealerPoisonStacks > 0, languageRef.current).filter(i => !bannedItems.includes(i.type));
        
        // --- NEW LOGIC: Probability Modifications ---

        // A. 50% chance for Thief if Player has big potions
        // Check by type is safer than name across languages
        const playerHasBigPotion = playerInventory.some(i => i.type === ItemType.Heal && (i.value === 50 || i.value === 10));
        if (playerHasBigPotion && Math.random() < 0.50) {
             const tempOptions = generateLootOptions(1, false, languageRef.current); // Generate a temp to find thief
             // Need to specifically find thief type in options or predefined
             // Re-generating until we get one is inefficient, let's just use the itemService template logic implicitly
             // Actually, simplest way is to fetch a full list or filter options
             const thiefItem = options.find(i => i.type === ItemType.Thief) || generateLootOptions(20, false, languageRef.current).find(i => i.type === ItemType.Thief);
             if (thiefItem) {
                 options[0] = { ...thiefItem, id: `force-thief-${Date.now()}` };
             }
        }

        // B. 25% chance for Super Potion if Dealer HP <= 10
        if (scores.dealerHp <= 10 && Math.random() < 0.25) {
             const superPotionItem = options.find(i => i.type === ItemType.Heal && i.value === 50) || generateLootOptions(20, false, languageRef.current).find(i => i.type === ItemType.Heal && i.value === 50);
             if (superPotionItem) {
                 options[1] = { ...superPotionItem, id: `force-super-${Date.now()}` };
             }
        }
        
        // Filter options to enforce unique limit (runs after force logic to keep it valid)
        options = options.filter(opt => {
            if (uniqueLimitItems.includes(opt.type)) {
                return !newInv.some(i => i.type === opt.type);
            }
            return true;
        });
        
        if (options.length === 0) return newInv;

        // Specific Replaceable Targets for Potions
        const replaceableTypes = [ItemType.ScoreModifier, ItemType.ScoreBoost, ItemType.ChoiceCard, ItemType.HandSwap];
        // Items AI should basically always throw away if inventory is full and finding something else
        const lowPriorityTypes = [ItemType.ChoiceCard, ItemType.Spy, ItemType.SeeNext3];

        // 1. SUPER POTION LOGIC (100% Probability to take/replace)
        const superPotion = options.find(i => i.type === ItemType.Heal && i.value === 50);
        if (superPotion) {
            if (newInv.length < MAX_INVENTORY) {
                newInv.push(superPotion);
                addLog(`${currentT.rivalFound}: ${superPotion.name}`);
            } else {
                // If full, priority replace the specific "weak" items, else random
                let replaceIdx = newInv.findIndex(i => replaceableTypes.includes(i.type) || lowPriorityTypes.includes(i.type));
                if (replaceIdx === -1) replaceIdx = Math.floor(Math.random() * MAX_INVENTORY);
                
                addLog(`${currentT.rivalSwapped} ${newInv[replaceIdx].name} -> ${superPotion.name}`);
                newInv[replaceIdx] = superPotion;
            }
            return newInv;
        }

        // 2. REGULAR POTION LOGIC (50% Probability to replace specific items)
        const regularPotion = options.find(i => i.type === ItemType.Heal && (i.value === 5 || i.value === 10));
        if (regularPotion) {
             const targetIdx = newInv.findIndex(i => replaceableTypes.includes(i.type));
             // Only if we have a target AND roll 50%
             if (targetIdx !== -1 && Math.random() < 0.5) {
                 addLog(`${currentT.rivalSwapped} ${newInv[targetIdx].name} -> ${regularPotion.name}`);
                 newInv[targetIdx] = regularPotion;
                 return newInv;
             }
        }

        // 3. STANDARD LOGIC (Fill empty slots or default priority)
        // Basic AI heuristic for picking items
        const bestOption = options.sort((a, b) => b.weight - a.weight)[0]; 
        
        // Prioritize specific power items if available
        const priorityTypes = [ItemType.Heal, ItemType.ScoreModifier, ItemType.ScoreLimitChange, ItemType.Poison, ItemType.Antidote, ItemType.HandSwap, ItemType.Thief];
        const priorityItem = options.find(i => priorityTypes.includes(i.type));
        
        let candidate = priorityItem || bestOption;
        
        // Special logic for antidote if poisoned
        if (dealerPoisonStacks > 0) {
            const antidote = options.find(i => i.type === ItemType.Antidote);
            if (antidote) candidate = antidote;
        }

        if (candidate && newInv.length < MAX_INVENTORY) {
            newInv.push(candidate);
            addLog(`${currentT.rivalFound}: ${candidate.name}`);
        } else if (candidate) {
            // NEW LOGIC: Always replace "ChoiceCard", "Spy", or "SeeNext3" if present
            const lowPriorityIdx = newInv.findIndex(i => lowPriorityTypes.includes(i.type));
            if (lowPriorityIdx !== -1) {
                 addLog(`${currentT.rivalSwapped} ${newInv[lowPriorityIdx].name} -> ${candidate.name}`);
                 newInv[lowPriorityIdx] = candidate;
            } 
            // Otherwise, simple replacement logic for other items
            else if (priorityTypes.includes(candidate.type)) {
                 const replaceIdx = Math.floor(Math.random() * MAX_INVENTORY);
                 addLog(`${currentT.rivalSwapped} ${newInv[replaceIdx].name} -> ${candidate.name}`);
                 newInv[replaceIdx] = candidate;
            }
        }
        return newInv;
    });
  };

  const startNextRound = () => {
    if (scores.playerHp <= 0 || scores.dealerHp <= 0) {
      startGame();
      return;
    }
    processAiLoot();
    dealRound();
  };
  
  const discardLoot = () => {
      setLootOptions([]);
      setSelectedLootId(null);
      setSelectedSwapIndex(null);
      startNextRound();
  };

  const handleHit = () => {
    const currentT = TRANSLATIONS[languageRef.current];
    const currentDeck = [...playerDeckRef.current];
    if (currentDeck.length === 0) return;
    const newCard = currentDeck.pop()!;
    playerDeckRef.current = currentDeck;
    setPlayerDeck(currentDeck);
    const newHand = [...playerHand, newCard];
    setPlayerHand(newHand);

    const score = calculateScore(newHand) - playerScoreModifier;
    if (score > playerScoreLimit) {
      const hasModifier = playerInventory.some(i => i.type === ItemType.ScoreModifier);
      const hasThief = playerInventory.some(i => i.type === ItemType.Thief);
      if (hasModifier || hasThief) {
        setStatus(GameStatus.BustRecovery);
        addLog(currentT.bustWarning);
      } else {
        endRound(Winner.Dealer, newHand, dealerHand);
      }
    } else {
        setStatus(GameStatus.DealerTurn);
    }
  };

  const handleStand = () => {
    const score = calculateScore(playerHand) - playerScoreModifier;
    if (status === GameStatus.BustRecovery && score > playerScoreLimit) {
        endRound(Winner.Dealer, playerHand, dealerHand);
        return;
    }
    setPlayerStandFlash(true);
    setTimeout(() => setPlayerStandFlash(false), 1500);
    setPlayerStood(true);
    setStatus(GameStatus.DealerTurn);
  };

  const handleUseItem = async (item: InventoryItem, index: number, isPlayer: boolean) => {
    let used = false;
    const currentT = TRANSLATIONS[languageRef.current];
    const actor = isPlayer ? "Tú" : "Rival"; // Used in logs
    const actorLogName = isPlayer ? currentT.youUsed : currentT.rivalUsed;

    if (status === GameStatus.BustRecovery && item.type !== ItemType.ScoreModifier && item.type !== ItemType.Thief) return;

    switch (item.type) {
        case ItemType.Heal:
            setScores(prev => ({
                ...prev,
                playerHp: isPlayer ? Math.min(INITIAL_HP, prev.playerHp + item.value) : prev.playerHp,
                dealerHp: !isPlayer ? Math.min(INITIAL_HP, prev.dealerHp + item.value) : prev.dealerHp
            }));
            if (isPlayer) { setPlayerHealFlash(true); setTimeout(() => setPlayerHealFlash(false), 2000); } 
            else { setDealerHealFlash(true); setTimeout(() => setDealerHealFlash(false), 2000); }
            used = true;
            break;
        case ItemType.ScoreModifier:
            if (isPlayer) {
                setPlayerScoreModifier(prev => prev + item.value);
                if (status === GameStatus.BustRecovery && (calculateScore(playerHandRef.current) - (playerScoreModifier + item.value) <= playerScoreLimit)) {
                    setStatus(GameStatus.PlayerTurn);
                }
            } else {
                setDealerScoreModifier(prev => prev + item.value);
            }
            used = true;
            break;
        case ItemType.ScoreBoost:
            if (isPlayer) {
                setPlayerScoreModifier(prev => prev - item.value);
                // Do not stand automatically
            } else {
                setDealerScoreModifier(prev => prev - item.value);
                // Do not stand automatically
            }
            used = true; 
            break;
        case ItemType.Poison:
            if (isPlayer) { 
                setDealerPoisonStacks(prev => prev + item.value); 
                setDealerPoisonFlash(true); setTimeout(() => setDealerPoisonFlash(false), 2000);
            } 
            else { 
                setPlayerPoisonStacks(prev => prev + item.value); 
                setPlayerPoisonFlash(true); setTimeout(() => setPlayerPoisonFlash(false), 2000);
            }
            used = true;
            break;
        case ItemType.Antidote:
            if (isPlayer) setPlayerPoisonStacks(0); else setDealerPoisonStacks(0);
            used = true;
            break;
        case ItemType.ChoiceCard:
            if (isPlayer) {
                const choices = shuffleDeck(createDeck()).slice(0, 3);
                setRandomChoices(choices);
                setStatus(GameStatus.ChoosingRandomCard);
            } else {
                // AI Logic: Add a random card
                const newCard = shuffleDeck(createDeck()).pop()!;
                setDealerHand(prev => [...prev, newCard]);
            }
            used = true;
            break;
        case ItemType.Sabotage:
            if (isPlayer) { setDealerHand(prev => prev.slice(0, -1)); setSlashTarget('dealer'); } 
            else { setPlayerHand(prev => prev.slice(0, -1)); setSlashTarget('player'); }
            setTimeout(() => setSlashTarget(null), 600);
            used = true;
            break;
        case ItemType.HandSwap:
            setIsSwapping(true);
            await new Promise(r => setTimeout(r, 1500));
            const p = [...playerHandRef.current];
            const d = [...dealerHandRef.current];
            setPlayerHand(d); setDealerHand(p);
            
            // Allow opponent to play if they were forced to stand but now have a new hand
            if (isPlayer) {
                if (dealerStood) {
                    setDealerStood(false);
                    addLog(currentT.rivalBack);
                }
            } else {
                if (playerStood) {
                    setPlayerStood(false);
                    addLog(currentT.youBack);
                    if (status === GameStatus.DealerTurn) setStatus(GameStatus.PlayerTurn);
                }
            }
            
            setIsSwapping(false);
            used = true;
            break;
        case ItemType.SeeNext3:
            if (isPlayer) setStatus(GameStatus.ViewingDeck);
            used = true;
            break;
        case ItemType.Spy:
            if (isPlayer) setStatus(GameStatus.Spying);
            used = true;
            break;
        case ItemType.ScoreLimitChange:
            if (isPlayer) {
                setStatus(GameStatus.ConfiguringLimit);
            } else {
              // AI Logic: "lo usará y asignara a 20 tu puntuación máxima"
              setPlayerScoreLimit(20); 
              setPlayerLimitFlash(true);
              setTimeout(() => { setPlayerLimitFlash(false); }, 3000);
            }
            used = true;
            break;
        case ItemType.Thief:
             const oppInv = isPlayer ? dealerInventory : playerInventory;
             if (oppInv.length > 0) {
                 let targetIdx = -1;

                 if (!isPlayer) { // AI Logic
                     // 1. Priority: Super Potion (Heal + Value 50)
                     const superPotionIdx = oppInv.findIndex(i => i.type === ItemType.Heal && i.value === 50);
                     if (superPotionIdx !== -1) {
                         targetIdx = superPotionIdx;
                     } else {
                         // 2. Priority: Any Healing Item
                         const healIdx = oppInv.findIndex(i => i.type === ItemType.Heal);
                         if (healIdx !== -1) {
                             targetIdx = healIdx;
                         }
                     }
                 }

                 // 3. Priority: Random (Default for Player OR if AI found no specific target)
                 if (targetIdx === -1) {
                     targetIdx = Math.floor(Math.random() * oppInv.length);
                 }

                 const stolen = oppInv[targetIdx];
                 if (isPlayer) {
                     setDealerInventory(prev => prev.filter((_, i) => i !== targetIdx));
                     setPlayerInventory(prev => [...prev, stolen]);
                     setNotificationMessage(`${currentT.stole}: ${stolen.name}`);
                 } else {
                     setPlayerInventory(prev => prev.filter((_, i) => i !== targetIdx));
                     setDealerInventory(prev => [...prev, stolen]);
                     setNotificationMessage(`${currentT.stolenFromYou}: ${stolen.name}`);
                 }
                 setTimeout(() => setNotificationMessage(null), 3000);
             }
             used = true;
             break;
    }

    if (used) {
        addLog(`${actorLogName} ${item.name}.`);
        showActionFeedback(isPlayer ? 'player' : 'dealer', item.name, item.icon);
        if (isPlayer) {
          setPlayerInventory(prev => prev.filter(i => i.id !== item.id));
          if ([ItemType.ChoiceCard, ItemType.SeeNext3, ItemType.Spy, ItemType.ScoreLimitChange].includes(item.type)) {
              setShowInventory(false);
          }
        } else {
          setDealerInventory(prev => prev.filter(i => i.id !== item.id));
        }
    }
  };

  const handleChoiceCard = (card: Card) => {
    setPlayerHand(prev => [...prev, card]);
    setStatus(GameStatus.PlayerTurn);
    setRandomChoices([]);
  };

  const configureLimit = (target: 'player' | 'dealer', val: number) => {
      if (target === 'player') { setPlayerScoreLimit(val); setPlayerLimitFlash(true); } 
      else { setDealerScoreLimit(val); setDealerLimitFlash(true); }
      setTimeout(() => { setPlayerLimitFlash(false); setDealerLimitFlash(false); }, 2000);
      setStatus(GameStatus.PlayerTurn);
  };

  useEffect(() => {
    if (status === GameStatus.DealerTurn) {
        const aiTurn = async () => {
            // Slight delay to simulate thinking
            await new Promise(r => setTimeout(r, 1000));
            
            if (dealerStood) {
                if (playerStood) endRoundCheck(playerHandRef.current);
                else setStatus(GameStatus.PlayerTurn);
                return;
            }

            // --- AI ITEM USAGE LOGIC ---
            
            // 0. Thief: Use immediately if player has items to steal
            const thiefIdx = dealerInventory.findIndex(i => i.type === ItemType.Thief);
            if (thiefIdx !== -1 && playerInventory.length > 0) {
                await handleUseItem(dealerInventory[thiefIdx], thiefIdx, false);
                return; 
            }

            // 1. "20 o 22": Use immediately to set player limit to 20
            const limitItemIdx = dealerInventory.findIndex(i => i.type === ItemType.ScoreLimitChange);
            if (limitItemIdx !== -1) {
                await handleUseItem(dealerInventory[limitItemIdx], limitItemIdx, false);
                return; // One action per tick
            }

            // 2. Poison: Use immediately if present
            const poisonItemIdx = dealerInventory.findIndex(i => i.type === ItemType.Poison);
            if (poisonItemIdx !== -1) {
                await handleUseItem(dealerInventory[poisonItemIdx], poisonItemIdx, false);
                return;
            }

            // 3. Antidote: Use if poisoned
            if (dealerPoisonStacks > 0) {
                const antidoteIdx = dealerInventory.findIndex(i => i.type === ItemType.Antidote);
                if (antidoteIdx !== -1) {
                    await handleUseItem(dealerInventory[antidoteIdx], antidoteIdx, false);
                    return;
                }
            }

            // 4. Heal: "si tiene su salud maximo - 5 la usa siempre"
            if (scores.dealerHp <= INITIAL_HP - 5) {
                const healIdx = dealerInventory.findIndex(i => i.type === ItemType.Heal);
                if (healIdx !== -1) {
                    await handleUseItem(dealerInventory[healIdx], healIdx, false);
                    return;
                }
            }
            
            // Current Score Calculation
            let currentHand = [...dealerHandRef.current];
            // Recalculate score considering AI modifiers logic
            let effectiveScore = calculateScore(currentHand) - dealerScoreModifier;
            const pScore = calculateScore(playerHandRef.current) - playerScoreModifier;

            // 5. Score Boost: "si tiene de puntuación de 16 o menos y tiene el objeto 'bonus de puntos' lo usara siempre"
            if (effectiveScore <= 16) {
                const boostIdx = dealerInventory.findIndex(i => i.type === ItemType.ScoreBoost);
                if (boostIdx !== -1) {
                    await handleUseItem(dealerInventory[boostIdx], boostIdx, false);
                    return;
                }
            }

            // 6. Score Modifier (Anti-Bust): "Si ha superado su puntuacion maxima y tiene el objeto 'restar 5' lo usará"
            if (effectiveScore > dealerScoreLimit) {
                const modifierIdx = dealerInventory.findIndex(i => i.type === ItemType.ScoreModifier);
                if (modifierIdx !== -1) {
                    await handleUseItem(dealerInventory[modifierIdx], modifierIdx, false);
                    return;
                }
                // If busted and no modifier, proceed to stand logic (which will trigger bust end)
            }

            // --- STANDARD HIT/STAND LOGIC ---
            
            let dScore = effectiveScore; // Update after potential item usage in previous ticks

            let shouldStand = dScore >= 18 || (dScore >= 16 && Math.random() > 0.4);

            // NEW: Aggressive play with ScoreModifier
            // "si el oponente tiene el objeto 'restar 5' y su puntuación es de 17 a 19 tiene un 70% de posibilidades de pedir otra carta"
            const hasModifier = dealerInventory.some(i => i.type === ItemType.ScoreModifier);
            if (hasModifier && dScore >= 17 && dScore <= 19) {
                // 70% chance to HIT (so shouldStand becomes false)
                if (Math.random() < 0.7) {
                    shouldStand = false;
                }
            }

            if (dScore >= dealerScoreLimit) shouldStand = true;

            if (shouldStand) {
                // 7a. Hand Swap (Prioritized): Use if player score > dealer score before standing
                const swapIdx = dealerInventory.findIndex(i => i.type === ItemType.HandSwap);
                if (swapIdx !== -1) {
                    if (pScore > dScore) {
                        await handleUseItem(dealerInventory[swapIdx], swapIdx, false);
                        return; // Return to allow state update
                    }
                }

                // 7b. Sabotage (Dagger): "Si el oponente tiene el objeto 'daga' lo usara justo antes de plantarse"
                const daggerIdx = dealerInventory.findIndex(i => i.type === ItemType.Sabotage);
                if (daggerIdx !== -1) {
                    await handleUseItem(dealerInventory[daggerIdx], daggerIdx, false);
                    return; 
                }

                setDealerStandFlash(true);
                setTimeout(() => setDealerStandFlash(false), 1500);
                setDealerStood(true);
                if (playerStood) endRoundCheck(playerHandRef.current);
                else setStatus(GameStatus.PlayerTurn);
            } else {
                // Check if AI has ChoiceCard (3 al azar) and use it instead of hitting deck
                const choiceIdx = dealerInventory.findIndex(i => i.type === ItemType.ChoiceCard);
                if (choiceIdx !== -1) {
                    await handleUseItem(dealerInventory[choiceIdx], choiceIdx, false);
                    return;
                }

                const currentDeck = [...dealerDeckRef.current];
                if (currentDeck.length === 0) return;
                const card = currentDeck.pop()!;
                currentHand = [...currentHand, card];
                setDealerHand(currentHand);
                dealerDeckRef.current = currentDeck;
                setDealerDeck(currentDeck);
                
                // Immediate check for bust after drawing
                const newScore = calculateScore(currentHand) - dealerScoreModifier;
                if (newScore > dealerScoreLimit) {
                     // Pause to see if AI has a modifier in next tick (loop will re-run)
                } else {
                    if (playerStood) setTurnTrigger(p => p + 1);
                    else setStatus(GameStatus.PlayerTurn);
                }
            }
        };
        aiTurn();
    }
  }, [status, dealerHand.length, dealerInventory.length, playerScoreModifier, dealerScoreModifier, playerInventory.length]); // Added dependencies

  const endRoundCheck = (pHand: Card[]) => {
      const dHand = dealerHandRef.current;
      const pScore = calculateScore(pHand) - playerScoreModifier;
      const dScore = calculateScore(dHand) - dealerScoreModifier; // Apply modifier to dealer too
      let w = Winner.Push;
      if (pScore > playerScoreLimit) w = Winner.Dealer;
      else if (dScore > dealerScoreLimit) w = Winner.Player;
      else if (pScore > dScore) w = Winner.Player;
      else if (dScore > pScore) w = Winner.Dealer;
      endRound(w, pHand, dHand);
  };
  
  const [turnTrigger, setTurnTrigger] = useState(0);

  const endRound = async (roundWinner: Winner, finalPlayerHand: Card[], finalDealerHand: Card[]) => {
    const pScore = Math.max(0, calculateScore(finalPlayerHand) - playerScoreModifier);
    const dScore = Math.max(0, calculateScore(finalDealerHand) - dealerScoreModifier); // Ensure D score also modified
    
    let damage = Math.abs(pScore - dScore);
    if (pScore > playerScoreLimit && dScore <= dealerScoreLimit) damage = dScore;
    else if (dScore > dealerScoreLimit && pScore <= playerScoreLimit) damage = pScore;

    const newScores = { ...scores, roundsPlayed: scores.roundsPlayed + 1 };
    if (roundWinner === Winner.Player) {
      newScores.dealerHp = Math.max(0, newScores.dealerHp - damage);
      setDealerDamageFlash(true); setTimeout(() => setDealerDamageFlash(false), 2000);
      setRecentDamage({player: null, dealer: damage}); // Dealer takes damage
      
      // AI LOSE
      setShowDealerLoseMessage(true);
      setTimeout(() => setShowDealerLoseMessage(false), 2000);
      
    } else if (roundWinner === Winner.Dealer) {
      newScores.playerHp = Math.max(0, newScores.playerHp - damage);
      setPlayerDamageFlash(true); setTimeout(() => setPlayerDamageFlash(false), 2000);
      setRecentDamage({player: damage, dealer: null}); // Player takes damage
      
      // PLAYER LOSE
      setShowPlayerLoseMessage(true);
      setTimeout(() => setShowPlayerLoseMessage(false), 2000);

    } else if (roundWinner === Winner.Push) {
        // TIE
        setShowTieMessage(true);
        setTimeout(() => setShowTieMessage(false), 2000);
        setRecentDamage({player: null, dealer: null});
    }
    
    // Clear damage text after animation
    setTimeout(() => setRecentDamage({player: null, dealer: null}), 2000);

    setLastDamage(damage);
    setScores(newScores);
    setWinner(roundWinner);
    setStatus(GameStatus.RoundOver);

    setTimeout(() => {
      if (newScores.roundsPlayed >= MAX_ROUNDS || newScores.playerHp <= 0 || newScores.dealerHp <= 0) {
          setStatus(GameStatus.GameOver);
      } else {
          // Pass player poison status to generate appropriate loot for player
          // IMPORTANT: Pass current language
          setLootOptions(generateLootOptions(3, playerPoisonStacks > 0, languageRef.current));
          setStatus(GameStatus.LootSelection);
      }
    }, 2500);
  };

  const confirmLoot = () => {
    if (selectedLootId) {
        const item = lootOptions.find(i => i.id === selectedLootId);
        if (item) {
            if (playerInventory.length < MAX_INVENTORY) setPlayerInventory([...playerInventory, item]);
            else if (selectedSwapIndex !== null) {
                const newInv = [...playerInventory];
                newInv[selectedSwapIndex] = item;
                setPlayerInventory(newInv);
            }
        }
    }
    setSelectedLootId(null); setSelectedSwapIndex(null); setLootOptions([]);
    startNextRound();
  };

  const playerScore = Math.max(0, calculateScore(playerHand) - playerScoreModifier);
  const dealerScore = calculateScore(dealerHand) - dealerScoreModifier; // AI display score update
  const canUseItems = status === GameStatus.PlayerTurn || status === GameStatus.BustRecovery;

  const isPlayerBrawljack = playerScore === playerScoreLimit;
  const isDealerBrawljack = dealerScore === dealerScoreLimit;
  
  // Highlight limits when reached
  const isPlayerLimitReached = playerScore === playerScoreLimit;
  const isDealerLimitReached = dealerScore === dealerScoreLimit;

  const getHpBarColor = (hp: number) => {
    if (hp >= 20) return 'bg-green-500';
    if (hp >= 10) return 'bg-yellow-400';
    if (hp >= 2) return 'bg-red-600';
    return 'bg-red-300 animate-pulse';
  };

  if (status === GameStatus.Idle) {
    return (
      <div className="h-[100dvh] w-full bg-wine-deep flex flex-col items-center justify-center font-sans p-4 text-center">
         <div className="flex gap-4 mb-8">
            {DECORATIVE_CARDS.map((card, i) => (
                <div key={i} className="transform hover:-translate-y-2 transition-transform duration-300">
                     <PlayingCard card={card} index={0} totalCards={1} />
                </div>
            ))}
         </div>
         <h1 className="text-7xl sm:text-8xl font-serif font-black text-gold tracking-tighter drop-shadow-[0_0_20px_rgba(255,215,0,0.4)] animate-pulse mb-12">{t.title}</h1>
         <Button onClick={startGame} className="px-10 py-4 text-xl w-full max-w-xs mb-6">{t.play}</Button>
         
         {/* Language Selection Buttons */}
         <div className="flex gap-2 flex-wrap justify-center max-w-sm">
             <button onClick={() => setLanguage('es')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'es' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 750 500" width="24" height="24" className="block">
                     <rect width="750" height="500" fill="#c60b1e"/>
                     <rect width="750" height="250" y="125" fill="#ffc400"/>
                 </svg>
             </button>
             <button onClick={() => setLanguage('en')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'en' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" width="24" height="24" className="block">
                     <clipPath id="s">
                         <path d="M0,0 v30 h60 v-30 z"/>
                     </clipPath>
                     <clipPath id="t">
                         <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/>
                     </clipPath>
                     <g clipPath="url(#s)">
                         <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
                         <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
                         <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4"/>
                         <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
                         <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
                     </g>
                 </svg>
             </button>
             <button onClick={() => setLanguage('zh')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'zh' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="24" className="block">
                   <rect width="900" height="600" fill="#DE2910"/>
                   <path d="M176,176 l65,22 l-40,60 l14,-72 l-60,-40 l72,-4 l24,-68 l24,68 l72,4 l-60,40 l14,72z" fill="#FFDE00" transform="translate(-60,-60) scale(1)"/>
                   <g transform="translate(300, 60) rotate(23)">
                      <path d="M0,-30 l7,24 h24 l-20,14 l8,24 l-20,-14 l-20,14 l8,-24 l-20,-14 h24z" fill="#FFDE00" transform="scale(0.8)"/>
                   </g>
                   <g transform="translate(360, 120) rotate(45)">
                      <path d="M0,-30 l7,24 h24 l-20,14 l8,24 l-20,-14 l-20,14 l8,-24 l-20,-14 h24z" fill="#FFDE00" transform="scale(0.8)"/>
                   </g>
                   <g transform="translate(360, 210) rotate(0)">
                       <path d="M0,-30 l7,24 h24 l-20,14 l8,24 l-20,-14 l-20,14 l8,-24 l-20,-14 h24z" fill="#FFDE00" transform="scale(0.8)"/>
                   </g>
                   <g transform="translate(300, 270) rotate(-23)">
                       <path d="M0,-30 l7,24 h24 l-20,14 l8,24 l-20,-14 l-20,14 l8,-24 l-20,-14 h24z" fill="#FFDE00" transform="scale(0.8)"/>
                   </g>
                 </svg>
             </button>
             {/* Portuguese Flag */}
             <button onClick={() => setLanguage('pt')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'pt' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="24" height="24" className="block">
                     <rect width="600" height="400" fill="#ce1126"/>
                     <rect width="240" height="400" fill="#006600"/>
                     <circle cx="240" cy="200" r="100" fill="#ffc400" stroke="#000" strokeWidth="0"/>
                     <path d="M240,160 l0,80 M200,200 l80,0" stroke="#ce1126" strokeWidth="20"/>
                 </svg>
             </button>
             {/* French Flag */}
             <button onClick={() => setLanguage('fr')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'fr' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" width="24" height="24" className="block">
                     <rect width="900" height="600" fill="#ED2939"/>
                     <rect width="600" height="600" fill="#fff"/>
                     <rect width="300" height="600" fill="#002395"/>
                 </svg>
             </button>
             {/* German Flag */}
             <button onClick={() => setLanguage('de')} className={`p-2 rounded-full border-2 transition-transform active:scale-95 ${language === 'de' ? 'bg-gold border-yellow-600 scale-110 shadow-lg' : 'bg-gray-800 border-gray-600 hover:border-gray-400'}`}>
                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 3" width="24" height="24" className="block">
                     <rect width="5" height="3" y="0" x="0" fill="#000"/>
                     <rect width="5" height="2" y="1" x="0" fill="#D00"/>
                     <rect width="5" height="1" y="2" x="0" fill="#FFCE00"/>
                 </svg>
             </button>
         </div>
      </div>
    );
  }

  const isDealerActive = status === GameStatus.DealerTurn;
  const isPlayerActive = status === GameStatus.PlayerTurn || status === GameStatus.BustRecovery;

  return (
    <div className="h-[100dvh] bg-gray-900 flex flex-col font-sans text-white overflow-hidden relative touch-none">
      <div className="bg-black/60 border-b border-white/10 relative h-12 flex items-center justify-center z-40 shrink-0">
         <button onClick={() => setStatus(GameStatus.Idle)} className="absolute left-2 text-gray-400 p-2 hover:text-white flex items-center gap-1">
            <Home size={18} />
            <span className="text-[10px] font-bold uppercase tracking-widest">{t.menu}</span>
         </button>
         <div className="bg-felt-dark px-4 py-1 rounded-full text-sm text-gold font-bold border border-gold/20 uppercase tracking-widest shadow-lg">{t.round} {scores.roundsPlayed + 1}/{MAX_ROUNDS}</div>
         <button onClick={() => setShowLog(!showLog)} className="absolute right-2 text-gray-400 p-2 hover:text-white"><ScrollText size={20}/></button>
      </div>

      <div className="flex-1 flex flex-col relative w-full h-full">
        
        {/* GLOBAL TIE MESSAGE OVERLAY */}
        {showTieMessage && <div className="absolute inset-0 z-[200] flex items-center justify-center pointer-events-none"><span className="text-6xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-bounce">{t.tie}</span></div>}

        {/* GAME OVER SCREEN */}
        {status === GameStatus.GameOver && (
            <div className="absolute inset-0 bg-black/95 z-[150] flex items-center justify-center p-4 flex-col text-center animate-fade-in">
                <div className="mb-8">
                    {scores.playerHp > scores.dealerHp ? (
                        <>
                            <Trophy size={80} className="text-gold mx-auto mb-4 animate-bounce" />
                            <h2 className="text-6xl font-black text-gold uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(255,215,0,0.6)]">{t.victory}</h2>
                        </>
                    ) : (
                        <>
                            <Skull size={80} className="text-red-600 mx-auto mb-4 animate-pulse" />
                            <h2 className="text-6xl font-black text-red-600 uppercase tracking-tighter drop-shadow-[0_0_20px_rgba(220,38,38,0.6)]">{t.defeat}</h2>
                        </>
                    )}
                </div>
                
                <div className="bg-white/10 p-6 rounded-2xl border border-white/20 w-full max-w-xs mb-8 backdrop-blur-sm">
                    <h3 className="text-gray-400 text-sm uppercase mb-4 tracking-widest">{t.finalScore}</h3>
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-white">{t.player}</span>
                        <span className={`font-mono text-2xl ${scores.playerHp > 0 ? 'text-green-400' : 'text-red-500'}`}>{scores.playerHp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="font-bold text-white">{t.ai}</span>
                        <span className={`font-mono text-2xl ${scores.dealerHp > 0 ? 'text-green-400' : 'text-red-500'}`}>{scores.dealerHp}</span>
                    </div>
                </div>

                <Button onClick={startGame} className="w-full max-w-xs text-xl py-4">{t.playAgain}</Button>
            </div>
        )}
      
        {/* Dealer Area */}
        <div className={`flex-1 relative transition-all flex flex-col duration-200 ${isDealerActive ? 'ring-2 ring-yellow-400 ring-inset z-10' : ''} ${dealerDamageFlash ? 'bg-red-900/80' : dealerPoisonFlash ? 'bg-purple-900/80' : 'bg-[#244f3b]'}`}>
            {dealerPoisonStacks > 0 && <div className="absolute inset-0 bg-purple-900/20 animate-poison-pulse pointer-events-none z-0"></div>}
            {dealerPoisonFlash && (
               <>
                 <div className="absolute inset-0 z-[60] flex items-center justify-center">
                    <span className="text-purple-400 font-black text-5xl bg-black/80 px-6 py-2 rounded-xl border-2 border-purple-500 animate-pulse tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.5)]">{t.poisoned}</span>
                 </div>
                 <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden z-[55] pointer-events-none">
                    {POISON_BUBBLES.map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-full bg-purple-500/70 blur-sm animate-float-up shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                             style={{
                                 left: b.left,
                                 width: b.size,
                                 height: b.size,
                                 animationDelay: b.delay
                             }}
                        />
                    ))}
                 </div>
               </>
            )}
            
            {showDealerLoseMessage && <div className="absolute inset-0 z-50 flex items-center justify-center"><span className="text-red-500 font-black text-4xl bg-black/80 px-4 py-1 rounded border border-red-500 animate-pulse">{t.dealerLose}</span></div>}
            {dealerStandFlash && !showDealerLoseMessage && <div className="absolute inset-0 z-50 flex items-center justify-center"><span className="text-gold font-black text-3xl bg-black/60 px-4 py-1 rounded border border-gold">{t.stands}</span></div>}
            
            {actionFeedback.dealer && <div className="absolute inset-0 z-[80] flex items-center justify-center"><div className="bg-black/50 p-6 rounded-xl flex flex-col items-center border border-white/20"><span>{actionFeedback.dealer.text}</span><div className="text-6xl">{actionFeedback.dealer.icon}</div></div></div>}
            {slashTarget === 'dealer' && <div className="absolute inset-0 z-[90] flex items-center justify-center overflow-hidden"><div className="w-[150%] h-1 bg-white rotate-45 animate-deal"></div></div>}
            <div className="flex items-center justify-between h-full px-2 gap-2 relative z-10">
                <div className="flex flex-col items-center w-20 relative">
                    {/* Dealer Damage Explosion - TOP RIGHT */}
                    {recentDamage.dealer !== null && (
                         <div className="absolute -top-8 -right-8 z-[100] flex flex-col items-center animate-boom pointer-events-none">
                             <div className="relative mb-0.5">
                                <span className="text-orange-500 font-black text-xl uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] tracking-wider">{t.damage}</span>
                                <div className="absolute inset-0 bg-orange-500/20 blur-md opacity-50 animate-pulse"></div>
                             </div>
                             <span className="text-red-500 font-black text-3xl bg-black/90 px-3 py-1 rounded-xl border border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]">-{recentDamage.dealer}</span>
                         </div>
                    )}

                    <span className="text-[10px] font-bold mb-1">{t.ai}</span>
                    <div className={`w-14 h-14 bg-red-900 rounded-full border-2 flex items-center justify-center ${dealerDamageFlash ? 'border-red-500' : 'border-red-400'}`}><Bot size={28}/></div>
                    <div className="w-14 h-3 bg-black/50 rounded-full mt-2 relative">
                        <div className={`h-full rounded-full transition-all duration-500 ${getHpBarColor(scores.dealerHp)}`} style={{width:`${(scores.dealerHp/INITIAL_HP)*100}%`}}></div>
                    </div>
                    <span className="text-[10px] mt-1">{scores.dealerHp}/{INITIAL_HP}</span>
                    {dealerPoisonStacks > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-purple-400 animate-pulse">
                            <Skull size={18} className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                            <span className="text-xl font-black">-{dealerPoisonStacks}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center flex-grow">
                    {/* Opponent Inventory - INCREASED CONTAINER SIZE to w-9 h-9, KEPT ICON SIZE */}
                    <div className="flex gap-2 mb-2 min-h-[36px]">
                        {dealerInventory.map((item, idx) => (
                            <div key={idx} className="w-9 h-9 bg-black/40 rounded flex items-center justify-center text-[10px] border border-white/10 shadow-lg" title={item.name}>
                                {item.icon}
                            </div>
                        ))}
                    </div>
                    <div className={`flex justify-center mb-2 ${isSwapping ? 'translate-y-[200px]' : ''}`}>{dealerHand.map((c, i) => <PlayingCard key={i} card={c} index={i} totalCards={dealerHand.length} />)}</div>
                    <div className="flex flex-col items-center">
                        <div className={`px-4 py-1 rounded-full border text-xl font-black transition-all ${isDealerBrawljack ? 'bg-yellow-400 text-black border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'bg-black/40 border-white/10 text-white'}`}>
                            {dealerScore}
                        </div>
                        {isDealerBrawljack && (
                            <div className="text-[10px] text-yellow-400 font-black animate-pulse mt-1 tracking-widest drop-shadow-sm uppercase">
                                {t.brawljack}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-20 flex flex-col items-center">
                  <span className="text-[8px] uppercase text-gray-400">{t.limit}</span>
                  <span className={`text-2xl font-black transition-all duration-300 ${isDealerLimitReached ? 'text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : ''}`}>{dealerScoreLimit}</span>
                </div>
            </div>
        </div>

        {/* Player Area */}
        <div className={`flex-[1.3] relative transition-all flex flex-col border-t-4 border-black/20 duration-200 ${isPlayerActive ? 'ring-2 ring-yellow-400 ring-inset z-10' : ''} ${playerDamageFlash ? 'bg-red-900/80' : playerPoisonFlash ? 'bg-purple-900/80' : 'bg-[#35654d]'}`}>
            {playerPoisonStacks > 0 && <div className="absolute inset-0 bg-purple-900/20 animate-poison-pulse pointer-events-none z-0"></div>}
            {playerPoisonFlash && (
               <>
                 <div className="absolute inset-0 z-[60] flex items-center justify-center">
                    <span className="text-purple-400 font-black text-5xl bg-black/80 px-6 py-2 rounded-xl border-2 border-purple-500 animate-pulse tracking-widest shadow-[0_0_20px_rgba(168,85,247,0.5)]">{t.poisoned}</span>
                 </div>
                 <div className="absolute top-0 left-0 right-0 h-32 overflow-hidden z-[55] pointer-events-none">
                    {POISON_BUBBLES.map((b, i) => (
                        <div key={i} className="absolute bottom-0 rounded-full bg-purple-500/70 blur-sm animate-float-up shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                             style={{
                                 left: b.left,
                                 width: b.size,
                                 height: b.size,
                                 animationDelay: b.delay
                             }}
                        />
                    ))}
                 </div>
               </>
            )}

            {showPlayerLoseMessage && <div className="absolute inset-0 z-50 flex items-center justify-center"><span className="text-red-500 font-black text-5xl bg-black/80 px-6 py-3 rounded-xl border-2 border-red-500 shadow-xl animate-pulse">{t.playerLose}</span></div>}
            {playerStandFlash && !showPlayerLoseMessage && <div className="absolute inset-0 z-50 flex items-center justify-center"><span className="text-gold font-black text-4xl bg-black/80 px-6 py-3 rounded-xl border-2 border-gold shadow-xl">{t.stands}</span></div>}
            
            {actionFeedback.player && <div className="absolute inset-0 z-[80] flex items-center justify-center"><div className="bg-black/50 p-6 rounded-xl flex flex-col items-center border border-white/20"><span>{actionFeedback.player.text}</span><div className="text-6xl">{actionFeedback.player.icon}</div></div></div>}
            {slashTarget === 'player' && <div className="absolute inset-0 z-[90] flex items-center justify-center overflow-hidden"><div className="w-[150%] h-1 bg-white rotate-45 animate-deal"></div></div>}
            <div className="flex items-center justify-between flex-grow px-2 py-2 relative z-10">
                <div className="flex flex-col items-center w-20 relative">
                    {/* Player Damage Explosion - TOP RIGHT */}
                    {recentDamage.player !== null && (
                         <div className="absolute -top-8 -right-8 z-[100] flex flex-col items-center animate-boom pointer-events-none">
                             <div className="relative mb-0.5">
                                <span className="text-orange-500 font-black text-xl uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] tracking-wider">{t.damage}</span>
                                <div className="absolute inset-0 bg-orange-500/20 blur-md opacity-50 animate-pulse"></div>
                             </div>
                             <span className="text-red-500 font-black text-3xl bg-black/90 px-3 py-1 rounded-xl border border-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]">-{recentDamage.player}</span>
                         </div>
                    )}
                
                    <span className="text-[10px] font-bold mb-1">{t.player}</span>
                    <div className="w-16 h-16 bg-blue-900 rounded-full border-2 flex items-center justify-center"><User size={32}/></div>
                    <div className="w-16 h-3 bg-black/50 rounded-full mt-2 relative">
                        <div className={`h-full rounded-full transition-all duration-500 ${getHpBarColor(scores.playerHp)}`} style={{width:`${(scores.playerHp/INITIAL_HP)*100}%`}}></div>
                    </div>
                    <span className="text-xs mt-1">{scores.playerHp}/{INITIAL_HP}</span>
                    {playerPoisonStacks > 0 && (
                        <div className="flex items-center gap-1 mt-1 text-purple-400 animate-pulse">
                            <Skull size={18} className="drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]" />
                            <span className="text-xl font-black">-{playerPoisonStacks}</span>
                        </div>
                    )}
                </div>
                <div className="flex flex-col items-center flex-grow overflow-hidden">
                    <div className={`flex justify-center mb-3 ${isSwapping ? '-translate-y-[200px]' : ''}`}>{playerHand.map((c, i) => <PlayingCard key={i} card={c} index={i} totalCards={playerHand.length} />)}</div>
                    <div className="flex flex-col items-center">
                        <div className={`px-4 py-1 rounded-full border font-black text-xl transition-all ${status === GameStatus.BustRecovery ? 'bg-red-900 border-red-500' : isPlayerBrawljack ? 'bg-yellow-400 text-black border-yellow-600 shadow-[0_0_15px_rgba(255,215,0,0.5)]' : 'bg-black/50 border-green-400'}`}>
                            {playerScore}
                        </div>
                        {isPlayerBrawljack && (
                            <div className="text-[10px] text-yellow-400 font-black animate-pulse mt-1 tracking-widest drop-shadow-sm uppercase">
                                {t.brawljack}
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-20 flex flex-col items-center">
                  <span className="text-[8px] uppercase text-gray-400">{t.limit}</span>
                  <span className={`text-2xl font-black transition-all duration-300 ${isPlayerLimitReached ? 'text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]' : ''}`}>{playerScoreLimit}</span>
                </div>
            </div>

            <div className="w-full flex items-end justify-center gap-4 mb-2 relative z-20 px-4">
                <div className="flex gap-4">
                    {[0,1,2].map(i => {
                        const it = playerInventory[i];
                        // INCREASED Player Inventory Buttons Container to w-20 h-12, KEPT ICON SIZE text-lg
                        return (
                            <button key={i} onClick={() => it && handleUseItem(it, i, true)} disabled={!it || !canUseItems} className={`w-20 h-12 rounded-lg border flex items-center justify-center bg-gray-800 transition-transform active:scale-95 ${!it ? 'opacity-30 border-dashed' : 'hover:border-gold hover:bg-gray-700'}`}>{it ? <span className="text-lg">{it.icon}</span> : <div className="w-1 h-1 rounded-full bg-white/5"></div>}</button>
                        );
                    })}
                </div>
                <button onClick={() => setShowInventory(true)} className="w-10 h-8 bg-gold rounded-lg border border-yellow-600 shadow-xl flex items-center justify-center text-black hover:bg-yellow-400 active:scale-95 transition-all"><Backpack size={18}/></button>
            </div>

            <div className="flex gap-3 px-4 pb-6 pt-1 h-20 shrink-0">
                {(status === GameStatus.PlayerTurn || status === GameStatus.BustRecovery) ? (
                    <>
                        <button onClick={handleHit} disabled={status === GameStatus.BustRecovery} className="flex-1 bg-green-600 border-b-4 border-green-800 rounded-xl font-black text-white text-xl">{t.hit}</button>
                        <button onClick={handleStand} className="flex-1 bg-yellow-500 border-b-4 border-yellow-700 text-black rounded-xl font-black text-xl">{status === GameStatus.BustRecovery ? t.surrender : t.stand}</button>
                    </>
                ) : <div className="w-full bg-black/20 rounded-xl flex items-center justify-center text-white/40 text-sm animate-pulse uppercase">{t.waiting}</div>}
            </div>
        </div>

        {status === GameStatus.LootSelection && (
            <div className="absolute inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="w-full max-sm bg-gray-800 rounded-2xl p-4 border border-white/10 text-center shadow-2xl flex flex-col max-h-[90vh]">
                    <h3 className="text-xl font-black text-gold mb-1 uppercase">{t.rewardTitle}</h3>
                    <p className="text-xs text-gray-400 mb-4">{t.rewardDesc}</p>
                    <div className="flex flex-col gap-3 mb-4 w-full overflow-y-auto">
                        {lootOptions.map(item => (
                            <button key={item.id} onClick={() => setSelectedLootId(item.id)} className={`p-4 rounded-xl border flex items-center gap-4 transition-all w-full text-left ${selectedLootId === item.id ? 'bg-blue-900/80 border-blue-400 ring-2' : 'bg-gray-700/80'}`}>
                                <div className="text-2xl">{item.icon}</div>
                                <div className="flex flex-col"><div className="text-lg font-black text-white">{item.name}</div><div className="text-xs text-gray-300">{item.description}</div></div>
                            </button>
                        ))}
                    </div>
                    {playerInventory.length >= MAX_INVENTORY && selectedLootId && (
                        <div className="bg-black/30 p-2 rounded mb-4"><p className="text-[10px] text-red-300">{t.inventoryFull}</p>
                            {/* INCREASED Loot Swap Container to w-10 h-10, KEPT ICON SIZE text-xs */}
                            <div className="flex justify-center gap-2">{playerInventory.map((it, idx) => <button key={idx} onClick={() => setSelectedSwapIndex(idx)} className={`w-10 h-10 border rounded text-xs flex items-center justify-center ${selectedSwapIndex === idx ? 'bg-red-900 border-red-500' : 'bg-gray-800'}`}>{it.icon}</button>)}</div>
                        </div>
                    )}
                    <div className="flex gap-2">
                        <Button onClick={confirmLoot} disabled={!selectedLootId || (playerInventory.length >= MAX_INVENTORY && selectedSwapIndex === null)} className="flex-1">{t.confirm}</Button>
                        <Button onClick={discardLoot} variant="danger" className="flex-1">{t.pass}</Button>
                    </div>
                </div>
            </div>
        )}

        {(status === GameStatus.ViewingDeck || status === GameStatus.Spying) && (
             <div className="absolute inset-0 bg-black/90 z-[120] flex items-center justify-center p-4 backdrop-blur-sm">
                 <div className="text-center w-full max-w-lg">
                     <h3 className="text-xl font-black text-gold mb-6 uppercase">{status === GameStatus.ViewingDeck ? t.viewingDeck : t.spying}</h3>
                     <div className="flex justify-center gap-12 mb-8">
                         {(status === GameStatus.ViewingDeck ? playerDeck : dealerDeck).slice(-3).reverse().map((c, i) => <div key={i} className="flex flex-col items-center"><PlayingCard card={c} index={0} /><span className="text-gold font-bold text-sm mt-2">{t.val}: {c.value}</span></div>)}
                     </div>
                     <Button onClick={() => setStatus(GameStatus.PlayerTurn)} className="w-full">{t.understood}</Button>
                 </div>
             </div>
        )}

        {status === GameStatus.ConfiguringLimit && (
             <div className="absolute inset-0 bg-black/90 z-[120] flex items-center justify-center p-4">
                 <div className="bg-gray-800 p-6 rounded-2xl w-full max-w-xs text-center border border-white/10">
                     <h3 className="text-xl font-black text-gold mb-6 uppercase">{t.configRules}</h3>
                     <div className="space-y-4">
                         <div><p className="text-xs text-gray-400 mb-2">{t.yourLimit}</p><div className="flex gap-2"><button onClick={() => configureLimit('player', 20)} className="flex-1 bg-gray-700 p-2 rounded">20</button><button onClick={() => configureLimit('player', 22)} className="flex-1 bg-gray-700 p-2 rounded">22</button></div></div>
                         <div><p className="text-xs text-gray-400 mb-2">{t.rivalLimit}</p><div className="flex gap-2"><button onClick={() => configureLimit('dealer', 20)} className="flex-1 bg-gray-700 p-2 rounded">20</button><button onClick={() => configureLimit('dealer', 22)} className="flex-1 bg-gray-700 p-2 rounded">22</button></div></div>
                     </div>
                     <button onClick={() => setStatus(GameStatus.PlayerTurn)} className="mt-6 text-gray-500 text-xs">{t.cancel}</button>
                 </div>
             </div>
        )}

        {status === GameStatus.ChoosingRandomCard && (
             <div className="absolute inset-0 bg-black/90 z-[120] flex items-center justify-center p-4">
                 <div className="text-center w-full max-w-sm">
                     <h3 className="text-xl font-black text-gold mb-2 uppercase">{t.chooseDestiny}</h3>
                     <p className="text-sm text-gray-400 mb-6 font-mono">{t.currentScore}: <span className="text-white font-bold">{playerScore}</span></p>
                     <div className="flex justify-center gap-8 mb-8">{randomChoices.map((c, i) => <div key={i} onClick={() => handleChoiceCard(c)} className="cursor-pointer transform hover:scale-110"><PlayingCard card={c} index={0} /><span className="text-gold font-bold text-sm mt-2">{t.val}: {c.value}</span></div>)}</div>
                 </div>
             </div>
        )}

        {showInventory && (
          <div className="absolute inset-0 bg-black/90 z-[120] flex items-center justify-center p-4 backdrop-blur-md">
              <div className="w-full max-w-lg bg-gray-800 rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[85vh]">
                  <div className="p-4 border-b border-white/10 flex justify-between items-center bg-gray-900/50 rounded-t-xl">
                      <div className="flex items-center gap-2 text-gold"><Backpack size={24}/><h3 className="font-black uppercase tracking-wider text-xl">{t.backpackTitle}</h3></div>
                      <button onClick={() => setShowInventory(false)} className="text-gray-400 hover:text-white"><X size={28}/></button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1">
                      {playerInventory.length === 0 ? <div className="text-center py-10 text-gray-500"><Package size={64} className="mx-auto mb-4 opacity-20"/><p className="text-xl">{t.backpackEmpty}</p></div> : (
                          <div className="space-y-4">
                              {playerInventory.map((item, idx) => (
                                  <div key={idx} className="bg-gray-700/50 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                                      {/* INCREASED Backpack Item Container to w-24 h-14, KEPT ICON SIZE text-2xl */}
                                      <div className="w-24 h-14 bg-gray-800 rounded-xl flex items-center justify-center shadow-inner overflow-hidden border border-white/10 relative"><span className="select-none text-2xl font-black leading-none">{item.icon}</span></div>
                                      <div className="flex-1 min-w-0"><h4 className="font-bold text-white text-lg">{item.name}</h4><p className="text-sm text-gray-400 leading-tight">{item.description}</p></div>
                                      <button onClick={() => handleUseItem(item, idx, true)} disabled={!canUseItems || (status === GameStatus.BustRecovery && item.type !== ItemType.ScoreModifier && item.type !== ItemType.Thief)} className="px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:opacity-50 text-sm font-bold rounded-lg uppercase shadow-md active:scale-95 transition-all">{t.use}</button>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
                  <div className="p-4 border-t border-white/10 bg-gray-900/50 text-center"><p className="text-xs text-gray-500 uppercase tracking-widest">{t.capacity}: {playerInventory.length} / {MAX_INVENTORY}</p></div>
              </div>
          </div>
        )}
        
        {showLog && (
             <div className="absolute top-12 right-0 left-0 h-48 bg-black/95 border-b border-white/20 z-50 p-2 overflow-y-auto text-[10px] font-mono shadow-2xl">
                 <div className="flex justify-between items-center mb-2 sticky top-0 bg-black/95 pb-1 border-b border-white/10"><span className="text-gold font-bold">{t.battleLog}</span><button onClick={() => setShowLog(false)}><X size={14} className="text-white"/></button></div>
                 {gameLog.map((l, i) => (
                    <div key={i} className={`mb-1 border-b border-white/5 pb-1 ${l.includes('---') ? 'bg-white/10 text-gold font-bold' : 'text-gray-300'}`}>
                        {l}
                    </div>
                 ))}
             </div>
        )}
      </div>
    </div>
  );
};

export default App;