const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const crypto = require('crypto')

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

app.use(express.json());

const privateKey = process.env.PAYENGINE_PRIVATE_KEY;
const keyObject = crypto.createPrivateKey(privateKey);
const publicKey = keyObject.export({ type: 'spki', format: 'pem' });

app.post('/api/onboard', async (req, res) => {
  try {
    const { name, email } = req.body;

    const payEngineRes = await axios.post(
      'https://console.payengine.dev/api/merchant/onboard',
      {
        name,
        email,
      },
      {
        headers: {
          Authorization: `Bearer ${publicKey}`
        },
      }
    );

    const id = payEngineRes.data.id;

    const query = `
      INSERT INTO users (name, email, id)
      VALUES ($1, $2, $3)
    `;
    
    await pool.query(query, [name, email, id]);

    res.status(201).json({ message:'success' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: ' error' });
  }
});

app.listen(port, () => {
    console.log(`Server is running on  ${port}`);
});
