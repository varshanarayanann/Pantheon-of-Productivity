// const path = require("path");
// require("dotenv").config({ path: path.resolve(__dirname, ".env.local") });

// const express = require("express");
// const { google } = require("googleapis");
// const { JWT } = require("google-auth-library");
// const { parse, isValid, format } = require("date-fns");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const { VertexAI } = require("@google-cloud/vertexai");
// const fs = require("fs");

// const app = express();
// const port = process.env.PORT || 8080;

// // --- Configuration ---
// const CALENDAR_SERVICE_ACCOUNT_FILE = process.env.CALENDAR_SERVICE_ACCOUNT_FILE;

// console.log("CALENDAR_SERVICE_ACCOUNT_FILE:", CALENDAR_SERVICE_ACCOUNT_FILE);

// let credentials;
// try {
//   if (
//     !CALENDAR_SERVICE_ACCOUNT_FILE ||
//     !fs.existsSync(CALENDAR_SERVICE_ACCOUNT_FILE)
//   ) {
//     throw new Error(
//       `Service account key file not found: ${CALENDAR_SERVICE_ACCOUNT_FILE}`
//     );
//   }
//   console.log("Service account file exists!");
//   credentials = JSON.parse(
//     fs.readFileSync(CALENDAR_SERVICE_ACCOUNT_FILE, "utf8")
//   );
// } catch (err) {
//   console.error("Error loading service account credentials:", err);
//   process.exit(1);
// }

// const PROJECT_ID = credentials.project_id;
// const LOCATION = "us-central1";
// const CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar"];

// app.use(cors());
// app.use(bodyParser.json());

// // --- Initialize Gemini Model ---
// async function getGeminiProModel() {
//   try {
//     const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });
//     const model = vertexAI.getGenerativeModel({ model: "gemini-2.5-pro" });
//     return model;
//   } catch (error) {
//     console.error("Error initializing Gemini model:", error);
//     throw error;
//   }
// }

// let model;
// (async () => {
//   try {
//     model = await getGeminiProModel();
//     console.log("Gemini model initialized successfully");
//   } catch (err) {
//     console.error("Failed to initialize Gemini model:", err);
//   }
// })();

// // --- Calendar API Setup ---
// async function getCalendarService(userEmail) {
//   try {
//     const client = new JWT({
//       email: credentials.client_email,
//       key: credentials.private_key,
//       scopes: CALENDAR_SCOPES,
//       subject: userEmail,
//     });
//     await client.authorize();
//     return google.calendar({ version: "v3", auth: client });
//   } catch (error) {
//     console.error("Error initializing calendar service:", error);
//     throw error;
//   }
// }

// // --- Gemini Prompt (Define Persona) ---
// const SYSTEM_PROMPT = `You are a helpful calendar assistant. Your goal is to understand user requests related to scheduling, viewing, or modifying events in their Google Calendar.

// Current date and time: ${new Date().toISOString()}

// When a user asks you to perform an action, extract the necessary information and provide it in a structured JSON format.

// **IMPORTANT: When specifying date and time, ALWAYS use the format "yyyy-MM-dd HH:mm" (24-hour format).**

// **Unless the user specifies a year, ALWAYS use the current year (2025) when generating dates.**

// Available actions:
// - CREATE_EVENT: Requires 'summary', 'start_datetime', 'end_datetime', (optional 'attendees', 'description', 'location')
// - LIST_EVENTS: Requires 'start_datetime', 'end_datetime'
// - UPDATE_EVENT: Requires 'event_id', 'summary', 'start_datetime', 'end_datetime', (optional 'attendees', 'description', 'location')
// - DELETE_EVENT: Requires 'event_id'

// Examples:
// User: Schedule a meeting for tomorrow at 10 AM about the Q3 review.
// Assistant: {"action": "CREATE_EVENT", "parameters": {"summary": "Q3 review meeting", "start_datetime": "2025-09-28 10:00", "end_datetime": "2025-09-28 11:00"}}

// User: What's on my calendar for next Monday?
// Assistant: {"action": "LIST_EVENTS", "parameters": {"start_datetime": "2025-09-30 00:00", "end_datetime": "2025-09-30 23:59"}}

// If you need clarification, respond with a natural language question instead of JSON.`;

// // --- Date/Time Parsing Utility ---
// function parseDateTimeString(datetimeString) {
//   const formats = [
//     "yyyy-MM-dd HH:mm",
//     "yyyy-MM-dd HH:mm:ss",
//     "yyyy-MM-dd'T'HH:mm:ss",
//     "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'",
//     "MMMM d, yyyy HH:mm",
//     "MMMM d, yyyy h:mm a",
//   ];

//   for (const format of formats) {
//     try {
//       const parsedDate = parse(datetimeString, format, new Date());
//       if (isValid(parsedDate)) {
//         return parsedDate;
//       }
//     } catch (error) {
//       // Continue to next format
//     }
//   }

//   // Try native Date parsing as fallback
//   const nativeDate = new Date(datetimeString);
//   if (isValid(nativeDate)) {
//     return nativeDate;
//   }

//   return null;
// }

// // --- Calendar Action Functions ---
// async function createEvent(calendarService, parameters) {
//   try {
//     const startDateTime = parseDateTimeString(parameters.start_datetime);
//     const endDateTime = parseDateTimeString(parameters.end_datetime);

//     if (!startDateTime || !endDateTime) {
//       return {
//         success: false,
//         message: `Error: Could not parse datetime. Start: ${parameters.start_datetime}, End: ${parameters.end_datetime}`,
//       };
//     }

