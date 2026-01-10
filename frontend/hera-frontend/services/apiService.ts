
import type { ChatMessage } from "../../../types";

export interface BackendResponse {
  text?: string;
  functionCalls?: any[];
}

/**
 * Sends a message to the secure backend server.
 * @param message The user's current chat message.
 * @param history The conversation history.
 * @returns A promise that resolves to an object containing either a text response or function calls.
 */
export const sendMessage = async (message: string, history: ChatMessage[]): Promise<BackendResponse> => {
  try {
    // This URL must match the address of your running backend server.
    const backendUrl = 'http://localhost:3002/api/chat';

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // FIX: Send both the new message and the conversation history to the backend.
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Server responded with an error:', response.status, errorBody);
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to send message to the backend:", error);
    // Provide a user-friendly error message
    return { text: "Sorry, I couldn't connect to my brain. Please make sure the backend server is running and try again." };
  }
};
