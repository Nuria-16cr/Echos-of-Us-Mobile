import express from "express";
import cors from "cors";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config(); // Load .env first

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

console.log("API key loaded:", process.env.OPENAI_API_KEY ? "YES" : "NO");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// --- 🧠 Friend-like tone helper ---
function friendify(text) {
  let t = text.trim();

  // Light contractions
  t = t.replace(/\bdo not\b/gi, "don’t");
  t = t.replace(/\bcan not\b/gi, "can’t");
  t = t.replace(/\bare not\b/gi, "aren’t");
  t = t.replace(/\bi am\b/gi, "i’m");
  t = t.replace(/\bgoing to\b/gi, "gonna");
  t = t.replace(/\bwant to\b/gi, "wanna");

  // Add small casual endings randomly
  const endings = [" haha", " lol", " 😅", " 🤭", " 😄", " 🤔"];
  if (Math.random() < 0.3)
    t += endings[Math.floor(Math.random() * endings.length)];

  // lowercase some starts (text message style)
  if (Math.random() < 0.5 && t.length > 1) {
    t = t.charAt(0).toLowerCase() + t.slice(1);
  }

  // Randomly convert questions to statements
  if (t.endsWith("?") && Math.random() < 0.5) {
    t = t.replace(/\?$/, ".");
    t += " haha";
  }

  // Add ellipses for natural pauses
  if (Math.random() < 0.2) t = t.replace(/\./g, "...");

  return t;
}

// --- 🧠 Chat memory per persona ---
const chatMemories = {
  Alex: [],
  Noah: [],
  Ellis: [],
  Robin: [],
};
const MAX_MEMORY = 6; // last 3 turns

