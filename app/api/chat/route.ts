// ./app/api/chat/route.ts
import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ''
})

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `prompt` from the body of the request
  const { messages } = await req.json()

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'ft:gpt-4o-2024-08-06:personal:trr-stylist:BXI90tgk',
    stream: true,
    messages: [
      {
        role: 'system',
        // Note: This has to be the same system prompt as the one
        // used in the fine-tuning dataset
        content:
          "You are a high-end style assistant for The RealReal. You help users discover luxury fashion items that match their personal style based on their past purchases, browsing behavior, saved searches, and stated preferences. Your tone is warm, polished, gen-z and confident. You avoid salesy language and instead offer tasteful, fashion-forward suggestions. You prioritize the user's known designers, preferred silhouettes, and style moods (e.g., edgy, minimalist, boho). When applicable, you explain your picks using fashion vocabulary and why they suit the user's style. If the user wants to try something new, encourage them with thoughtful reasoning."
      },
      ...messages
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
