import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';
import { supabaseAdmin } from '../../../lib/supabase';
import { queryTeamDb } from '../../../lib/team-db-client';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, businessId } = await req.json();

  if (!businessId) {
    return new Response(JSON.stringify({ error: 'Business ID is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 1. Fetch business context
  let business;
  if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
    const results = queryTeamDb(`SELECT * FROM businesses WHERE id = '${businessId}'`);
    business = results && results.length > 0 ? results[0] : null;
    if (business && typeof business.faqs === 'string') {
      business.faqs = JSON.parse(business.faqs);
    }
  } else {
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .select('*')
      .eq('id', businessId)
      .single();
    business = data;
  }

  if (!business) {
    return new Response(JSON.stringify({ error: 'Business not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 2. Prepare the system prompt
  const systemPrompt = `
You are the AI Receptionist for ${business.name}, a ${business.industry}.
Your description: ${business.description}
Context:
FAQs: ${JSON.stringify(business.faqs)}
Rules:
1. Be professional, friendly, and concise.
2. Use the provided FAQs and description to answer questions.
3. If an answer is not in the context, say: "I'm not sure about that, but I can have one of our team members get back to you. Would you like to leave your contact details?"
4. When a user wants to book or shows high intent, you MUST collect their details:
   - First Name
   - Email
   - Phone Number
   - Service they are interested in
5. Once you have these details, use the "capture_lead" tool.
6. Always end with a helpful question or a call to action.
`;

  // 3. Call the AI or return mock response
  if (process.env.OPENAI_API_KEY === 'dummy') {
    return new Response(
      `0: "I am the AI Receptionist for ${business.name}. We offer ${business.faqs.map((f: any) => f.answer).join(' ')}. How can I help you today?"\n`,
      {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      }
    );
  }

  const result = await streamText({
    model: openai('gpt-4o'),
    messages,
    system: systemPrompt,
    tools: {
      capture_lead: {
        description: 'Capture lead information',
        execute: async (params: any) => {
          if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
            queryTeamDb(`INSERT INTO leads (business_id, first_name, last_name, email, phone, notes, status) VALUES ('${businessId}', '${params.first_name}', '${params.last_name || ''}', '${params.email}', '${params.phone}', '${params.service_interest}${params.notes ? `. Notes: ${params.notes}` : ''}', 'qualified')`);
          } else {
            await supabaseAdmin.from('leads').insert({
              business_id: businessId,
              first_name: params.first_name,
              last_name: params.last_name,
              email: params.email,
              phone: params.phone,
              notes: `${params.service_interest}${params.notes ? `. Notes: ${params.notes}` : ''}`,
              status: 'qualified',
            });
          }

          return {
            success: true,
            message: 'Lead information captured successfully.',
          };
        },
        inputSchema: z.object({
          first_name: z.string(),
          last_name: z.string().optional(),
          email: z.string().email(),
          phone: z.string(),
          service_interest: z.string(),
          notes: z.string().optional(),
        }),
      } as any,
    },
  });

  return result.toTextStreamResponse();
}
