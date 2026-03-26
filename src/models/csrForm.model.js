import mongoose from "mongoose";

const csrFormSchema = new mongoose.Schema({
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  mobile: String,
  altContact: String,

  company: String,
  address: String,

  activities: [String],

  saplings: Number,

  location: String,

  volunteering: {
    type: String,
    enum: ["Yes", "No", "Maybe"]
  },

  date: Date,

  message: String,

  status: {
    type: String,
    enum: ["new", "contacted", "closed"],
    default: "new"
  }
}, { timestamps: true });

export default mongoose.model("CSRForm", csrFormSchema);