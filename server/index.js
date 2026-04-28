import express from "express";
import multer from "multer";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy es esencial para obtener el protocolo correcto ('https') cuando
// la aplicación se encuentra detrás del proxy inverso de Render.
app.set("trust proxy", 1);

// Helper para obtener el URL dinámico dependiendo de la petición.
const getBaseUrl = (req) => {
  return process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
};

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ── Directorios de uploads ────────────────────────────────────────────────────
const UPLOADS_DIR = path.join(__dirname, "uploads");
const IMAGES_DIR = path.join(UPLOADS_DIR, "images");
const VIDEOS_DIR = path.join(UPLOADS_DIR, "videos");

[UPLOADS_DIR, IMAGES_DIR, VIDEOS_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// ── Servir archivos estáticos ─────────────────────────────────────────────────
app.use("/uploads", express.static(UPLOADS_DIR));

// ── Configuración Multer ──────────────────────────────────────────────────────
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const isVideo = file.mimetype.startsWith("video/");
    cb(null, isVideo ? VIDEOS_DIR : IMAGES_DIR);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/svg+xml",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "video/quicktime",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}`), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

// ── Rutas ─────────────────────────────────────────────────────────────────────

// Subir un archivo (imagen o video)
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No se recibió ningún archivo." });
  }
  const isVideo = req.file.mimetype.startsWith("video/");
  const subdir = isVideo ? "videos" : "images";
  const baseUrl = getBaseUrl(req);
  const url = `${baseUrl}/uploads/${subdir}/${req.file.filename}`;
  res.json({
    url,
    filename: req.file.filename,
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    type: isVideo ? "video" : "image",
  });
});

// Subir múltiples archivos (hasta 20)
app.post("/api/upload-multiple", upload.array("files", 20), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No se recibieron archivos." });
  }
  const baseUrl = getBaseUrl(req);
  const results = req.files.map((file) => {
    const isVideo = file.mimetype.startsWith("video/");
    const subdir = isVideo ? "videos" : "images";
    return {
      url: `${baseUrl}/uploads/${subdir}/${file.filename}`,
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      type: isVideo ? "video" : "image",
    };
  });
  res.json({ files: results });
});

// Eliminar un archivo
app.delete("/api/upload/:type/:filename", (req, res) => {
  const { type, filename } = req.params;
  const subdir = type === "video" ? "videos" : "images";
  // Sanitize filename to prevent path traversal
  const safeName = path.basename(filename);
  const filePath = path.join(UPLOADS_DIR, subdir, safeName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Archivo no encontrado." });
  }
  fs.unlinkSync(filePath);
  res.json({ success: true });
});

// Listar todos los archivos subidos
app.get("/api/uploads", (req, res) => {
  const baseUrl = getBaseUrl(req);
  const images = fs.readdirSync(IMAGES_DIR).map((f) => ({
    url: `${baseUrl}/uploads/images/${f}`,
    filename: f,
    type: "image",
  }));
  const videos = fs.readdirSync(VIDEOS_DIR).map((f) => ({
    url: `${baseUrl}/uploads/videos/${f}`,
    filename: f,
    type: "video",
  }));
  res.json({ images, videos, total: images.length + videos.length });
});

// Health check
app.get("/api/health", (_, res) => res.json({ ok: true, port: PORT }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("[WAUP Server Error]", err.message);
  res.status(500).json({ error: err.message });
});

const distPath = path.join(__dirname, "../dist");
app.use(express.static(distPath));

app.use((req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ WAUP Upload Server corriendo en http://localhost:${PORT}`);
  console.log(`📁 Archivos guardados en: ${UPLOADS_DIR}`);
});
