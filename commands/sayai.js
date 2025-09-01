import axios from "axios";

export default async function sayai(msg) {
  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

  const res = await axios.post(
    url,
    {
      contents: {
        parts: {
          text: msg,
        },
      },
    },
    {
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": process.env.GOOGLE_GEMINI_API_KEY,
      },
    }
  );
  return res.data.candidates[0].content;
}
