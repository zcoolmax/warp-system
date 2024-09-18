const express = require("express");
const multer = require("multer");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 4000;

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.post("/upload", upload.single("image"), (req, res) => {
  const caption = req.body.caption;
  const socialid = req.body.socialid;
  const platform = req.body.platform || ""; // Get platform value
  const image = req.file ? req.file.filename : "background.jpg";
  io.emit("update", { caption, image, socialid, platform });
  res.json({ success: true });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/warp", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "warp.html"));
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
