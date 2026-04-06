import { Router, type IRouter, type Request, type Response } from "express";
import axios from "axios";

const router: IRouter = Router();
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
      res.status(status).json({
        error: err.message,
        status,
      });
    } else {
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

router.get("/anime/home", (req, res) => {
  return fetchAnimeApi("/home", req, res);
});

router.get("/anime/search", (req, res) => {
  return fetchAnimeApi("/search", req, res);
});

router.get("/anime/animedonghua", (req, res) => {
  return fetchAnimeApi("/animedonghua", req, res);
});

router.get("/anime/film", (req, res) => {
  return fetchAnimeApi("/film", req, res);
});

router.get("/anime/series", (req, res) => {
  return fetchAnimeApi("/series", req, res);
});

router.get("/anime/tvshow", (req, res) => {
  return fetchAnimeApi("/tvshow", req, res);
});

router.get("/anime/others", (req, res) => {
  return fetchAnimeApi("/others", req, res);
});

router.get("/anime/genres", (req, res) => {
  return fetchAnimeApi("/genres", req, res);
});

router.get("/anime/genre/:genre", (req, res) => {
  return fetchAnimeApi(`/genre/${req.params.genre}`, req, res);
});

router.get("/anime/schedule", (req, res) => {
  return fetchAnimeApi("/schedule", req, res);
});

router.get("/anime/update", (req, res) => {
  return fetchAnimeApi("/update", req, res);
});

router.get("/anime/latest", (req, res) => {
  return fetchAnimeApi("/latest", req, res);
});

router.get("/anime/ongoing", (req, res) => {
  return fetchAnimeApi("/ongoing", req, res);
});

router.get("/anime/completed", (req, res) => {
  return fetchAnimeApi("/completed", req, res);
});

router.get("/anime/populer", (req, res) => {
  return fetchAnimeApi("/populer", req, res);
});

router.get("/anime/all-anime", (req, res) => {
  return fetchAnimeApi("/all-anime", req, res);
});

router.get("/anime/all-anime-reverse", (req, res) => {
  return fetchAnimeApi("/all-anime-reverse", req, res);
});

router.get("/anime/catalog", (req, res) => {
  return fetchAnimeApi("/catalog", req, res);
});

router.get("/anime/list", (req, res) => {
  return fetchAnimeApi("/list", req, res);
});

router.get("/anime/anime/:slug", (req, res) => {
  return fetchAnimeApi(`/anime/${req.params.slug}`, req, res);
});

router.get("/anime/episode/:slug", (req, res) => {
  return fetchAnimeApi(`/episode/${req.params.slug}`, req, res);
});

router.get("/anime/series/:slug", (req, res) => {
  return fetchAnimeApi(`/series/${req.params.slug}`, req, res);
});

router.get("/anime/film/:slug", (req, res) => {
  return fetchAnimeApi(`/film/${req.params.slug}`, req, res);
});

router.get("/anime/server", (req, res) => {
  return fetchAnimeApi("/server", req, res);
});

export default router;
