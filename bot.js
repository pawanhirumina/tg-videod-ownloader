require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const youtubedl = require("youtube-dl-exec");
const { instagramGetUrl } = require("instagram-url-direct");
const TikTokScraper = require('tiktok-scraper'); // npm install tiktok-scraper
const TikTokScraper = require('tiktok-scraper'); // npm install tiktok-scraper








const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("❌ BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });
console.log("🤖 Multi-platform Downloader Bot started...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "👋 Send me an Instagram, YouTube, TikTok, or Facebook video link and I’ll download it for you 🎥"
  );
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text || text.startsWith("/")) return;

  await bot.sendMessage(chatId, "⏳ Processing your link...");

  try {
    let videoUrl;

    // Instagram
    if (text.includes("instagram.com")) {
      const result = await instagramGetUrl(text);
      if (Array.isArray(result.media_details) && result.media_details.length > 0) {
        const videoObj = result.media_details.find(m => m.type === "video") || result.media_details[0];
        videoUrl = videoObj.url || (videoObj.urls && videoObj.urls[0]);
      } else if (Array.isArray(result.url_list) && result.url_list.length > 0) {
        videoUrl = result.url_list[0];
      }
    }

    // TikTok
 // inside your message handler
else if (text.includes("tiktok.com")) {
  try {
    const tiktokInfo = await TikTokScraper.getVideoMeta(text, { noWaterMark: true });
    videoUrl = tiktokInfo.collector[0].videoUrl; // first video in case of multiple
  } catch (err) {
    console.error("TikTok download error:", err);
    bot.sendMessage(chatId, "❌ Failed to download TikTok video");
  }
}

    // YouTube or Facebook
    else if (text.includes("youtube.com") || text.includes("youtu.be") || text.includes("facebook.com")) {
      const info = await youtubedl(text, {
        dumpSingleJson: true,
        noWarnings: true,
        noCheckCertificate: true,
        preferFreeFormats: true,
        youtubeSkipDashManifest: true
      });

      // pick the best video url
      videoUrl = info.url || (info.formats && info.formats[0].url);
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
      "❌ Failed to download video.\nPossible reasons:\n- Private/blocked account\n- Invalid link\n- Video too large"
    );
  }
});
