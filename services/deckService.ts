import { Card, Suit } from '../types';

const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const createDeck = (): Card[] => {
  const deck: Card[] = [];
  const suits = [Suit.Hearts, Suit.Diamonds, Suit.Clubs, Suit.Spades];

  for (const suit of suits) {
    for (const rank of RANKS) {
      let value = parseInt(rank);
      if (rank === 'J' || rank === 'Q' || rank === 'K') {
        value = 10;
      } else if (rank === 'A') {
        value = 11;
      }
      deck.push({ suit, rank, value });
    }
  }
  return deck;
};

export const shuffleDeck = (deck: Card[]): Card[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export const calculateScore = (hand: Card[]): number => {
  let score = 0;
  let aceCount = 0;

  for (const card of hand) {
    if (card.isHidden) continue;
    score += card.value;
    if (card.rank === 'A') {
      aceCount++;
    }
  }

  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }

  return score;
};