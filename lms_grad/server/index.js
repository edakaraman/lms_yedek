require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

app.post("/pay", async (req, res) => {
  try {
    const {courseName,coursePrice } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(coursePrice * 100),
      currency: "TRY", 
      payment_method_types: ["card"],
      metadata: { courseName },
    });

    const clientSecret = paymentIntent.client_secret;
    res.json({ message: "Ödeme başlatıldı", clientSecret });
  } 
  catch (err) 
  {
    if (err.code === 'amount_too_small') {
      res.status(400).json({ message: "Ödeme tutarı çok düşük. Lütfen daha yüksek bir tutar girin." });
    } else {
      console.error(err);
      res.status(500).json({ message: "İç Sunucu Hatası!" });
    }
  }
});
app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));