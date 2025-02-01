import { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { generateCareCoachPrompt } from "@/lib/prompts/care-coach-prompt";
import { Message, PatientData, RawPatientData, RawPrescription } from "@/lib/types/message-types";
import { promises as fs } from 'fs';
import path from 'path';
import { processLLMResponse, ResponseProcessingError } from "@/lib/middleware/response-processor";
import { AI_CONFIG, DATA_CONFIG } from "@/lib/config/constants";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

// Get the Gemini Pro model
const model = genAI.getGenerativeModel({ model: AI_CONFIG.MODEL_NAME }); // gemini-pro

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

async function getPatientDataFromFile(patientId: string): Promise<PatientData | null> {
  try {
    const jsonPath = path.join(process.cwd(), 'lib', DATA_CONFIG.PATIENT_DATA_FILENAME);
    const fileContents = await fs.readFile(jsonPath, 'utf8');
    const rawData = JSON.parse(fileContents);
    
    if (!Array.isArray(rawData)) {
      console.error('File content is not an array');
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const patient = rawData.find((data: RawPatientData) => data.user_id === patientId);
    if (!patient) return null;

    if (!patient.user_id || !patient.vertical || !patient.message_history) {
      console.warn('Invalid patient data format:', patientId);
      return null;
    }

    // Parse prescription history if it's a string
    const prescriptionHistory = typeof patient.prescription_history === 'string'
      ? JSON.parse(patient.prescription_history)
      : patient.prescription_history || [];

    return {
      ...patient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prescription_history: prescriptionHistory.map((prescription: RawPrescription) => ({
        subscription_id: prescription.subscription_id || '',
        subscription_created_at: prescription.subscription_created_at || '',
        primary_simplified_title: prescription.primary_simplified_title || '',
        title: prescription.title || '',
        level_2: prescription.level_2 || '',
      }))
    };
  } catch (error) {
    console.error('Error reading patient data:', error);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log("Starting generate request...");
    const { messageHistory, patientId } = await req.json();

    // Get patient data to access prescription history
    const patient = await getPatientDataFromFile(patientId);
    if (!patient) {
      return new Response(
        JSON.stringify({ 
          error: "Patient not found",
          details: "Could not find patient data in the database" 
        }), 
        { status: 404 }
      );
    }

    // Format conversation history
    const conversationHistory = messageHistory
      .map((message: Message) => 
        `${message.sender_type === 'patient' ? 'Patient' : 'Care Coach'}: ${message.message_body}`
      )
      .join('\n\n');

    console.log("Formatted conversation history:", conversationHistory);

    // Format prescription history
    console.log("Raw prescription history:", patient.prescription_history);
    const prescriptionHistory = Array.isArray(patient.prescription_history) 
      ? patient.prescription_history
          .map(prescription => 
            `- ${prescription.subscription_created_at}: ${prescription.primary_simplified_title}\n  ${prescription.title}\n  Category: ${prescription.level_2}`
          )
          .join('\n\n')
      : '';

    // Generate prompt and get LLM response
    const prompt = generateCareCoachPrompt(conversationHistory, prescriptionHistory);
    console.log("Generated full prompt length:", prompt.length);

    // Generate response from Gemini
    console.log("Calling Gemini API...");
    const response = await model.generateContent(prompt);
    console.log("Received raw response from Gemini");
    const result = response.response.text();
    console.log("Generated response:", result);

    if (!result) {
      return new Response(
        JSON.stringify({ 
          error: "No response generated",
          details: "The LLM model returned an empty response" 
        }), 
        { status: 500 }
      );
    }

    // Process the response using our middleware
    const { empathyResponse, clinicalResponse } = await processLLMResponse(result);

    // Return the processed responses
    return new Response(
      JSON.stringify({
        responses: [
          {
            response_id: generateId(),
            text: empathyResponse.text,
            type: empathyResponse.type
          },
          {
            response_id: generateId(),
            text: clinicalResponse.text,
            type: clinicalResponse.type
          }
        ]
      }),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'private, no-cache, no-store, must-revalidate'
        }
      }
    );

  } catch (error) {
    console.error('Error in generate route:', error);
    
    const errorResponse = {
      error: 'Failed to generate response',
      details: error instanceof ResponseProcessingError 
        ? error.details 
        : error instanceof Error 
          ? error.message 
          : 'Unknown error occurred'
    };

    return new Response(
      JSON.stringify(errorResponse),
      { 
        status: error instanceof ResponseProcessingError ? 422 : 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
