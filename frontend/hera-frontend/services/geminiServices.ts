// import { GoogleGenAI, Type } from "@google/genai"; // Corrected import
// import { LevelUpResponse } from "../../../../types";
// //import dotenv from "dotenv";

// //dotenv.config({ path: ".env.local" });

// const API_KEY = process.env.API_KEY;

// // The instructions state to assume API_KEY is always available.
// const ai = new GoogleGenAI({
//   apiKey: process.env.API_KEY!,
// });

// export const generateLevelUpMessage = async (
//   newLevel: number
// ): Promise<LevelUpResponse> => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: `Generate a short, powerful celebratory message and a brief motivational tip from Nike, the goddess of victory, for a user who just reached Level ${newLevel} in their goal-tracking app. 
//     The message should congratulate them on their perseverance. 
//     The tip should be a short piece of advice for their next goal.`,
//       config: {
//         responseMimeType: "application/json",
//         responseSchema: {
//           type: Type.OBJECT,
//           properties: {
//             message: {
//               type: Type.STRING,
//               description: "The celebratory message from Nike.",
//             },
//             tip: {
//               type: Type.STRING,
//               description: "The motivational tip from Nike.",
//             },
//           },
//           required: ["message", "tip"],
//         },
//       },
//     });

//     // The response text is a JSON string based on the schema
//     const responseJson = response.text;
//     const parsedResponse: LevelUpResponse = JSON.parse(responseJson);
//     return parsedResponse;
//   } catch (error: any) {
//     console.error(
//       "Error generating level up message:",
//       error.message,
//       error.stack
//     );
//     // Return a fallback response in case of an API error
//     return {
//       message: `You've reached Level ${newLevel}! The gods smile upon your progress.`,
//       tip: "Sharpen your focus and set your sights on the horizon. The path ahead is yours to conquer.",
//     };
//   }
// };

export const generateLevelUpMessage = async (newLevel: number) => {
  return {
    message: `You've reached Level ${newLevel}!`,
    tip: "Keep going!"
  };
};