import React from 'react';
import { Card, Suit } from '../types';

interface PlayingCardProps {
  card: Card;
  index: number;
  totalCards?: number;
}

const PlayingCard: React.FC<PlayingCardProps> = ({ card, index, totalCards = 1 }) => {
  // Mobile-first responsive sizing
  const cardSize = "w-16 h-24 sm:w-20 sm:h-28 md:w-28 md:h-40"; 
  
  // Overlap logic: Adjusted to show more of the previous card (less negative margin)
  const overlap = index > 0 ? "-ml-9 sm:-ml-12 md:-ml-16" : "ml-0"; 
  
  const innerBorder = "w-14 h-20 sm:w-18 sm:h-24 md:w-24 md:h-36";

  // Fan Calculation
  const centerIndex = (totalCards - 1) / 2;
  // Reduced rotation step to make the fan flatter and more legible
  const rotationStep = 3; 
  const rotateDeg = (index - centerIndex) * rotationStep;
  
  // Arch effect: push side cards down slightly
  const yOffset = Math.abs(index - centerIndex) * 3;

  const zIndexStyle: React.CSSProperties = { 
    zIndex: index, 
    transform: `rotate(${rotateDeg}deg) translateY(${yOffset}px)`,
    transformOrigin: 'bottom center', 
    animationDelay: `${index * 100}ms` 
  };

  const containerClass = `${cardSize} rounded-md shadow-xl relative transition-transform duration-300 animate-deal ${overlap} overflow-hidden`;

  if (card.isHidden) {
    return (
      <div 
        className={`${containerClass} bg-blue-900 border border-white flex items-center justify-center`}
        style={{ 
            backgroundImage: 'repeating-linear-gradient(45deg, #1e3a8a 0px, #1e3a8a 10px, #172554 10px, #172554 20px)',
            ...zIndexStyle
        }}
      >
        <div className={`${innerBorder} border border-white/20 rounded opacity-50`}></div>
      </div>
    );
  }

  // Color logic based on suit
  const getSuitColor = (suit: Suit) => {
    switch (suit) {
      case Suit.Hearts:
        return 'text-red-600';
      case Suit.Diamonds:
        return 'text-blue-600'; // Diamond is Blue
      case Suit.Clubs:
        return 'text-green-600'; // Club is Green
      case Suit.Spades:
        return 'text-gray-900';
      default:
        return 'text-gray-900';
    }
  };

  const textColor = getSuitColor(card.suit);
  
  // Text sizes updated for column layout
  const rankSize = "text-lg sm:text-xl md:text-2xl";
  const smallSuitSize = "text-xs sm:text-sm md:text-base";
  const centerIconSize = "text-4xl sm:text-5xl md:text-7xl";

  return (
    <div 
      className={`${containerClass} bg-white border border-gray-200`}
      style={zIndexStyle}
    >
      {/* Top Left Index (The Spine) - Positioned absolutely to ensure visibility in fan */}
      <div className={`absolute top-1 left-1 flex flex-col items-center justify-center w-6 sm:w-8 leading-none ${textColor}`}>
        <span className={`${rankSize} font-bold tracking-tighter`}>{card.rank}</span>
        <span className={`${smallSuitSize} mt-0.5`}>{card.suit}</span>
      </div>
      
      {/* Center Big Icon */}
      <div className={`absolute inset-0 flex items-center justify-center ${centerIconSize} ${textColor} opacity-20 pointer-events-none`}>
        {card.suit}
      </div>

      {/* Bottom Right Index (Inverted) */}
      <div className={`absolute bottom-1 right-1 flex flex-col items-center justify-center w-6 sm:w-8 leading-none transform rotate-180 ${textColor}`}>
        <span className={`${rankSize} font-bold tracking-tighter`}>{card.rank}</span>
        <span className={`${smallSuitSize} mt-0.5`}>{card.suit}</span>
      </div>
    </div>
  );
};

export default PlayingCard;