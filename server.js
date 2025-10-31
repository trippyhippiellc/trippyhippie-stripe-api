// server.js
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const app = express();

// ADD THESE TWO LINES
app.use(cors());
app.use(express.json());   // THIS WAS MISSING

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount < 0.50) {
    return res.status(400).json({ error: 'Amount must be at least $0.50' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });

    res.json({ client_secret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
