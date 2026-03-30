import express from 'express'
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import ngoRoutes from "./routes/ngo.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import contactRoutes from "./routes/contact.routes.js"
import csrRoutes from "./routes/csr.route.js"
import galleryRoutes from "./routes/gallery.route.js"
import blogRoutes from "./routes/blog.routes.js"
import eventRoutes from "./routes/event.routes.js"
import  questSeriesRoutes from "./routes/questionSeries.route.js"
import  knowledgeBaseRoutes from "./routes/knowledgeBase.route.js"

import getInvolvedRoutes from "./routes/getInvolved.routes.js";
import projectRoutes from "./routes/project.routes.js";
import donateRoutes from "./routes/donation.route.js"

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../swagger.js";
import unifiedContentRoutes from "./routes/unifiedContent.route.js";


const app=express();
app.use(cors());

app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("NGO Backend API is running ");
});
app.use("/api/auth", authRoutes);
app.use("/api/ngo", ngoRoutes);
app.use("/api",faqRoutes);
app.use("/api",contactRoutes)
app.use("/api",csrRoutes);
app.use("/api",galleryRoutes);
app.use("/api",blogRoutes);
app.use("/api",eventRoutes);
app.use("/api",questSeriesRoutes)
app.use("/api",knowledgeBaseRoutes);
app.use("/api", getInvolvedRoutes);
app.use("/api",projectRoutes);
app.use("/api",donateRoutes);

app.use("/api", unifiedContentRoutes);

export default app;