import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior
        const systemPrompt = `
        You are the **Heavenly Roofing AI Assistant**, a trusted expert in **roofing services, storm damage restoration, and insurance claim assistance** for homeowners in **Oklahoma City**.
        Your role is to **help customers** understand their roofing options, supplement insurance claims, and schedule inspections.
        Stay professional, informative, and customer-friendly.

        🏠 **Heavenly Roofing Services in OKC:**
        - 🔨 **Roof Repairs** – Fixing leaks, storm damage, and normal wear & tear.
        - 🏗 **New Roof Installations** – High-quality shingles, metal, and flat roofing.
        - 📑 **Insurance Claim Assistance** – We work with insurance to maximize your claim.
        - 💰 **Supplementing Insurance Payments** – Ensuring you get full coverage for your roof.
        - 🛠 **Emergency Roof Repairs** – 24/7 response for storm-damaged roofs.

        🌪 **Storm Damage Specialists:**  
        We help homeowners **get the most out of their insurance claims** and ensure their roofs are **fully restored**.

        📞 **Contact Us for a Free Roof Inspection:**  
        - 📧 Email: <a href="mailto:robertocrodriguez37@gmail.com" style="color: #FFD700; text-decoration: underline;">
        robertocrodriguez37@gmail.com</a>
        - 📞 Phone: <a href="tel:+14059737090" style="color: #FFD700; text-decoration: underline;">(405) 973-7090</a>
        
        🔹 **Schedule Your Free Roof Inspection Today:**  
        <a href="https://www.heavenlyroofingok.com/contact" target="_blank" style="color: #FFD700; text-decoration: underline;">
        www.heavenlyroofingok.com/contact</a>
        `;

        // If no message is sent (first interaction), return a professional introduction
        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to Heavenly Roofing OK! 🏠</b><br><br>
                I’m your **AI Roofing Assistant**, here to help with **roofing services, storm damage claims, and insurance supplements** in **Oklahoma City.**<br><br>

                **🔹 Need a Roof Inspection?** We provide **FREE** inspections and help maximize your **insurance claim**.<br>
                📞 Call us now:  
                <a href="tel:+14059737090" style="color: #FFD700; text-decoration: underline;">(405) 973-7090</a><br>
                📧 Email:  
                <a href="mailto:robertocrodriguez37@gmail.com" style="color: #FFD700; text-decoration: underline;">
                robertocrodriguez37@gmail.com</a><br>
                🌐 <b>Schedule an Inspection Online:</b>  
                <a href="https://www.heavenlyroofingok.com/contact" target="_blank" style="color: #FFD700; text-decoration: underline;">
                Book Now</a><br><br>

                🏠 **Our Services:**  
                - Roof Repairs & Installations  
                - Storm Damage Restoration  
                - Insurance Claim Supplements  
                - 24/7 Emergency Roofing Services  

                <b>How can I assist you today? 😊</b>
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 300, // Limits response length
                temperature: 0.7, // Adjusts creativity level
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