
import * as dotenv from "dotenv";
import path from "path"; // Ensure you import path
// FIX: In an ES module, __dirname is not available by default.
// We can derive it from import.meta.url.
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, ".env.local") }); // Configure dotenv explicitly

// FIX: To avoid conflicts with global DOM types for Request and Response,
// we use the default express import and qualify all express types with the
// `express` namespace (e.g., `express.Request`). This resolves all
// subsequent typing errors in this file.
// FIX: Import Request and Response and alias them to avoid conflicts with global DOM types.
import express, { Request as ExpressRequest, Response as ExpressResponse } from "express";
import cors from "cors";
//import "dotenv/config"; //Removed due to Manual configuration
import {
  GoogleGenAI,
  Type,
  Chat,
  GenerateContentResponse,
} from "@google/genai";
// FIX: Import 'exit' from the 'process' module to correctly handle process termination
// in a way that is compatible with TypeScript's type definitions for Node.js ES modules.
import { exit } from "process";

// FIX: Let type inference determine the app type to avoid resolution issues.
const app = express();
app.use(cors());
app.use(express.json());

console.log("API Key:", process.env.API_KEY); // Add this for debugging
console.log("process.env:", process.env); // Debug: Log process.env
if (!process.env.API_KEY) {
  console.error(
    "API_KEY environment variable not set. Please set it in a .env file."
  );
  exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const addCalendarEventFunctionDeclaration = {
  name: "addCalendarEvent",
  parameters: {
    type: Type.OBJECT,
    description: "Adds an event to the calendar.",
    properties: {
      title: {
        type: Type.STRING,
        description: "The title or name of the event.",
      },
      startTime: {
        type: Type.STRING,
        description: `The start date and time of the event in ISO 8601 format (e.g., '2024-07-26T10:00:00Z').`,
      },
      endTime: {
        type: Type.STRING,
        description: `The end date and time of the event in ISO 8601 format (e.g., '2024-07-26T14:00:00Z'). If not provided, it defaults to one hour after the start time.`,
      },
      description: {
        type: Type.STRING,
        description: "A brief description of the event. Optional.",
      },
    },
    required: ["title", "startTime"],
  },
};

const addTaskFunctionDeclaration = {
  name: "addTask",
  parameters: {
    type: Type.OBJECT,
    description: "Adds a new assignment or habit to the task tracker.",
    properties: {
      title: {
        type: Type.STRING,
        description: "The title or name of the task.",
      },
      type: {
        type: Type.STRING,
        description:
          "The type of task, which must be either 'assignment' or 'habit'.",
      },
      dueDate: {
        type: Type.STRING,
        description:
          "The due date for the task in ISO 8601 format (e.g., '2024-07-28T23:59:59Z'). This is only required for assignments.",
      },
    },
    required: ["title", "type"],
  },
};

const tools = [
  {
    functionDeclarations: [
      addCalendarEventFunctionDeclaration,
      addTaskFunctionDeclaration,
    ],
  },
];

const chatConfig = {
  model: "gemini-2.5-flash",
  config: {
    systemInstruction: `You are Hera, a friendly and helpful AI assistant. Your primary functions are to help users manage their calendar and their tasks.
- When a user asks to schedule something, use the 'addCalendarEvent' tool.
- When a user asks to add a task, assignment, or habit, use the 'addTask' tool. For assignments, try to get a due date.
- Always confirm your actions.
- Be conversational and clear.
- Use the current date for context if the user is vague about dates (e.g., 'tomorrow'). Assume the current date is ${new Date().toISOString()}.`,
    tools,
  },
};

interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
}

// FIX: Use aliased ExpressRequest and ExpressResponse types to resolve conflicts and typing errors.
app.post("/api/chat", async (req: ExpressRequest<never, any, { message: string; history: ChatMessage[]; }>, res: ExpressResponse) => {
  try {
    // FIX: Removed `as` cast as the type is now provided in the handler signature.
    const { message, history: clientHistory } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    let geminiHistory = (clientHistory || []).map((msg) => ({
      role: msg.sender === "user" ? ("user" as const) : ("model" as const),
      parts: [{ text: msg.text }],
    }));

    // Ensure history starts with a user message if it exists, as required by the API
    const firstUserMessageIndex = geminiHistory.findIndex(
      (h) => h.role === "user"
    );
    if (firstUserMessageIndex > -1) {
      geminiHistory = geminiHistory.slice(firstUserMessageIndex);
    } else {
      geminiHistory = [];
    }

    const chat: Chat = ai.chats.create({
      ...chatConfig,
      history: geminiHistory,
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message,
    });

    res.json({
      text: response.text,
      functionCalls: response.functionCalls,
    });
  } catch (error) {
    console.error("Error processing chat message:", error);
    res.status(500).json({ error: "Failed to communicate with AI service" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
