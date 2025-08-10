import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

//setup for __dirname in es modules

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const musicDir = path.join(__dirname, "../public/music");
const imagesDir = path.join(__dirname, "../public/images");

router.get("/", (res, req) => {
  fs.readdir(musicDir, (err, files) => {
    if (err) {
      return res.statusCode(500).json({ error: "Error in fetching songs" });
    }

    const songs = files
      .filter((file) => file.endsWith(".mp3"))
      .map((file) => {
        const songName = path.parse(file).name;
        return {
          title: songName,
          src: `/music/${file}`,
          cover: `/images/${songName}.jpg`,
        };
      });
    res.status(200).json(songs);
  });
});

export default router;
