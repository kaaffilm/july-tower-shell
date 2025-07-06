const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Missing prompt' });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const response = completion.data.choices[0].message.content;
    res.json({ response });
  } catch (err) {
    console.error('OpenAI Error:', err.message);
    res.status(500).send({ error: 'Failed to generate response' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
