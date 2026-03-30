import { Event } from "../models/event.model.js";
import { Blog } from "../models/blog.model.js";
import { QuestionSeries } from "../models/questionSeries.model.js";
import { KnowledgeBase } from "../models/knowledgeBase.model.js";

const normalize = (doc, contentType) => {
  let displayTitle = "";
  let description = "";
  let image = "";
  let slug = doc.slug || `/${contentType}/${doc._id}`;
  let seriesType = ""; 

  switch (contentType) {
    case "event":
      displayTitle = doc.title;
      description = doc.subtitle || doc.topics?.join(", ") || "";
      image = doc.image;
      break;

    case "blog":
      displayTitle = doc.title;
      description = doc.excerpt || "";
      image = doc.coverImage;
      break;

    case "question-series":
      displayTitle = doc.title; 
      description = doc.description || doc.excerpt || "";
      image = doc.image || ""; 
      seriesType = doc.seriesType || "general"; 
      break;

    case "knowledge-base":
      displayTitle = doc.title || doc.topic || doc.chapterName || "";
      description = doc.description || doc.excerpt || "";
      image = doc.image || "";
      break;

    default:
      displayTitle = doc.title || "Untitled";
  }

  return {
    _id: doc._id,
    type: contentType,
    displayTitle,
    description: description.slice(0, 160), 
    slug,
    image, 
   
    createdAt: doc.createdAt || doc.publishedAt || doc.date,
    isFeatured: doc.isFeatured,

    
    
    seriesType: contentType === "question-series" ? (doc.seriesType || "") : null,
  };
};

export const getLatestUpdates = async (ngoId, limit = 8) => {
  const filters = {
    ngo: ngoId,
    visibility: "public",
    
  };

  const queries = [
    
    Event.find({ ...filters })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),

    Blog.find({ ...filters, status: "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),

    QuestionSeries.find({ ngo: ngoId, visibility: "public" || "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),

    KnowledgeBase.find({ ngo: ngoId, visibility: "public" || "published" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean(),
  ];

  const [events, blogs, series, knowledge] = await Promise.all(queries);

  const allContent = [
    ...events.map((doc) => normalize(doc, "event")),
    ...blogs.map((doc) => normalize(doc, "blog")),
    ...series.map((doc) => normalize(doc, "question-series")),
    ...knowledge.map((doc) => normalize(doc, "knowledge-base")),
  ];

  return allContent
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

export const getFeaturedContent = async (ngoId, limit = 4) => {
  const filters = { ngo: ngoId, isFeatured: true, visibility: "public" };

  const queries = [
    Event.find({ ...filters }).lean(),
    Blog.find({ ...filters, status: "published" }).lean(),
    QuestionSeries.find({ ...filters }).lean(),
    KnowledgeBase.find({ ...filters }).lean(),
  ];

  const [events, blogs, series, knowledge] = await Promise.all(queries);

  const featured = [
    ...events.map((doc) => normalize(doc, "event")),
    ...blogs.map((doc) => normalize(doc, "blog")),
    ...series.map((doc) => normalize(doc, "question-series")),
    ...knowledge.map((doc) => normalize(doc, "knowledge-base")),
  ];

  return featured
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};