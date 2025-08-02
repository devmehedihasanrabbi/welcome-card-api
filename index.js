const express = require("express");
const path = require("path");
const { createCanvas, loadImage, registerFont } = require("canvas");

registerFont(path.join(__dirname, "fonts", "Montserrat-Bold.ttf"), { family: "Montserrat" });

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/image/welcomecard", async (req, res) => {
  const {
    title = "Welcome!",
    username = "Guest",
    discriminator = "0000",
    subtitle = "Glad you're here!",
    image = "https://cdn.discordapp.com/embed/avatars/0.png",
    servername = "Discord Server",
    servericon = "https://cdn.discordapp.com/embed/avatars/1.png"
  } = req.query;

  const width = 800;
  const height = 300;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Dynamic glowing rainbow background
  const gradient = ctx.createLinearGradient(0, 0, width, 0);
  const hueShift = (Date.now() / 100) % 360;
  gradient.addColorStop(0, `hsl(${(hueShift) % 360}, 100%, 60%)`);
  gradient.addColorStop(0.2, `hsl(${(hueShift + 60) % 360}, 100%, 60%)`);
  gradient.addColorStop(0.4, `hsl(${(hueShift + 120) % 360}, 100%, 60%)`);
  gradient.addColorStop(0.6, `hsl(${(hueShift + 180) % 360}, 100%, 60%)`);
  gradient.addColorStop(0.8, `hsl(${(hueShift + 240) % 360}, 100%, 60%)`);
  gradient.addColorStop(1, `hsl(${(hueShift + 300) % 360}, 100%, 60%)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Glow effect
  ctx.shadowColor = gradient;
  ctx.shadowBlur = 30;
  ctx.fillRect(0, 0, width, height);

  // Server icon circle
  try {
    const icon = await loadImage(servericon);
    ctx.save();
    ctx.beginPath();
    ctx.arc(720, 40, 30, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(icon, 690, 10, 60, 60);
    ctx.restore();
  } catch (err) {
    // ignore if server icon load fails
  }

  // User avatar circle
  try {
    const avatar = await loadImage(image);
    ctx.save();
    ctx.beginPath();
    ctx.arc(100, 150, 75, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, 25, 75, 150, 150);
    ctx.restore();
  } catch (err) {
    // ignore if avatar load fails
  }

  // Text styles
  ctx.fillStyle = "#ffffff";
  ctx.font = "40px Montserrat";
  ctx.fillText(title, 200, 90);

  ctx.font = "30px Montserrat";
  ctx.fillText(`${username}#${discriminator}`, 200, 140);

  ctx.font = "25px Montserrat";
  ctx.fillStyle = "#bbbbbb";
  ctx.fillText(subtitle, 200, 190);

  ctx.font = "20px Montserrat";
  ctx.fillStyle = "#cccccc";
  ctx.fillText(`Server: ${servername}`, 200, 230);

  res.set("Content-Type", "image/png");
  canvas.createPNGStream().pipe(res);
});

app.listen(PORT, () => {
  console.log(`Welcome API running on port ${PORT}`);
});
