const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3001; // Use provided port or default to 3001

app.use(cors());
app.use(bodyParser.json()); // Parse incoming JSON bodies

// Define routes
app.post('/', (req, res) => {
  const amount = req.body.amount;

  const options = {
    url: 'https://payments.yoco.com/api/checkouts',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOCO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    json: true,
    body: {
      "amount": amount, // Use the amount from the request body
      "currency": "ZAR"
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred while making the request to the Yoco API.');
    } else {
      console.log(`Yoco API response status: ${response.statusCode}`);
      console.log(body); // Log the JSON response
      res.send(body);
    }
  });
});

app.post('/webhook', (req, res) => {
  const options = {
    url: 'https://payments.yoco.com/api/webhooks',
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOCO_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    json: true,
    body: {
      "name": "payhook",
      "url": process.env.WEBHOOK_URL // Use environment variable for webhook URL
    }
  };

  request(options, (error, response, body) => {
    if (error) {
      console.error(error);
      res.status(500).send('An error occurred while making the request to the Yoco API.');
    } else {
      res.send(body)
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
