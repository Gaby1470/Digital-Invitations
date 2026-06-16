# Deploying Your Digital Invitations Website to Netlify

This guide will walk you through deploying your Next.js application to Netlify.

## 1. Connect to Netlify

- Sign up or log in to your [Netlify](https://www.netlify.com/) account.
- From the **Sites** page, click "**Add new site**" and choose "**Import an existing project**".
- Connect to your Git provider (GitHub, GitLab, etc.) and select your project's repository.

## 2. Configure Build Settings

Netlify will automatically detect that you're using Next.js and use the settings from the `netlify.toml` file in your repository. You shouldn't need to change anything here.

- **Build command**: `next build`
- **Publish directory**: `.next`

The necessary Next.js plugin for Netlify is also specified in `netlify.toml`.

## 3. Add Environment Variables

This is a crucial step. In the Netlify project settings, find the section for environment variables (often under **Site configuration > Build & deploy > Environment**). Add the following variables:

- `NEXT_PUBLIC_SUPABASE_URL`: The URL for your Supabase project.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: The anonymous public key for your Supabase project.
- `SUPABASE_SERVICE_ROLE_KEY`: The secret service role key for your Supabase project.

You can find these keys in your Supabase project settings under **Settings > API**.

## 4. Deploy

After configuring the environment variables, trigger a deployment by clicking the "**Deploy site**" button. Netlify will start building and deploying your application.
