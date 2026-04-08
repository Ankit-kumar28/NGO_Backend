import Service from "../models/service.model.js";
import Ngo from "../models/ngo.model.js";

export const createService = async (req, res) => {
  try {
    const { title,  description, visibility } = req.body;
    const filePath = `/uploads/${req.ngoName || "default"}/${req.file.filename}`;
    const image = filePath;
    const ngoId = req.ngoId;

    if (!image) {
      return res.status(400).json({ message: "Image is required" });
    }

    const newService = new Service({
      title,
      
      description,
      image,
      ngo: ngoId,
      visibility,
    });

    await newService.save();
    res.status(201).json(newService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find().populate("ngo");
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("ngo");
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateService = async (req, res) => {
  try {
    const { title,  description, visibility } = req.body;
    let image;
    const filePath = `/uploads/${req.ngoName || "default"}/${req.file.filename}`;
    if (req.file) {
      image = filePath;
    }

    const updatedData = {
      title,
      
      description,
      visibility,
    };

    if (image) {
      updatedData.image = image;
    }

    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    );

    if (!updatedService) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updatedService);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const deletedService = await Service.findByIdAndDelete(req.params.id);
    if (!deletedService) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
