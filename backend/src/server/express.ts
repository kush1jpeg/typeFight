import express from "express";
import http from "http";

const app = express();
app.use(express.json());
export const server = http.createServer(app);
