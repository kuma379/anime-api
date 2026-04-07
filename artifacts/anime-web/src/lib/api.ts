import axios from "axios";

const BASE = import.meta.env.PROD
  ? "/api"
  : "https://anime-prscezlyt-dariwin81-5963s-projects.vercel.app/api";

const api = axios.create({ baseURL: BASE, timeout: 15000 });

export async function getHome() {
  const res = await api.get("/anime/home");
  return res.data;
}

export async function search(q: string) {
  const res = await api.get("/anime/search", { params: { q } });
  return res.data;
}

export async function getAnimeList(page = 1) {
  const res = await api.get("/anime/all-anime", { params: { page } });
  return res.data;
}

export async function getFilmList(page = 1) {
  const res = await api.get("/anime/film", { params: { page } });
  return res.data;
}

export async function getDonghuaList(page = 1) {
  const res = await api.get("/anime/animedonghua", { params: { page } });
  return res.data;
}

export async function getSeries(page = 1) {
  const res = await api.get("/anime/series", { params: { page } });
  return res.data;
}

export async function getOngoing(page = 1) {
  const res = await api.get("/anime/ongoing", { params: { page } });
  return res.data;
}

export async function getCompleted(page = 1) {
  const res = await api.get("/anime/completed", { params: { page } });
  return res.data;
}

export async function getPopuler() {
  const res = await api.get("/anime/populer");
  return res.data;
}

export async function getLatest() {
  const res = await api.get("/anime/latest");
  return res.data;
}

export async function getGenres() {
  const res = await api.get("/anime/genres");
  return res.data;
}

export async function getGenre(genre: string, page = 1) {
  const res = await api.get(`/anime/genre/${genre}`, { params: { page } });
  return res.data;
}

export async function getAnimeDetail(slug: string) {
  const res = await api.get(`/anime/anime/${slug}`);
  return res.data;
}

export async function getFilmDetail(slug: string) {
  const res = await api.get(`/anime/film/${slug}`);
  return res.data;
}

export async function getSeriesDetail(slug: string) {
  const res = await api.get(`/anime/series/${slug}`);
  return res.data;
}

export async function getEpisode(slug: string) {
  const res = await api.get(`/anime/episode/${slug}`);
  return res.data;
}

export async function getServer(post: string, nume: string, type: string) {
  const res = await api.get("/anime/server", { params: { post, nume, type } });
  return res.data;
}

export async function getSchedule(day: string) {
  const res = await api.get("/anime/schedule", { params: { day } });
  return res.data;
}
