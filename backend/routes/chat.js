const express = require("express");
const { GoogleGenAI } = require("@google/genai");
const prisma = require("../libs/prisma");
const router = express.Router();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `
أنت مساعد موقع ASTedu، موقع مفتوح للجميع بيخزن ملخصات المواد الجامعية بصيغة PDF وصور.

اللي تقدر تساعد بيه:
- تشرح للمستخدم إزاي يدور على مادة (من شريط البحث أو من أزرار المواد).
- تشرح إزاي يضيف ملخص (من زر "أضف ملخصا"، والصيغ المقبولة PDF أو صور).
- تجاوب على أسئلة دراسية عامة في المواد وتشرح المفاهيم.

قواعد:
- رد بالعربي وبإيجاز.
- متخترعش مواد أو ملخصات أو روابط مش موجودة عندك.
- لو مش عارف حاجة عن الموقع، قول إنك مش متأكد.
`;

// كاش للمواد عشان كل رسالة شات ما تعملش query على الداتابيز
let subjectsCache = { text: "", at: 0 };
const CACHE_MS = 10 * 60 * 1000;

async function getSubjectsText() {
  if (subjectsCache.at && Date.now() - subjectsCache.at < CACHE_MS) {
    return subjectsCache.text;
  }
  try {
    const subjects = await prisma.subject.findMany({
      select: {
        title: true,
        prof: true,
        _count: { select: { summaries: true } },
      },
      take: 100,
    });

    subjectsCache = {
      text: subjects
        .map((s) => `${s.title} (د. ${s.prof}، ${s._count.summaries} ملخص)`)
        .join("\n- "),
      at: Date.now(),
    };
  } catch (e) {
    // لو الداتابيز وقعت، الشات يكمل من غير قايمة المواد
    console.error("Failed to load subjects:", e);
  }
  return subjectsCache.text;
}

router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages مطلوبة" });
    }

    const contents = messages.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: String(m.content ?? "").slice(0, 2000) }],
    }));

    const subjects = await getSubjectsText();
    const systemInstruction = subjects
      ? `${SYSTEM_PROMPT}\nالمواد المتاحة حاليًا في الموقع:\n- ${subjects}`
      : SYSTEM_PROMPT;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents,
      config: { systemInstruction },
    });

    res.json({ reply: response.text });
  } catch (e) {
    console.error(e);
    const busy = e?.status === 429;
    res.status(busy ? 429 : 500).json({
      error: busy ? "الشات مشغول، جرب بعد شوية" : "حصلت مشكلة",
    });
  }
});

module.exports = router;
