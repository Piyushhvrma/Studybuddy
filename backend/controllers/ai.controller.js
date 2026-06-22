const Groq = require("groq-sdk");
const ChatHistory = require("../models/ChatHistory.model");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// @route POST /api/ai/chat
const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required.",
      });
    }

    const systemPrompt = `
You are Momentum AI Assistant, a helpful study and learning assistant.

You help students with:
- DSA
- DBMS
- OS
- OOP
- Interview Preparation
- Study Plans
- Revision Notes

Give clear, structured and concise answers.
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      temperature: 0.7,
      max_tokens: 1024,
    });

    const response =
      completion.choices?.[0]?.message?.content || "No response generated.";

    await ChatHistory.create({
      userId: req.userId,
      question,
      response,
    });

    return res.json({
      success: true,
      response,
    });
  } catch (err) {
    console.error("========== GROQ ERROR ==========");
    console.error(err);
    console.error("================================");

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// @route GET /api/ai/history
const getChatHistory = async (req, res) => {
  try {
    const history = await ChatHistory.find({
      userId: req.userId,
    }).sort({ createdAt: -1 });

    res.json({ history });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// @route DELETE /api/ai/history
const clearHistory = async (req, res) => {
  try {
    await ChatHistory.deleteMany({
      userId: req.userId,
    });

    res.json({
      message: "Chat history cleared.",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  chat,
  getChatHistory,
  clearHistory,
};