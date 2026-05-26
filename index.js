const express = require('express');
const app = express();
app.use(express.json());

app.use(async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  try {
    const response = await fetch('https://api.anthropic.com' + req.url, {
      method: req.method,
      headers: {
        'content-type': 'application/json',
        'x-api-key': req.headers['x-api-key'],
        'anthropic-version': '2023-06-01'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Proxy running'));
