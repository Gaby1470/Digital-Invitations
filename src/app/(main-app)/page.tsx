import Link from 'next/link';

export default function Home() {
  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-40 overflow-hidden bg-slate-50 dark:bg-gray-950">
      {/* Soft decorative background gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 dark:bg-purple-900"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 dark:bg-pink-900"></div>
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-20 dark:bg-indigo-900"></div>

      <div className="container relative px-4 md:px-6 mx-auto">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          {/* Left Column: Text Content */}
          <div className="flex flex-col justify-center space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-block rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300">
                ✨ Elevate Your Events
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-500">Unforgettable</span> Digital Invitations
              </h1>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-lg lg:text-xl dark:text-gray-400 lg:mx-0">
                Design and share beautiful, animated invitations for any occasion. Choose a stunning template, customize it to your style, and instantly delight your guests.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="/templates"
                className="inline-flex h-14 items-center justify-center rounded-full bg-indigo-600 px-8 text-lg font-medium text-white shadow-lg shadow-indigo-500/30 transition-all hover:bg-indigo-700 hover:shadow-indigo-500/50 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
              >
                Explora Plantillas
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex h-14 items-center justify-center rounded-full border-2 border-gray-200 bg-transparent px-8 text-lg font-medium text-gray-900 transition-colors hover:bg-gray-50 hover:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:border-gray-800 dark:text-gray-50 dark:hover:bg-gray-800 dark:hover:border-gray-700"
              >
                Como funciona?
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Mockup */}
          <div className="mx-auto w-full max-w-[450px] lg:max-w-none relative pt-8 lg:pt-0">
            {/* Main Invitation Card */}
            <div className="relative z-10 w-full max-w-[380px] mx-auto aspect-[3/4] rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 dark:bg-gray-900 rotate-[-2deg] transition-transform hover:rotate-0 duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-pink-50/50 dark:from-indigo-950/20 dark:to-pink-950/20"></div>
              <div className="p-8 h-full flex flex-col items-center justify-center text-center space-y-6 relative">
                <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/50 flex items-center justify-center mb-2 shadow-sm">
                  <span className="text-3xl">💍</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-3xl font-serif text-gray-900 dark:text-white">Sarah & James</h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Are getting married</p>
                </div>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-700 my-4"></div>
                <p className="text-gray-500 dark:text-gray-400 text-sm px-4">Join us to celebrate our special day with friends and family.</p>
                <div className="mt-4 px-6 py-2.5 rounded-full bg-gray-900 text-white text-sm font-medium dark:bg-white dark:text-gray-900 w-full shadow-md">
                  Open Invitation
                </div>
              </div>
            </div>
            
            {/* Decorative Background Card 1 */}
            <div className="absolute top-12 right-[-5%] lg:right-[5%] z-0 w-[300px] aspect-[3/4] rounded-3xl bg-pink-100 shadow-xl opacity-60 rotate-[8deg] dark:bg-pink-900/30 blur-[1px]"></div>
            
            {/* Decorative Background Card 2 */}
            <div className="absolute top-20 left-[-5%] lg:left-[5%] z-0 w-[280px] aspect-[3/4] rounded-3xl bg-indigo-100 shadow-xl opacity-50 rotate-[-10deg] dark:bg-indigo-900/30 blur-[1px]"></div>
          </div>

        </div>
      </div>
    </section>
  );
}