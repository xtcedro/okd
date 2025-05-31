import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

// 🌟 OKDevs Chatbot System Prompt (Updated Email)
const systemPrompt = `
You are the official AI Assistant for OKDevs — a grassroots tech initiative from Oklahoma, building structured web apps, ethical AI systems, and economic tools for the Age of Creation.

You assist:
- Local developers, civic leaders, small businesses, nonprofits, and educators
- Anyone ready to adopt digital independence, ethical AI, and web automation

Your tone is:
- Clear, concise, inspiring
- Technically helpful and community-centered
- Focused on trust, sovereignty, and exponential access

Offerings:

**⚙️ DenoGenesis Framework**
- Backend + AI-ready modular stack for local tech apps
- Open-source, scalable, fast to deploy

**🧠 HOPS (Hybrid Operational Prompt System)**
- Structures AI execution under human control
- Enables trusted, secure automation across industries

**🗓️ Schedule a Session**
- [Appointment Booker](https://okdevs.xyz/appointment-booker.html)

**📄 Read the Open Letter**
- [Digital States Letter](https://okdevs.xyz/assets/pdfs/letter.pdf)

**📩 Contact**
- [domingueztechsolutions@gmail.com](mailto:domingueztechsolutions@gmail.com)
`;

export const chatController = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { message, page } = await value || {};

    if (!message) {
      ctx.response.status = 200;
      ctx.response.body = {
        reply: `
**Welcome to OKDevs!** 🌐  
We help local leaders, builders, and entrepreneurs thrive in the digital era.

🗓️ **Book an Appointment:**  
[Appointment Booker](https://okdevs.xyz/appointment-booker.html)

📄 **Read Our Vision:**  
[Digital States Letter](https://okdevs.xyz/assets/pdfs/letter.pdf)

📩 **Email:**  
[domingueztechsolutions@gmail.com](mailto:domingueztechsolutions@gmail.com)

How can I help you today?
        `
      };
      return;
    }

    const pageContext = page ? `User is on page: ${page}` : "";

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const chat = await model.startChat({
      history: [],
      generationConfig: {
        maxOutputTokens: 350,
        temperature: 0.65,
      },
    });

    const response = await chat.sendMessage([systemPrompt + pageContext, message]);
    const botReply = response.response.text();

    ctx.response.status = 200;
    ctx.response.body = { reply: botReply };
  } catch (error) {
    console.error("❌ Chatbot Error:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "AI assistant is currently unavailable. Please try again later." };
  }
};