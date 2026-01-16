import { GoogleGenAI } from "@google/genai";
import { Card, Winner } from "../types";

// Inicialización del cliente de Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LOCAL_FALLBACKS = {
  playerWin: [
    "¡Suerte de principiante!",
    "Disfruta mientras puedas, humano.",
    "No te acostumbre a ganar aquí.",
    "Mis cartas te darán caza pronto.",
    "Un golpe afortunado, nada más."
  ],
  dealerWin: [
    "¡Toma eso! La casa nunca pierde.",
    "Demasiado fácil. ¿Eso es todo?",
    "Vuelve a intentarlo si te atreves.",
    "El destino está de mi lado hoy.",
    "Tus cálculos han fallado miserablemente."
  ],
  push: [
    "Un empate... por ahora.",
    "Pura coincidencia. No habrá otra.",
    "Nadie gana, nadie pierde. Qué aburrido.",
    "Postergamos lo inevitable."
  ],
  bust: [
    "¡Te has pasado! La avaricia te ciega.",
    "La ambición rompe el saco, ¿verdad?",
    "Calculaste mal tu destino.",
    "El 21 está lejos de tu alcance ahora."
  ]
};

const getLocalCommentary = (winner: Winner, playerScore: number): string => {
  if (playerScore > 21) {
    return LOCAL_FALLBACKS.bust[Math.floor(Math.random() * LOCAL_FALLBACKS.bust.length)];
  }
  if (winner === Winner.Player) {
    return LOCAL_FALLBACKS.playerWin[Math.floor(Math.random() * LOCAL_FALLBACKS.playerWin.length)];
  }
  if (winner === Winner.Dealer) {
    return LOCAL_FALLBACKS.dealerWin[Math.floor(Math.random() * LOCAL_FALLBACKS.dealerWin.length)];
  }
  return LOCAL_FALLBACKS.push[Math.floor(Math.random() * LOCAL_FALLBACKS.push.length)];
};

export const getDealerCommentary = async (
  winner: Winner,
  playerScore: number,
  dealerScore: number,
  round: number,
  playerHp: number,
  dealerHp: number,
  damageDealt: number,
  retryCount = 0
): Promise<string> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    let prompt = `Eres un dealer de blackjack "Jefe Final" (IA).
    Estás en una batalla de vida o muerte basada en cartas. Ambos empezaron con 40 HP.
    
    Estado Actual:
    - Ronda: ${round}
    - Tu Salud (Dealer): ${dealerHp}/40
    - Salud del Jugador: ${playerHp}/40
    
    Resultado de la última mano:
    - Ganador: ${winner === Winner.Player ? 'Jugador' : winner === Winner.Dealer ? 'Dealer (Tú)' : 'Empate'}
    - Mano Jugador: ${playerScore} ${playerScore > 21 ? '(SE PASÓ/BUST)' : ''}
    - Mano Dealer: ${dealerScore} ${dealerScore > 21 ? '(TE PASASTE/BUST)' : ''}
    - Daño infligido: ${damageDealt}
    
    Da un comentario MUY breve (máx 1 frase) y mordaz en Español.
    Si hiciste mucho daño, búrlate. Si recibiste daño, quéjate o amenaza.
    NO uses comillas.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        // Added thinkingConfig with a thinkingBudget because maxOutputTokens is set.
        thinkingConfig: { thinkingBudget: 30 },
        temperature: 1,
      }
    });

    return response.text?.trim() || getLocalCommentary(winner, playerScore);
  } catch (error: any) {
    // Si es un error de cuota (429) y no hemos reintentado, esperar y reintentar una vez
    if (error?.message?.includes('429') && retryCount < 1) {
      console.warn("Límite de cuota alcanzado. Reintentando en 2 segundos...");
      await wait(2000);
      return getDealerCommentary(winner, playerScore, dealerScore, round, playerHp, dealerHp, damageDealt, retryCount + 1);
    }

    console.error("Gemini API Error:", error);
    // Fallback local robusto
    return getLocalCommentary(winner, playerScore);
  }
};