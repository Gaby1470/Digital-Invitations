import Link from 'next/link';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Basic',
      price: 'Free',
      description: 'Perfect for small, personal events.',
      features: [
        'Up to 20 guests',
        'Access to standard templates',
        'Includes "Digital Invitations" branding',
      ],
      cta: 'Get Started',
      href: '/auth/signup',
      primary: false,
    },
    {
      name: 'Pro',
      price: '$19',
      description: 'For larger events and professional use.',
      features: [
        'Up to 150 guests',
        'Access to all premium templates',
        'Remove branding',
        'Advanced analytics',
        'Custom domain support',
      ],
      cta: 'Go Pro',
      href: '/auth/signup',
      primary: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For businesses and large-scale events.',
      features: [
        'Unlimited guests',
        'White-labeling & custom branding',
        'API access',
        'Dedicated support',
        'Custom feature development',
      ],
      cta: 'Contact Us',
      href: 'mailto:sales@digital-invitations.com',
      primary: false,
    },
  ];

  return (
    <div className="w-full py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Choose the perfect plan for your event
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            From small gatherings to large-scale professional events, we've got you covered.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
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
                {tier.name === 'Pro' && <span className="text-sm font-semibold">/event</span>}
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
              <Link
                href={tier.href}
                className={`mt-10 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  tier.primary
                    ? 'bg-white text-gray-900 hover:bg-gray-100 focus-visible:outline-white'
                    : 'bg-gray-900 text-white hover:bg-gray-800 focus-visible:outline-gray-900'
                }`}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
