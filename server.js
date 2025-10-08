import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

// Use a mock key if not set
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mockkey1234567890';
const stripe = new Stripe(stripeSecretKey);

const app = express();

// Configure CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));

app.use(express.json());

app.options('/api/auth/google', cors());

// Google OAuth2 endpoint
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code } = req.body;
    // Here you would exchange the code for tokens with Google
    // For now, we'll just return a success response
    res.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// YouTube analytics endpoint
app.get('/api/youtube/analytics', async (req, res) => {
  try {
    // Mock data for now
    res.json({
      channel: {
        title: "Your Channel",
        subscriberCount: 1000,
        viewCount: 50000
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { planType, isYearly, priceId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, // Use the actual price ID from your Stripe dashboard
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL || 'http://localhost:5173'}/checkout/${planType}`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Onboarding email endpoint
app.post('/api/onboarding-email', async (req, res) => {
  const data = req.body;
  // Prepare email content
  const subject = 'New Brand Onboarding Application';
  const text = `Brand Name: ${data.name}\nIndustry: ${data.industry}\nBudget: ${data.budgetRange}\nTarget Age: ${data.ageRange}\n\nSocial Media:\nYouTube: ${data.socialMedia?.youtube} (Verified: ${data.youtubeVerified ? 'Yes' : 'No'})\nTikTok: ${data.socialMedia?.tiktok}\nFacebook: ${data.socialMedia?.facebook}\nSnapchat: ${data.socialMedia?.snapchat}`;

  // If SMTP is not set up, just log and return success
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('Onboarding application:', text);
    return res.json({ success: true, message: 'Email sending not configured yet, but data received.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 465,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'hi@creatorflowai.app',
      subject,
      text,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Nodemailer error:', err);
    res.status(500).json({ success: false, error: 'Failed to send email.' });
  }
});

// Helper to calculate platform fee
function calculatePlatformFee(amountInCents) {
  return amountInCents < 100000 ? Math.round(amountInCents * 0.095) : Math.round(amountInCents * 0.08);
}

// Endpoint to create Stripe Connect account and onboarding link
app.post('/api/stripe/create-account-link', async (req, res) => {
  try {
    // 1. Create a Stripe Connect account (type: 'standard')
    const account = await stripe.accounts.create({ type: 'standard' });
    // 2. Create an onboarding link for the account
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: process.env.STRIPE_REFRESH_URL || 'http://localhost:5173/creator-dashboard',
      return_url: process.env.STRIPE_RETURN_URL || 'http://localhost:5173/creator-dashboard',
      type: 'account_onboarding',
    });
    // 3. Return the onboarding URL and accountId (store accountId in DB after onboarding in production)
    res.json({ url: accountLink.url, stripeAccountId: account.id });
  } catch (err) {
    console.error('Stripe Connect error:', err);
    res.status(500).json({ error: 'Failed to create Stripe Connect onboarding link.' });
  }
});

// Endpoint to create a PaymentIntent for a creator payout
app.post('/api/stripe/payment-intent', async (req, res) => {
  const { amountInCents, stripeAccountId } = req.body;
  if (!amountInCents || !stripeAccountId) {
    return res.status(400).json({ error: 'Missing amount or Stripe account ID.' });
  }
  try {
    // Optionally, check if the account is connected/valid (mock for now)
    // In production, fetch from DB and check onboarding status
    // Create the PaymentIntent with transfer_data and application_fee_amount
    const platformFee = calculatePlatformFee(amountInCents);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
      transfer_data: { destination: stripeAccountId },
      application_fee_amount: platformFee,
    });
    res.json({ client_secret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe PaymentIntent error:', err);
    res.status(500).json({ error: 'Failed to create payment.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 