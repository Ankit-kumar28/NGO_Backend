import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
    },
    visibility: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Services = mongoose.model("Service", serviceSchema);

export default Services;
