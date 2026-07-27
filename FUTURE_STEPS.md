# Future Steps: Implementing Stripe Payments

This document outlines the necessary steps to fully integrate Stripe for payment processing, allowing users to purchase template credits.

### 1. Set Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist) and add the following variables. You will get these values from your Stripe Dashboard.

```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
TEMPLATE_PRICE_ID=price_...
```

### 2. Find Your Stripe API Keys

1.  Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2.  Navigate to the **Developers** section, then **API keys**.
3.  Copy the **Secret key** and use it for the `STRIPE_SECRET_KEY` variable.
4.  Copy the **Publishable key** and use it for the `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` variable.

*Note: Use test keys for development and live keys for production.*

### 3. Create a Product and Price in Stripe

Your application needs to know what product the user is purchasing.

1.  In your Stripe Dashboard, go to the **Products** catalog.
2.  Click **+ Add product**.
3.  Fill in the product details:
    *   **Name:** e.g., "Invitation Template Credit"
    *   **Description:** (Optional)
4.  After creating the product, you'll be prompted to add a price.
    *   **Pricing model:** Select **Standard**.
    *   **Price:** Enter the amount (e.g., $10.00).
    *   **Billing period:** Select **One time**.
5.  Save the price.
6.  On the price details page, find the **API ID** (it looks like `price_...`). Copy this ID and set it as your `TEMPLATE_PRICE_ID` environment variable.

### 4. Set Up the Stripe Webhook

The webhook is crucial for Stripe to communicate back to your application and confirm that a payment was successful.

#### For Development:

Using the [Stripe CLI](https://stripe.com/docs/stripe-cli) is the recommended way to test webhooks locally.

1.  Install the Stripe CLI and log in.
2.  Run the following command in your terminal:
    ```bash
    stripe listen --forward-to localhost:3000/api/stripe/webhook
    ```
3.  The CLI will print a webhook signing secret to the console (it starts with `whsec_...`).
4.  Copy this secret and use it for your `STRIPE_WEBHOOK_SECRET` environment variable.

#### For Production:

1.  In your Stripe Dashboard, go to **Developers** > **Webhooks**.
2.  Click **+ Add endpoint**.
3.  Set the **Endpoint URL** to `https://<your-domain>/api/stripe/webhook`.
4.  Click **+ Select events** and choose the `checkout.session.completed` event.
5.  Click **Add endpoint**.
6.  On the endpoint's details page, under **Signing secret**, click **Reveal**.
7.  Copy the secret and set it as the `STRIPE_WEBHOOK_SECRET` in your production environment variables.

---

Once these steps are completed, the payment functionality implemented in the codebase will be fully operational.
