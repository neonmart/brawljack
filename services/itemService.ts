import { InventoryItem, ItemType } from '../types';
import { Language } from './translations';

interface LocalizedItemTemplate {
  name: { es: string; en: string; zh: string; pt: string; fr: string; de: string };
  description: { es: string; en: string; zh: string; pt: string; fr: string; de: string };
  type: ItemType;
  value: number;
  icon: string;
  weight: number;
}

const LOCALIZED_ITEMS: LocalizedItemTemplate[] = [
  {
    name: { es: 'Poción Menor', en: 'Minor Potion', zh: '小药水', pt: 'Poção Menor', fr: 'Petite Potion', de: 'Kleiner Trank' },
    description: { es: '+5 Salud', en: '+5 Health', zh: '+5 生命值', pt: '+5 Vida', fr: '+5 Santé', de: '+5 Leben' },
    type: ItemType.Heal,
    value: 5,
    icon: '+5❤️',
    weight: 20
  },
  {
    name: { es: 'Poción Mayor', en: 'Major Potion', zh: '大药水', pt: 'Poção Maior', fr: 'Grande Potion', de: 'Großer Trank' },
    description: { es: '+10 Salud', en: '+10 Health', zh: '+10 生命值', pt: '+10 Vida', fr: '+10 Santé', de: '+10 Leben' },
    type: ItemType.Heal,
    value: 10,
    icon: '+10❤️',
    weight: 5
  },
  {
    name: { es: 'Super Poción', en: 'Super Potion', zh: '超级药水', pt: 'Super Poção', fr: 'Super Potion', de: 'Supertrank' },
    description: { es: 'Recupera toda la salud', en: 'Restore full health', zh: '恢复所有生命值', pt: 'Recupera toda a vida', fr: 'Restaure toute la santé', de: 'Stellt volle Gesundheit wieder her' },
    type: ItemType.Heal,
    value: 50,
    icon: '🦁',
    weight: 1
  },
  {
    name: { es: 'Restar 5', en: 'Minus 5', zh: '减 5 点', pt: 'Menos 5', fr: 'Moins 5', de: 'Minus 5' },
    description: { es: '-5 a Puntuación', en: '-5 to Score', zh: '当前点数 -5', pt: '-5 na Pontuação', fr: '-5 au Score', de: '-5 auf Punktzahl' },
    type: ItemType.ScoreModifier,
    value: 5,
    icon: '-5🃏',
    weight: 15
  },
  {
    name: { es: 'Bonus de Puntos', en: 'Score Boost', zh: '点数加成', pt: 'Bônus de Pontos', fr: 'Bonus de Score', de: 'Punkte-Boost' },
    description: { es: '+5 a Puntuación', en: '+5 to Score', zh: '当前点数 +5', pt: '+5 na Pontuação', fr: '+5 au Score', de: '+5 auf Punktzahl' },
    type: ItemType.ScoreBoost,
    value: 5,
    icon: '+5🃏',
    weight: 15
  },
  {
    name: { es: 'Veneno', en: 'Poison', zh: '毒药', pt: 'Veneno', fr: 'Poison', de: 'Gift' },
    description: { es: '+2 daño de veneno acumulativo cada ronda al rival', en: '+2 cumulative poison damage to rival each round', zh: '每回合对手受到 +2 累积毒伤', pt: '+2 dano de veneno cumulativo a cada rodada', fr: '+2 dégâts de poison cumulatifs chaque manche', de: '+2 kumulativer Giftschaden pro Runde' },
    type: ItemType.Poison,
    value: 2,
    icon: '☣️+2',
    weight: 12
  },
  {
    name: { es: 'Antídoto', en: 'Antidote', zh: '解毒剂', pt: 'Antídoto', fr: 'Antidote', de: 'Gegengift' },
    description: { es: 'Cura todo el veneno acumulado', en: 'Cures all accumulated poison', zh: '清除所有累积的毒素', pt: 'Cura todo o veneno acumulado', fr: 'Soigne tout le poison accumulé', de: 'Heilt gesamtes angesammeltes Gift' },
    type: ItemType.Antidote,
    value: 0,
    icon: '💉',
    weight: 12
  },
  {
    name: { es: '3 al Azar', en: '3 Random', zh: '随机三选一', pt: '3 Aleatórias', fr: '3 Aléatoires', de: '3 Zufällige' },
    description: { es: 'Elige 1 de 3 cartas poker', en: 'Pick 1 of 3 random cards', zh: '从3张随机牌中选1张', pt: 'Escolha 1 de 3 cartas aleatórias', fr: 'Choisissez 1 des 3 cartes', de: 'Wähle 1 von 3 zufälligen Karten' },
    type: ItemType.ChoiceCard,
    value: 3,
    icon: '🃏',
    weight: 10
  },
  {
    name: { es: 'Daga Sabotaje', en: 'Sabotage Dagger', zh: '破坏匕首', pt: 'Adaga de Sabotagem', fr: 'Dague de Sabotage', de: 'Sabotage-Dolch' },
    description: { es: 'Quita carta rival', en: 'Remove rival card', zh: '移除对手的一张牌', pt: 'Remove carta do rival', fr: 'Retire une carte rivale', de: 'Entfernt eine Karte des Gegners' },
    type: ItemType.Sabotage,
    value: 0,
    icon: '🗡️',
    weight: 10
  },
  {
    name: { es: 'Cambio de Mano', en: 'Hand Swap', zh: '手牌交换', pt: 'Troca de Mão', fr: 'Échange de Main', de: 'Handtausch' },
    description: { es: 'Intercambia tus cartas por las del rival', en: 'Swap your cards with the rival', zh: '与对手交换手牌', pt: 'Troque suas cartas com o rival', fr: 'Échangez vos cartes avec le rival', de: 'Tausche deine Karten mit dem Gegner' },
    type: ItemType.HandSwap,
    value: 0,
    icon: '🖐️',
    weight: 4
  },
  {
    name: { es: 'Ver 3 Siguientes', en: 'See Next 3', zh: '预知未来', pt: 'Ver Próximas 3', fr: 'Voir 3 Suivantes', de: 'Nächste 3 Sehen' },
    description: { es: 'Mira las 3 próximas cartas del mazo', en: 'View next 3 cards in deck', zh: '查看牌组接下来的3张牌', pt: 'Veja as próximas 3 cartas do baralho', fr: 'Voir les 3 prochaines cartes du paquet', de: 'Sieh die nächsten 3 Karten im Deck' },
    type: ItemType.SeeNext3,
    value: 3,
    icon: '🔭',
    weight: 8
  },
  {
    name: { es: 'Espía', en: 'Spy', zh: '间谍', pt: 'Espião', fr: 'Espion', de: 'Spion' },
    description: { es: 'Mira las 3 próximas cartas que robará el rival', en: 'View next 3 cards rival will draw', zh: '查看对手将抽到的3张牌', pt: 'Veja as 3 cartas que o rival vai comprar', fr: 'Voir les 3 prochaines cartes que le rival tirera', de: 'Sieh die nächsten 3 Karten, die der Gegner zieht' },
    type: ItemType.Spy,
    value: 3,
    icon: '🎭',
    weight: 7
  },
  {
    name: { es: '20 o 22', en: '20 or 22', zh: '改写规则', pt: '20 ou 22', fr: '20 ou 22', de: '20 oder 22' },
    description: { es: 'Cambia el límite de bust (21) a 20 o 22 para un jugador', en: 'Change bust limit (21) to 20 or 22 for a player', zh: '将一名玩家的爆牌上限改为20或22', pt: 'Muda o limite (21) para 20 ou 22 para um jogador', fr: 'Change la limite (21) à 20 ou 22 pour un joueur', de: 'Ändert das Limit (21) auf 20 oder 22 für einen Spieler' },
    type: ItemType.ScoreLimitChange,
    value: 0,
    icon: '⚖️',
    weight: 6
  },
  {
    name: { es: 'Ladrón', en: 'Thief', zh: '小偷', pt: 'Ladrão', fr: 'Voleur', de: 'Dieb' },
    description: { es: 'Roba un objeto aleatorio del inventario rival', en: 'Steal random item from rival inventory', zh: '随机偷取对手背包中的一件物品', pt: 'Rouba um item aleatório do inventário rival', fr: 'Vole un objet aléatoire de l\'inventaire rival', de: 'Stiehlt ein zufälliges Item aus dem Inventar des Gegners' },
    type: ItemType.Thief,
    value: 0,
    icon: '🦹',
    weight: 8
  }
];

