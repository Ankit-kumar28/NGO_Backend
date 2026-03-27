// models/getInvolved.model.js
import mongoose from "mongoose";

const getInvolvedSchema = new mongoose.Schema(
  {
    ngo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NGO",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: ["membership", "volunteer", "internship"],
      required: true
    },

    // ── Common Fields ──────────────────────────────
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    profession: {
      type: String,
      trim: true
    },
    message: {
      type: String,
      trim: true
    },

    // ── Membership-only ────────────────────────────
    membershipType: {
      type: String,
      enum: [
        "Patient",
        "Caregiver / Family Member",
        "Doctor / Clinician",
        "Researcher / Scientist",
        "Student",
        "Volunteer",
        "NGO Representative",
        "Pharmaceutical Company / Industry Professional",
        "Regulator / Policy Maker",
        "Technology Partner / Digital Health",
        "Other"
      ]
    },
    otherMembershipType: {
      type: String,
      trim: true  // used when membershipType === "Other"
    },

    // ── Volunteer-only ─────────────────────────────
    area: {
      type: String,
      enum: [
        "Awareness Campaigns",
        "Patient Support",
        "Event Assistance",
        "Fundraising",
        "Social Media & Outreach"
      ]
    },

    // ── Internship-only ────────────────────────────
    college: {
      type: String,
      trim: true
    },
    resumePath: {
      type: String,  // stores file path like "uploads/resumes/filename.pdf"
      trim: true
    },

    // ── Status (all types) ─────────────────────────
    status: {
      type: String,
      enum: ["new", "reviewed", "accepted", "rejected"],
      default: "new"
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("GetInvolved", getInvolvedSchema);