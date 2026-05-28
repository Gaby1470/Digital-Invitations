'use client';

import { useState } from 'react';
import { getStripe } from '@/lib/stripe-client';

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  // IMPORTANT: Replace these with your actual Price IDs from your Stripe dashboard
  const tiers = [
    {
      name: 'Template',
      priceId: 'price_template_tier_placeholder', // This is a placeholder
      price: '$899 MXN',
      description: 'Choose one of our beautiful templates and customize it to your liking.',
      features: [
        'Access to all templates',
        'Up to 150 guests',
        'Remove branding',
        'Advanced analytics',
      ],
      cta: 'Get Started',
      primary: true,
    },
    {
      name: 'Custom',
      priceId: 'contact', // Special case for contact
      price: '$1499 MXN',
      description: 'A unique design tailored to your event. We will work with you to create a one-of-a-kind invitation.',
      features: [
        'Everything in Template, plus:',
        'Custom design',
        'Dedicated support',
        'Unlimited revisions',
      ],
      cta: 'Contact Us',
      primary: false,
    },
  ];

  const handleCheckout = async (priceId: string) => {
    if (priceId === 'contact') {
      window.location.href = 'mailto:sales@digital-invitations.com';
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ priceId }),
      });

      const { sessionId } = await res.json();
      if (!sessionId) {
        throw new Error('Could not create checkout session');
      }

      const stripe = await getStripe();
      if (!stripe) {
        throw new Error('Could not connect to Stripe');
      }

      await stripe.redirectToCheckout({ sessionId });
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the perfect plan for your event
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            Simple and transparent pricing.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-3xl p-8 shadow-lg ring-1 ${
                tier.primary
                  ? 'ring-gray-900 bg-gray-900 text-white'
                  : 'ring-gray-200 bg-white'
              }`}
            >
              <h2 className={`text-lg font-semibold ${tier.primary ? 'text-white' : 'text-gray-900'}`}>
                {tier.name}
              </h2>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight">
                  {tier.price}
                </span>
              </p>
              <p className={`mt-6 text-sm ${tier.primary ? 'text-gray-300' : 'text-gray-600'}`}>
                {tier.description}
              </p>
              <ul
                role="list"
                className={`mt-8 space-y-3 text-sm ${tier.primary ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className={`h-6 w-5 flex-none ${tier.primary ? 'text-white' : 'text-gray-900'}`}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(tier.priceId)}
                disabled={loading}
                className={`mt-10 block w-full rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.primary
                    ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900'
                } disabled:opacity-50`}
              >
                {loading ? 'Processing...' : tier.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
