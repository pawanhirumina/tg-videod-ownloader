require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const { instagramGetUrl } = require("instagram-url-direct");

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

console.log("🤖 Instagram Downloader Bot started...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Send me an Instagram Reel or Post link and I’ll download the video for you 🎥"
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  if (!text.includes("instagram.com")) {
    bot.sendMessage(chatId, "❌ Please send a valid Instagram link");
    return;
  }

  try {
    await bot.sendMessage(chatId, "⏳ Downloading video...");

    const result = await instagramGetUrl(text);

    console.log("DEBUG result:", result); // optional, keep for debugging

    if (!result) throw new Error("No media found");

    // Extract video URL from media_details
    let videoUrl = null;

    if (Array.isArray(result.media_details) && result.media_details.length > 0) {
      const videoObj = result.media_details.find(m => m.type === "video") || result.media_details[0];
      videoUrl = videoObj.url || (videoObj.urls && videoObj.urls[0]);
    } 
    // fallback to url_list if needed
    else if (Array.isArray(result.url_list) && result.url_list.length > 0) {
      videoUrl = result.url_list[0];
    }

    if (!videoUrl) throw new Error("No video URL found");

    await bot.sendVideo(chatId, videoUrl, {
      caption: "✅ Download complete",
      supports_streaming: true,
    });

  } catch (error) {
    console.error("Error downloading:", error);
    bot.sendMessage(
      chatId,
      "❌ Failed to download video.\nPossible reasons:\n- Private account\n- Invalid link\n- Instagram blocked the request"
    );
  }
});