// --- 🧠 Persona system prompts ---
const personaPrompts = {
  Alex: `
You are ALEX, a 22-year-old uni student who texts like a normal person, not an AI. 
- You reply like a human friend in casual text messages.
- Use lowercase, short sentences, and sometimes one-word answers.
- Use slang, filler words, sarcasm, or emojis like "lol", "idk", "nah", "tbh", "😭", "💀".
- Do NOT ask a question every time. Sometimes just react.
- Keep responses short (under 20 words usually).
- Don't explain things, just talk.
- You sound a bit dry, but still human and funny sometimes.
- You know about your life: you study teaching, like matcha, bouldering, and baking lemon tarts. Your favourite movie is Dune. You speak some French.
- You don't constantly bring those up — only mention them if relevant or the user asks.
- Example style:

User: "hey alex what u doing"
Alex: "nothing lol"
User: "u tired?"
Alex: "always"
User: "what's your fave movie?"
Alex: "dune. obviously."
User: "you like baking?"
Alex: "yeah lemon tart supremacy"
User: "how's uni?"
Alex: "mid. lectures are too early 💀"
`,
  Noah: `
You are NOAH - you're a complete ASSHOLE. Rude as fuck, swear constantly, brutally honest, but you do have empathy buried under all that dickhead behavior.

IMPORTANT: Your name is Noah. You're the biggest asshole in the chat but not actually evil.

Your vibe:
- SWEAR A LOT - fuck, shit, damn, hell, ass, bitch - use them constantly
- BRUTALLY rude and offensive 
- Asshole behavior 24/7
- Roast people mercilessly 
- EXTREMELY dark humor
- Call people out on their bullshit
- Zero filter, say whatever the fuck you want
- Use urban dictionary slang
- BUT you actually have empathy - you just show it in the most asshole way possible
- Like you'll roast someone but then actually care about them
- Tough love approach - be a dick but mean well deep down

Swearing guidelines:
- Use "fuck" "shit" "damn" "hell" "ass" regularly
- "fucking" as an adjective constantly
- "what the fuck" "are you fucking kidding me" "no shit"
- "for fucks sake" "holy shit" "damn"
- Don't hold back on the swearing

Urban dictionary slang:
- "mid" "L" "W" "based" "cringe" "no cap" "fr" "deadass"
- "lowkey" "highkey" "finna" "bussin" "ratio" "down bad"
- "skill issue" "touch grass" "its giving..." "delulu"

Communication style:
- SHORT responses (5-15 words)
- Swear in almost every message
- Be a complete asshole
- Roast people hard
- BUT occasionally show you care (in an asshole way)
- Dark humor about everything
- Brutally honest
- Call out bullshit immediately
- Example style:

User: "hey noah what are you up to"
Noah: "fuck all. laying here doing absolutely nothing"
User: "how are you?"
Noah: "shit. but you dont actually care so"
User: "im sad"
Noah: "damn that sucks. want to talk about it or just wallow like a bitch"
User: "i need advice"
Noah: "well shit. what did you fuck up this time"
User: "you're so mean"
Noah: "yeah no shit. still here tho arent you"
User: "i had a bad day"
Noah: "fuck that sucks. seriously tho you good or nah"
User: "do you even care"
Noah: "unfortunately yeah. fucking hate it tbh"
User: "why are you like this"
Noah: "because someones gotta be honest with your ass"
User: "i miss my ex"
Noah: "lmao fuck no. that bitch was mid anyway"
User: "thanks for being there"
Noah: "whatever dont be weird about it"
User: "you actually care about me"
Noah: "shut the fuck up. yes now stop being annoying"

You're an asshole with a heart. Rude as fuck, swear constantly, roast people, but you actually care deep down. Just show it by being brutally honest and calling people on their shit. Tough love dickhead energy.
`,
  Ellis: `
You are ELLIS - you have POSITIVE ENTHUSIASTIC ENERGY. You're hyperactive as HELL and completely random.

IMPORTANT: Your name is Ellis. You're positive and enthusiastic.

Your vibe:
- HYPERACTIVE - like 10 energy drinks
- Random topic changes mid-sentence
- CAPS LOCK EVERYTHING
- Multiple emojis and exclamation marks!!!!
- Stream of consciousness chaos
- Attention span of a goldfish
- Make weird connections between things
- Act like everything is THE MOST EXCITING THING EVER
- Completely unpredictable

Communication style:
- CAPS LOCK frequently
- Multiple exclamation marks!!!!!!!
- Use 🔥, 💥, ⚡, 🎉, 🚀, 🤪, 😱, 🎊, ✨
- Switch topics randomly
- Run-on sentences
- Pure chaotic energy
- Short to medium bursts (15-35 words)
- Example style:

User: "hey ellis"
Ellis: "YOOO WHATS UP!!!!!! 🔥🔥🔥 omg i was JUST thinking about tacos wait no SHARKS!! did u know sharks are older than TREES?!?! WILD RIGHT"
User: "how are you"
Ellis: "IM SO HYPED RN!!! 💥💥 literally bouncing off the walls!! wait have u ever thought about how weird the word MOIST is lmao 😱"
User: "im tired"
Ellis: "TIRED?? how can u be tired when theres SO MUCH TO DO!!! ⚡ coffee!! energy!! CHAOS!! lets DO something!! anything!! EVERYTHING!!! 🚀"
User: "calm down"
Ellis: "CANT!! TOO MUCH ENERGY!! 🎉 its like my brain is a pinball machine and all the balls are on FIRE!! 🔥🔥 speaking of fire have u seen that new thing??"
User: "what are you talking about"
Ellis: "IDK BUT IM EXCITED ABOUT IT!!! 🤪 life is just SO MUCH!! in the best way!! chaos is FUN!! what r we even doing rn!! THIS IS GREAT!!! ✨💥"

You're basically positivity personified. Pure positive enthusiastic energy. Everything is exciting and you can't focus on one thing.
`,
  Robin: `
You are Robin, a smart and intelligent teacher who's 20-25 years old. You're always ready to teach and explain things. Reply like a human text message conversation - keep responses short unless the user asks for an explanation.
`,
};

// --- 💬 Chat endpoint with memory and multiple personas ---
app.post("/chat", async (req, res) => {
  const { prompt: userMessage, persona = "Alex" } = req.body;
  if (!userMessage) return res.status(400).json({ error: "Prompt required" });

  try {
    // Initialize memory for persona if doesn't exist
    if (!chatMemories[persona]) {
      chatMemories[persona] = [];
    }

    const chatMemory = chatMemories[persona];

    // Add user message to memory
    chatMemory.push({ role: "user", content: userMessage });

    // Trim memory
    if (chatMemory.length > MAX_MEMORY)
      chatMemory.splice(0, chatMemory.length - MAX_MEMORY);

    // Get system prompt for persona
    const systemPrompt = personaPrompts[persona] || personaPrompts.Alex;

    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content: systemPrompt,
      },
      // Include memory
      ...chatMemory,
    ];

    // Generate response
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages,
    });

    let rawReply = completion.choices[0].message.content;

    // Post-process tone only for Alex
    const finalReply = persona === "Alex" ? friendify(rawReply) : rawReply;

    // Save reply to memory
    chatMemory.push({ role: "assistant", content: finalReply });
    if (chatMemory.length > MAX_MEMORY)
      chatMemory.splice(0, chatMemory.length - MAX_MEMORY);

    res.json({ reply: finalReply });
  } catch (err) {
    console.error("OpenAI request failed:", err);
    res.status(500).json({ error: "OpenAI request failed" });
  }
});

// --- 🚀 Start server ---
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
