This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## For Developers

### Manually Adding Template Credits for Testing

To test features related to paid plans without setting up a full payment flow, you can manually assign a "template credit" to any user directly in the Supabase database.

1.  **Navigate to Your Supabase Project:**
    *   Open your project dashboard on [supabase.com](https://supabase.com).

2.  **Go to the Table Editor:**
    *   In the left sidebar, find and click on the **Table Editor** icon.

3.  **Edit the User's Profile:**
    *   Select the `profiles` table from the list.
    *   Find the row corresponding to the user you want to give a credit to. You can identify them by their `id` or other personal details if you have added them.
    *   Click the `Edit row` button.

4.  **Assign the Credit and Plan:**
    *   Set the `plan` column to: `'single_tier'`
    *   Set the `template_credits` column to: `1`

5.  **Save the Changes.**

The user will now have a credit and will be on the plan that consumes credits for publishing invitations, allowing you to test the complete workflow.
