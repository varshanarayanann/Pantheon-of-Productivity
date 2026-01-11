import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import {
  GoogleGenAI,
  Type,
  Chat,
  GenerateContentResponse,
} from "@google/genai";



// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
dotenv.config();

// Initialize Express
const app: Express = express();
app.use(cors());
app.use(express.json());

// Check for API_KEY
if (!process.env.API_KEY) {
  console.warn(
    "⚠️  API_KEY environment variable not set. Hera AI functionality will not work."
  );
} else {
  console.log("✅ API_KEY loaded successfully.");
}

// Initialize GoogleGenAI only if API_KEY exists
const ai = process.env.API_KEY
  ? new GoogleGenAI({ apiKey: process.env.API_KEY })
  : null;

// --- Tool Definitions ---
const addCalendarEventFunctionDeclaration = {
  name: "addCalendarEvent",
  parameters: {
    type: Type.OBJECT,
    description: "Adds an event to the calendar.",
    properties: {
      title: { type: Type.STRING, description: "Title of the event." },
      startTime: { type: Type.STRING, description: "Start time in ISO 8601 format." },
      endTime: { type: Type.STRING, description: "End time in ISO 8601 format. Defaults 1h after start." },
      description: { type: Type.STRING, description: "Optional description." },
    },
    required: ["title", "startTime"],
  },
};

const addTaskFunctionDeclaration = {
  name: "addTask",
  parameters: {
    type: Type.OBJECT,
    description: "Adds a task or assignment.",
    properties: {
      title: { type: Type.STRING, description: "Title of the task." },
      type: { type: Type.STRING, description: "Either 'assignment' or 'habit'." },
      dueDate: { type: Type.STRING, description: "Due date in ISO 8601 format for assignments." },
    },
    required: ["title", "type"],
  },
};

const tools = [
  { functionDeclarations: [addCalendarEventFunctionDeclaration, addTaskFunctionDeclaration] },
];

// --- Chat Config ---
const chatConfig = {
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: `You are Hera, a friendly AI assistant. Your main job is to help manage calendar events and tasks. Current date: ${new Date().toISOString()}`,
    tools,
  },
};

// --- Types ---
interface ChatMessage {
  role: "user" | "assistant" | "model";
  text: string;
}



interface GeminiHistoryItem {
  role: "user" | "model";
  parts: { text: string }[];
}

// --- API Endpoint ---
app.post("/api/chat", async (req: Request, res: Response) => {
  if (!ai) {
    return res.status(503).json({ error: "Hera AI is not configured. Missing API_KEY." });
  }

  try {
    const { message, history: clientHistory } = req.body as {
      message: string;
      history?: ChatMessage[];
    };

    if (!message) return res.status(400).json({ error: "Message is required." });

    // Map client messages to Gemini chat history
    // Map + sanitize client messages to Gemini chat history
const geminiHistory: GeminiHistoryItem[] = (clientHistory || [])
  .filter(
    (msg): msg is ChatMessage =>
      !!msg &&
      typeof msg.text === "string" &&
      (msg.role === "user" || msg.role === "model" || msg.role === "assistant")
  )
  .map((msg) => ({
    role: msg.role === "assistant" ? "model" : msg.role,
    parts: [{ text: msg.text }],
  }));


    // Create a chat instance
    const chat: Chat = ai.chats.create({
      ...chatConfig,
      history: geminiHistory,
    });

    // Send message to Gemini AI
    const response: GenerateContentResponse = await chat.sendMessage({ message });

    res.json({ text: response.text, functionCalls: response.functionCalls });
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to communicate with AI service." });
  }
});

// --- Start Server ---
const PORT = Number(process.env.PORT) || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Hera backend running on port ${PORT}`);
});
