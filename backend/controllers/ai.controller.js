const { GoogleGenerativeAI } = require("@google/generative-ai");
const ChatHistory = require("../models/ChatHistory.model");

console.log("Gemini Key Loaded:", !!process.env.GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route POST /api/ai/chat
const chat = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        message: "Question is required.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

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

    const result = await model.generateContent(
      `${systemPrompt}\n\nUser Question: ${question}`
    );

    const response = result.response.text();

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
    console.error("========== GEMINI ERROR ==========");
    console.error(err);
    console.error("==================================");

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
    console.error(err);
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
      message: "Chat history cleared",
    });
  } catch (err) {
    console.error(err);
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