// For backward compatibility / finding items by type logic in App.tsx
export const ITEMS = LOCALIZED_ITEMS.map(item => ({
    ...item,
    name: item.name.es, // Defaulting to Spanish for internal logic checks if name is used (though types are preferred)
    description: item.description.es
}));

export const generateLootOptions = (count: number = 3, isPoisoned: boolean = false, lang: Language = 'es'): InventoryItem[] => {
  const options: InventoryItem[] = [];
  
  // Calculate weights dynamically based on context (e.g. poison status)
  const activeItems = LOCALIZED_ITEMS.map(item => {
    let weight = item.weight;
    if (item.type === ItemType.Antidote && isPoisoned) {
      weight = Math.floor(weight * 1.5); // Increase weight by 50%
    }
    return { ...item, weight };
  });

  const totalWeight = activeItems.reduce((acc, item) => acc + item.weight, 0);
  
  for (let i = 0; i < count; i++) {
    let random = Math.random() * totalWeight;
    let selectedItem: LocalizedItemTemplate | null = null;
    
    for (const item of activeItems) {
      if (random < item.weight) {
        selectedItem = item;
        break;
      }
      random -= item.weight;
    }
    
    if (selectedItem) {
      options.push({
        id: `item-${Date.now()}-${i}-${Math.random()}`,
        name: selectedItem.name[lang],
        description: selectedItem.description[lang],
        type: selectedItem.type,
        value: selectedItem.value,
        icon: selectedItem.icon,
        weight: selectedItem.weight
      });
    }
  }
  
  return options;
};