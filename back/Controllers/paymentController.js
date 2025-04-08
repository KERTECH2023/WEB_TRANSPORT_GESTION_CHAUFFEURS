const Stripe = require('stripe');
const dotenv = require('dotenv');
dotenv.config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.processPayment = async (req, res) => {
  const { token, amount } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ success: false, message: "Token et montant sont requis." });
  }

  try {
    const charge = await stripe.charges.create({
      amount: Math.round(amount * 100), // En centimes
      currency: 'eur',
      source: token,
      description: `Paiement de ${amount} € via Stripe`,
    });

    res.status(200).json({ success: true, message: 'Paiement réussi', charge });
  } catch (error) {
    console.error("Erreur de paiement Stripe:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
