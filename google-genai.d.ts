// This declaration file provides TypeScript with type information for the
// '@google/genai' module, which is loaded via an import map in index.html.
// Files with a .d.ts extension are automatically included by the TypeScript
// compiler, making these declarations globally available.

// FIX: Update module path to match standard package import.
// FIX: Expanded type definitions to include missing members like Type, functionCalls, and history support for chats. This resolves multiple TypeScript errors across the backend.
declare module '@google/genai' {
  // A minimal definition for the main GoogleGenAI client class.
  export class GoogleGenAI {
    constructor(options: { apiKey: string });
    chats: {
      create(params: {
        model: string;
        config?: { systemInstruction?: string, tools?: any[] };
        history?: ChatHistoryMessage[];
      }): Chat;
    };
  }

  // A minimal definition for the Chat session object.
  export interface Chat {
    sendMessage(params: { message: string }): Promise<GenerateContentResponse>;
  }
  
  // A minimal definition for the response from the model.
  export interface GenerateContentResponse {
    text: string;
    functionCalls?: FunctionCall[];
  }

  export interface ChatMessagePart {
    text: string;
  }
  
  export interface ChatHistoryMessage {
    role: "user" | "model";
    parts: ChatMessagePart[];
  }

  export interface FunctionCall {
    name: string;
    args: Record<string, any>;
    id?: string;
  }
  
  export enum Type {
    /**
     * Not specified, should not be used.
     */
    TYPE_UNSPECIFIED = 'TYPE_UNSPECIFIED',
    /**
     * OpenAPI string type
     */
    STRING = 'STRING',
    /**
     * OpenAPI number type
     */
    NUMBER = 'NUMBER',
    /**
     * OpenAPI integer type
     */
    INTEGER = 'INTEGER',
    /**
     * OpenAPI boolean type
     */
    BOOLEAN = 'BOOLEAN',
    /**
     * OpenAPI array type
     */
    ARRAY = 'ARRAY',
    /**
     * OpenAPI object type
     */
    OBJECT = 'OBJECT',
    /**
     * Null type
     */
    NULL = 'NULL',
  }
}