//     const event = {
//       summary: parameters.summary,
//       start: {
//         dateTime: startDateTime.toISOString(),
//         timeZone: "America/New_York", // Changed from UTC to Eastern Time
//       },
//       end: {
//         dateTime: endDateTime.toISOString(),
//         timeZone: "America/New_York",
//       },
//       description: parameters.description || "",
//       location: parameters.location || "",
//     };

//     // Add attendees if provided
//     if (parameters.attendees && Array.isArray(parameters.attendees)) {
//       event.attendees = parameters.attendees.map((email) => ({ email }));
//     }

//     console.log("Creating event:", event);

//     const eventResult = await calendarService.events.insert({
//       calendarId: "primary",
//       requestBody: event,
//     });

//     return {
//       success: true,
//       message: `Event created successfully: "${parameters.summary}" on ${format(
//         startDateTime,
//         "MMMM d, yyyy"
//       )} at ${format(startDateTime, "h:mm a")}`,
//       eventId: eventResult.data.id,
//     };
//   } catch (error) {
//     console.error("Error creating event:", error);
//     return {
//       success: false,
//       message: `Error creating event: ${error.message}`,
//     };
//   }
// }

// async function listEvents(calendarService, parameters) {
//   try {
//     const startDateTime = parseDateTimeString(parameters.start_datetime);
//     const endDateTime = parseDateTimeString(parameters.end_datetime);

//     if (!startDateTime || !endDateTime) {
//       return {
//         success: false,
//         message: "Error: Could not parse start or end datetime.",
//       };
//     }

//     const eventsResult = await calendarService.events.list({
//       calendarId: "primary",
//       timeMin: startDateTime.toISOString(),
//       timeMax: endDateTime.toISOString(),
//       maxResults: 20,
//       singleEvents: true,
//       orderBy: "startTime",
//     });

//     const events = eventsResult.data.items;

//     if (!events || events.length === 0) {
//       return {
//         success: true,
//         message: "No events found for the specified time period.",
//       };
//     }

//     const eventList = events.map((event) => {
//       const start = event.start.dateTime || event.start.date;
//       const startDate = new Date(start);
//       const formattedTime = isValid(startDate)
//         ? format(startDate, "h:mm a")
//         : start;
//       return `• ${event.summary} - ${formattedTime}`;
//     });

//     return {
//       success: true,
//       message: `Here are your events:\n${eventList.join("\n")}`,
//     };
//   } catch (error) {
//     console.error("Error listing events:", error);
//     return {
//       success: false,
//       message: `Error listing events: ${error.message}`,
//     };
//   }
// }

// // --- Gemini Interaction Function ---
// async function interactWithGemini(userMessage) {
//   try {
//     if (!model) {
//       throw new Error("Gemini model not initialized");
//     }

//     const request = {
//       contents: [
//         {
//           role: "user",
//           parts: [
//             { text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}\nAssistant:` },
//           ],
//         },
//       ],
//     };

//     console.log("Sending request to Gemini...");
//     const response = await model.generateContent(request);

//     let responseText = "No response from Gemini.";

//     if (response?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
//       responseText =
//         response.response.candidates[0].content.parts[0].text.trim();
//     } else {
//       console.warn("Gemini response missing expected properties:", response);
//     }

//     return responseText;
//   } catch (error) {
//     console.error("Error interacting with Gemini:", error);
//     throw error;
//   }
// }

// // --- Main API Endpoint ---
// app.post("/chat", async (req, res) => {
//   try {
//     const userMessage = req.body.message;
//     const userEmail = req.body.userEmail || "ar2764@njit.edu"; // Allow email to be passed in request

//     if (!userMessage) {
//       return res.status(400).json({ error: "No message provided" });
//     }

//     console.log("User message:", userMessage);

//     // Get response from Gemini
//     const geminiResponse = await interactWithGemini(userMessage);
//     console.log("Gemini response:", geminiResponse);

//     let finalResponse;

//     // Try to parse as JSON (structured response)
//     try {
//       const actionData = JSON.parse(geminiResponse);
//       const action = actionData.action;
//       const parameters = actionData.parameters || {};

//       console.log("Parsed action:", action, "Parameters:", parameters);

//       // Get calendar service
//       const calendarService = await getCalendarService(userEmail);
//       let calendarResult;

//       // Execute the action
//       switch (action) {
//         case "CREATE_EVENT":
//           calendarResult = await createEvent(calendarService, parameters);
//           break;
//         case "LIST_EVENTS":
//           calendarResult = await listEvents(calendarService, parameters);
//           break;
//         case "UPDATE_EVENT":
//           // TODO: Implement updateEvent function
//           calendarResult = {
//             success: false,
//             message: "Update event not implemented yet",
//           };
//           break;
//         case "DELETE_EVENT":
//           // TODO: Implement deleteEvent function
//           calendarResult = {
//             success: false,
//             message: "Delete event not implemented yet",
//           };
//           break;
//         default:
//           calendarResult = { success: false, message: "Unknown action" };
//       }

//       finalResponse = calendarResult.message;
//     } catch (jsonError) {
//       // Not JSON, treat as natural language response
//       console.log("Response is natural language, not JSON");
//       finalResponse = geminiResponse;
//     }

//     return res.json({ response: finalResponse });
//   } catch (error) {
//     console.error("Error in /chat route:", error);
//     return res.status(500).json({
//       error: "Internal server error",
//       response: `Sorry, I encountered an error: ${error.message}`,
//     });
//   }
// });

// // Health check endpoint
// app.get("/health", (req, res) => {
//   res.json({ status: "OK", timestamp: new Date().toISOString() });
// });

// app.listen(port, () => {
//   console.log(`Calendar chatbot server listening on port ${port}`);
// });

// module.exports = app;
