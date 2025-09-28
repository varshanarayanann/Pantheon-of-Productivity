// This declaration file provides TypeScript with type information for the
// '@google/genai' module, which is loaded via an import map in index.html.
// Files with a .d.ts extension are automatically included by the TypeScript
// compiler, making these declarations globally available.

declare module 'https://esm.run/@google/genai' {
  // A minimal definition for the response from the model.
  export interface GenerateContentResponse {
    text: string;
  }
  
  // A minimal definition for the Chat session object.
  export interface Chat {
    sendMessage(params: { message: string }): Promise<GenerateContentResponse>;
  }

  // A minimal definition for the main GoogleGenAI client class.
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    chats: {
      create(params: {
        model: string;
        config?: { systemInstruction?: string };
      }): Chat;
    };
  }
}