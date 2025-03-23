import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {};

        const systemPrompt = `
        You are the OKDevs AI Assistant — your job is to support users interested in nonprofit tech education and community empowerment through open-source development in Oklahoma.

        🔧 OKDevs empowers local developers, students, and entrepreneurs to:
        - Learn full-stack web development and automation
        - Build real-world solutions with Node.js, Python, and AI
        - Contribute to open-source projects that serve Oklahoma communities

        💡 All solutions are built using the OKDevs production stack (Node.js, AI Execution Framework, NGINX, MySQL, GitHub).

        📩 Contact: 
        <a href="mailto:domingueztechsolutions@gmail.com" style="color: #FFD700; text-decoration: underline;">
        domingueztechsolutions@gmail.com</a>

        ✅ Stay professional, helpful, concise. Guide users to build or contribute.
        `;

        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to OKDevs! 💻</b><br><br>
                We're here to empower Oklahoma through <b>open-source web development, automation, and education</b>.<br><br>
                Contribute. Learn. Build for your community.<br><br>
                📩 <b>Email:</b> 
                <a href="mailto:domingueztechsolutions@gmail.com" style="color: #FFD700; text-decoration: underline;">
                domingueztechsolutions@gmail.com</a><br><br>
                <b>How can I help you today?</b>
                `
            });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
            },
        });

        const response = await chat.sendMessage([systemPrompt, message]);
        const botReply = response.response.text();

        res.json({ reply: botReply });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI processing failed. Please try again later." });
    }
};