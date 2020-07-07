const express = require('express');
const path = require('path');
const server = express();
const PORT = 3000;

const stripeApiKey = process.env.STRIPE_API_KEY
const stripe = require('stripe')(stripeApiKey); // check if its ok to have api key as a string

server.get('/', (req, res)=>{
  // res.send("<h1>hi</h1>")
  
  //stripe elements (UI)
  var stripey = Stripe(stripeApiKey);
  var elements = stripey.elements();
  
  var style = {
    base: {
      color: "#32325d",
    }
  };
  
  var card = elements.create("card", { style: style });
  card.mount("#card-element");
  
  res.sendFile(path.join(__dirname + '/index.html'));
})

server.get('/checkout', async (req, res) => {    
  //paymentIntent
  try{
    const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: {integration_check: 'accept_a_payment'},
        // Do I need to set a client_secret here??
    });
    //what is this client secret for? 
    res.json({client_secret: paymentIntent.client_secret});
  }catch(err){
    console.log('error processing payment', err)
  }

});
  
server.listen(PORT, () => {
  console.log('Running on port 3000');
});

