import express from 'express'
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
import applicationRoutes from "./routes/application.routes.js"
import getInvolvedRoutes from "./routes/getInvolved.routes.js";
import projectRoutes from "./routes/project.routes.js";
//create app

const app=express();

app.use(express.urlencoded({ extended: true }));
//middleware for json parse
app.use(express.json());


//routes
// app.get('/',(req,res)=>{
//     res.send("App is running....");
// });
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
app.use("/api",applicationRoutes);

app.use("/api/get-involved", getInvolvedRoutes);
app.use("/api/project",projectRoutes);

export default app;