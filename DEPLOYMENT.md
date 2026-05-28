# Deploying Your Digital Invitations Website to Vercel

This guide will walk you through the process of deploying your Next.js application to Vercel. Vercel is a platform for hosting frontend applications that is highly optimized for Next.js.

## Prerequisites

1.  **A Git Repository:** Your project needs to be in a Git repository (e.g., on GitHub, GitLab, or Bitbucket). If you haven't done so already, you should commit and push all the recent changes we've made.

2.  **A Vercel Account:** You will need a Vercel account. You can sign up for a free account at [vercel.com](https://vercel.com).

## Deployment Steps

### Step 1: Create a New Vercel Project

1.  Go to your Vercel dashboard.s
2.  Click the "**Add New...**" button and select "**Project**".
3.  In the "**Import Git Repository**" section, connect Vercel to your Git provider and select the repository for this project.

### Step 2: Configure Your Project

Vercel will automatically detect that you are deploying a Next.js application and will pre-configure the build settings for you. You shouldn't need to change anything here.

### Step 3: Configure Environment Variables

This is the most important step. You need to provide Vercel with your Supabase and Stripe API keys.

1.  In the project configuration screen, open the "**Environment Variables**" section.
2.  Add the following environment variables, one by one. You can copy the values from your `.env.local` file.

    -   `NEXT_PUBLIC_SUPABASE_URL`
    -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    -   `SUPABASE_SERVICE_ROLE_KEY`
    -   `STRIPE_SECRET_KEY`
    -   `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    -   `STRIPE_WEBHOOK_SECRET`

    **IMPORTANT:** Make sure you are using your **production** keys from Stripe, not your test keys.

### Step 4: Deploy

1.  Click the "**Deploy**" button.
2.  Vercel will now build and deploy your application. You can monitor the progress in the build logs.

### Step 5: Configure the Stripe Webhook

Once your application is deployed, Vercel will give you a public URL (e.g., `https://your-project-name.vercel.app`). You need to provide this URL to Stripe for the webhook to work.

1.  Go to your Stripe Dashboard and navigate to the "**Webhooks**" section.
2.  Create a new webhook endpoint.
3.  For the "**Endpoint URL**", enter `https://your-project-name.vercel.app/api/stripe/webhook`.
4.  For the "**Events to send**", select `checkout.session.completed`.
5.  Click "**Add endpoint**". Stripe will now give you a **webhook signing secret**.
6.  Go back to your Vercel project settings, find the `STRIPE_WEBHOOK_SECRET` environment variable, and update it with the new signing secret from Stripe.
7.  **Redeploy** your Vercel project to apply the new environment variable.

That's it! Your digital invitations website is now live on Vercel.
