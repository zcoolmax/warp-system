const express = require("express");
const multer = require("multer");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
// const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 80;

// Set up multer to handle file uploads temporarily
const storage = multer.memoryStorage(); // Use memory storage to avoid saving files to disk
const upload = multer({ storage });

// Serve static files from the 'public' directory
app.use(express.static("public"));

// Handle image uploads
app.post("/upload", upload.single("image"), (req, res) => {
  const caption = req.body.caption;
  const socialid = req.body.socialid;
  const platform = req.body.platform || "";

  // Emit the image data and additional info via Socket.IO
  io.emit("update", {
    caption,
    image: req.file.buffer.toString("base64"), // Encode the image as base64
    socialid,
    platform,
  });

  res.json({ success: true });
});

// Serve HTML files
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
