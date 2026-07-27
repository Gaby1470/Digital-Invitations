// src/app/api/stripe/webhook/route.ts
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const relevantEvents = new Set([
  'checkout.session.completed',
]);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('Stripe webhook secret or signature is missing.');
    return new Response('Webhook secret not configured', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`Webhook signature verification failed: ${errorMessage}`);
    return new Response(`Webhook Error: ${errorMessage}`, { status: 400 });
  }

  if (relevantEvents.has(event.type)) {
    const supabase = createClient(cookies());
    try {
      switch (event.type) {
        case 'checkout.session.completed': {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = session.client_reference_id;

          if (!userId) {
            console.error('Checkout session completed with no user ID.');
            break;
          }

          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          const templatePriceId = process.env.TEMPLATE_PRICE_ID || 'price_template_tier_placeholder';

          let creditsToAdd = 0;
          for (const item of lineItems.data) {
            if (item.price?.id === templatePriceId) {
              creditsToAdd += item.quantity || 0;
            }
          }

          if (creditsToAdd > 0) {
            const { error } = await supabase.rpc('increment_template_credits', {
              user_id_input: userId,
              credits_to_add: creditsToAdd,
            });

            if (error) {
              console.error(`Failed to increment template credits for user ${userId}:`, error);
              return new Response(`Webhook handler failed: ${error.message}`, { status: 500 });
            }

            console.log(`Successfully added ${creditsToAdd} template credits to user ${userId}.`);
          }
          break;
        }
        default:
          throw new Error('Unhandled relevant event!');
      }
    } catch (error) {
      console.error('Webhook handler failed.', error);
      return new Response('Webhook handler failed.', { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
