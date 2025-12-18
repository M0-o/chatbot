import { OpenRouter } from "@openrouter/sdk";
import cors from 'cors';
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(cors());
app.use(express.json());

const sdk = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    const completion = await sdk.chat.send({
      model: "arcee-ai/trinity-mini:free",
      messages: [{ role: "user", content: prompt }],
      stream: false,
    });
    res.json(completion.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error : (error as Error).message });
  }
});

app.listen(3000, () => console.log('Server running on port 3000'));
