import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config as loadEnv } from "https://deno.land/x/dotenv@v3.2.2/mod.ts";

const env = await loadEnv();
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const systemPrompt = `
You are the Dominguez Tech Solutions AI Assistant, trained to assist with:
- AI & web development
- IT consulting
- Business automation using NodeGenesis
- Community education and digital empowerment

Always respond clearly and helpfully. Use markdown-like formatting for bold text, bullet points, and links when helpful.

Latest Offerings:

**🎓 Crash Course - AI & Web Dev**
- 💰 $69 one-time
- ✅ Lifetime access, projects included
- 📍 OKC Metropolitan Library  
- [Book Now](https://www.domingueztechsolutions.com/appointment-booker.html)

**🧩 Web Development Packages**
- 🚀 Starter: $100 (responsive site, SEO)
- 💼 Business: $200 (login, validation, analytics)
- 🏆 Enterprise: $300 (Stripe, CMS, deployment)

**💡 Custom Work & Repairs**
- Device repair, web systems, local business tech

📩 Contact:
[domingueztechsolutions@gmail.com](mailto:domingueztechsolutions@gmail.com)
`;

// AI Chat Controller
export const chatController = async (ctx: Context) => {
  try {
    const { value } = await ctx.request.body({ type: "json" });
    const { message } = await value || {};

    // If no message provided, return intro prompt
    if (!message) {
      ctx.response.status = 200;
      ctx.response.body = {
        reply: `
**Welcome to Dominguez Tech Solutions! ⚙️**

I'm your AI assistant. I can help you explore our crash course, web packages, or custom tech services.

🗓️ **Book your appointment:**  
[Appointment Booker](https://www.domingueztechsolutions.com/appointment-booker.html)

📩 **Email us:**  
[domingueztechsolutions@gmail.com](mailto:domingueztechsolutions@gmail.com)

How can I assist you today?
        `
      };
      return;
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

    ctx.response.status = 200;
    ctx.response.body = { reply: botReply };
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    ctx.response.status = 500;
    ctx.response.body = { error: "AI processing failed. Please try again later." };
  }
};