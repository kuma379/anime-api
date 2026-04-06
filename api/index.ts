import express, { type Request, type Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const BASE_URL = "https://www.sankavollerei.com/anime/winbu";

async function fetchAnimeApi(path: string, req: Request, res: Response) {
  try {
    const response = await axios.get(`${BASE_URL}${path}`, {
      params: req.query,
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
      },
    });
    res.json(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status ?? 500;
      res.status(status).json({ error: err.message, status });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

app.get("/api/healthz", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/anime/home", (req, res) => {
  return fetchAnimeApi("/home", req, res);
});

app.get("/api/anime/search", (req, res) => {
  return fetchAnimeApi("/search", req, res);
});

app.get("/api/anime/animedonghua", (req, res) => {
  return fetchAnimeApi("/animedonghua", req, res);
});

app.get("/api/anime/film", (req, res) => {
  return fetchAnimeApi("/film", req, res);
});

app.get("/api/anime/series", (req, res) => {
  return fetchAnimeApi("/series", req, res);
});

app.get("/api/anime/tvshow", (req, res) => {
  return fetchAnimeApi("/tvshow", req, res);
});

app.get("/api/anime/others", (req, res) => {
  return fetchAnimeApi("/others", req, res);
});

app.get("/api/anime/genres", (req, res) => {
  return fetchAnimeApi("/genres", req, res);
});

app.get("/api/anime/genre/:genre", (req, res) => {
  return fetchAnimeApi(`/genre/${req.params.genre}`, req, res);
});

app.get("/api/anime/schedule", (req, res) => {
  return fetchAnimeApi("/schedule", req, res);
});

app.get("/api/anime/update", (req, res) => {
  return fetchAnimeApi("/update", req, res);
});

app.get("/api/anime/latest", (req, res) => {
  return fetchAnimeApi("/latest", req, res);
});

app.get("/api/anime/ongoing", (req, res) => {
  return fetchAnimeApi("/ongoing", req, res);
});

app.get("/api/anime/completed", (req, res) => {
  return fetchAnimeApi("/completed", req, res);
});

app.get("/api/anime/populer", (req, res) => {
  return fetchAnimeApi("/populer", req, res);
});

app.get("/api/anime/all-anime", (req, res) => {
  return fetchAnimeApi("/all-anime", req, res);
});

app.get("/api/anime/all-anime-reverse", (req, res) => {
  return fetchAnimeApi("/all-anime-reverse", req, res);
});

app.get("/api/anime/catalog", (req, res) => {
  return fetchAnimeApi("/catalog", req, res);
});

app.get("/api/anime/list", (req, res) => {
  return fetchAnimeApi("/list", req, res);
});

app.get("/api/anime/anime/:slug", (req, res) => {
  return fetchAnimeApi(`/anime/${req.params.slug}`, req, res);
});

app.get("/api/anime/episode/:slug", (req, res) => {
  return fetchAnimeApi(`/episode/${req.params.slug}`, req, res);
});

app.get("/api/anime/series/:slug", (req, res) => {
  return fetchAnimeApi(`/series/${req.params.slug}`, req, res);
});

app.get("/api/anime/film/:slug", (req, res) => {
  return fetchAnimeApi(`/film/${req.params.slug}`, req, res);
});

app.get("/api/anime/server", (req, res) => {
  return fetchAnimeApi("/server", req, res);
});

export default app;
