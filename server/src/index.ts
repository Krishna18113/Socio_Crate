import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth";
import postRoutes from "./routes/post";
import commentRoutes from "./routes/commentRoutes";
import aiRoutes from "./routes/ai";
import followRoutes from "./routes/followRoutes";
import userRoutes from './routes/users';
import uploadRouter from "./routes/upload";
import path from "path";
// import "./types/express"; // ensure TypeScript loads the declaration


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Required if you're sending cookies/auth headers
}));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api", commentRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/users', userRoutes);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
