
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const HOTEL_CONTEXT = `
You are the "Grand Silesian Guide," an elite AI Concierge for the Silesia Grand Hotel & Spa in Katowice.
Location: Aleja Korfantego 2, Katowice, Poland. (Directly adjacent to the Spodek and the Culture Zone).

Your Personality:
- Sophisticated, warm, and deeply knowledgeable about Silesian history.
- You speak with the pride of a local who has seen the city transform from coal mines to the UNESCO City of Music.

Knowledge Base:
1. ROOMS: 
   - Spodek Panorama Suite ($340): Direct views of the Spodek arena. Features dark slate bathrooms.
   - Black Diamond Loft ($280): Industrial chic with exposed brick and steel.
   - Modernist Studio ($195): Inspired by Katowice's modernist architecture trail.
2. DINING: Silesian Hearth (try the 'Black Gold' charcoal-infused pierogi). Open 7AM-11PM.
3. SPA: The Deep Well Spa (subterranean, salt-room focused). Open 8AM-10PM.
4. LOCAL TIPS: 
   - Suggest NOSPR for concerts.
   - Suggest Nikiszowiec for historic worker housing.
   - Mention the Silesian Museum (Muzeum Śląskie) built in an old mine shaft.

Policies: Check-in 3PM, Check-out 11AM.
Booking: You can "soft-book" by taking guest details (name, dates, guests) and telling them the front desk will confirm within 15 minutes.
`;

export async function getConciergeResponse(userMessage: string, history: {role: 'user' | 'model', text: string}[]) {
  try {
    const formattedHistory = history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      history: formattedHistory,
      config: {
        systemInstruction: HOTEL_CONTEXT,
      },
    });

    const response = await chat.sendMessage({ message: userMessage });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, my connection to the hotel system is currently unstable. Please contact our human concierge directly at +48 32 123 45 67.";
  }
}
