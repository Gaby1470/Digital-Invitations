import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// IMPORTANT: Use the service_role key for admin-level access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  const signingSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !signingSecret) {
    return new NextResponse(JSON.stringify({ error: 'Missing Stripe signature or webhook secret' }), { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const body = await req.text();
    event = stripe.webhooks.constructEvent(body, sig, signingSecret);
  } catch (err: any) {
    console.error(`Error verifying webhook signature: ${err.message}`);
    return new NextResponse(JSON.stringify({ error: { message: `Webhook Error: ${err.message}` } }), { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const planId = subscription.items.data[0].price.id;

        if (!userId) {
          throw new Error('User ID not found in session metadata');
        }

        // Update the user's profile with their new plan and Stripe customer ID
        const { error } = await supabaseAdmin
          .from('profiles') // Assuming you have a 'profiles' table linked to 'auth.users'
          .update({ 
            plan: planId,
            stripe_customer_id: session.customer 
          })
          .eq('id', userId);
        
        if (error) {
          throw new Error(`Failed to update user profile: ${error.message}`);
        }

        break;
      }
      // TODO: Handle other important events
      // case 'customer.subscription.deleted':
      // case 'customer.subscription.updated':
      //   // Handle subscription changes
      //   break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (err: any) {
    console.error(`Error handling webhook event: ${err.message}`);
    return new NextResponse(JSON.stringify({ error: { message: 'Webhook handler failed' } }), { status: 500 });
  }
}
