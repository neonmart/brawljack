export enum Suit {
  Hearts = '♥',
  Diamonds = '♦',
  Clubs = '♣',
  Spades = '♠',
}

export interface Card {
  suit: Suit;
  rank: string;
  value: number;
  isHidden?: boolean;
}

export enum GameStatus {
  Idle = 'IDLE',
  PlayerTurn = 'PLAYER_TURN',
  DealerTurn = 'DEALER_TURN',
  BustRecovery = 'BUST_RECOVERY',
  RoundOver = 'ROUND_OVER',
  LootSelection = 'LOOT_SELECTION',
  ChoosingRandomCard = 'CHOOSING_RANDOM_CARD',
  GameOver = 'GAME_OVER',
  ViewingDeck = 'VIEWING_DECK',
  ConfiguringLimit = 'CONFIGURING_LIMIT',
  Spying = 'SPYING',
}

export enum Winner {
  None = 'NONE',
  Player = 'PLAYER',
  Dealer = 'DEALER',
  Push = 'PUSH', // Tie
}

export interface ScoreState {
  playerHp: number;
  dealerHp: number;
  roundsPlayed: number;
}

export enum ItemType {
  Heal = 'HEAL',
  ScoreModifier = 'SCORE_MODIFIER', // Subtracts
  ScoreBoost = 'SCORE_BOOST',       // Adds
  Sabotage = 'SABOTAGE',
  Poison = 'POISON',
  Antidote = 'ANTIDOTE',
  ChoiceCard = 'CHOICE_CARD',
  HandSwap = 'HAND_SWAP',
  SeeNext3 = 'SEE_NEXT_3',
  ScoreLimitChange = 'SCORE_LIMIT_CHANGE',
  Spy = 'SPY',
  Thief = 'THIEF',
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number; 
  icon: string;
  weight?: number;
}