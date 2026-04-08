import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    //   trim: true,
    //   maxlength: 500,
    },

    mediaUrl: {
      type: String,
      required: false,
    },

    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
      index: true,
    },

    thumbnailUrl: {
      type: String, 
    },
    ngo: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "NGO",
  required: true,
  index: true
},

uploadedBy: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User"
},
   

  

    eventDate: {
      type: Date,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    views: {
      type: Number,
      // default: 0,
    },

    
  },
  {
    timestamps: true,
  }
);





export const Gallery = mongoose.model("Gallery", gallerySchema);