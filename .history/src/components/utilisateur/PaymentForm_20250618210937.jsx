app.post('/api/payment/paypal/create-order', async (req, res) => {
  const { reservationId } = req.body;
  // créer commande via l’API PayPal, récupérer orderID
  const orderID = await createPaypalOrder(reservationId);
  res.json({ orderID });
});


export default PaymentForm;
