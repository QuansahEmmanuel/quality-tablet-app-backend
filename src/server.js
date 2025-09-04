import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoutes from "./router/user.router.js";
import tablets from "./router/tablet.router.js";
import scanTablet from "./router/tabletTransaction.routes.js";
import productionLineRoutes from "./router/productionLines.router.js";
import tabletIssuance from "./router/tabletIssuance.router.js";
import { connectDB } from "./lib/dbConnection.js";
import collectTablet from "./router/tabletCollecting.router.js";

const app = express();
dotenv.config();

const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

app.use("./src/router/auth", userRoutes);
app.use("/api/production-lines", productionLineRoutes);
app.use("/api/tablets", tablets);
app.use("/api/scan", scanTablet);
app.use("/api/issue", tabletIssuance);
app.use("/api/collect", collectTablet);

connectDB().then(
  app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
  })
);
