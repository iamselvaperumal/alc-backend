const Enquiry = require("../models/Enquiry");

// @desc    Submit Enquiry (Public)
// @route   POST /api/enquiry
// @access  Public
const createEnquiry = async (req, res) => {
  try {
    const { name, email, subject, message, phone } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    const enquiry = await Enquiry.create({
      name,
      email,
      subject,
      message,
      phone,
      status: "New",
    });

    res.status(201).json({
      message: "Enquiry submitted successfully",
      enquiry,
    });
  } catch (error) {
    console.error("Error in createEnquiry:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Enquiries
// @route   GET /api/enquiry
// @access  Private/Admin
const getEnquiries = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status) {
      query.status = status;
    }

    const enquiries = await Enquiry.find(query).sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (error) {
    console.error("Error in getEnquiries:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enquiry by ID
// @route   GET /api/enquiry/:id
// @access  Private/Admin
const getEnquiryById = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      res.json(enquiry);
    } else {
      res.status(404).json({ message: "Enquiry not found" });
    }
  } catch (error) {
    console.error("Error in getEnquiryById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiry/:id
// @access  Private/Admin
const updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      enquiry.status = req.body.status || enquiry.status;
      enquiry.subject = req.body.subject || enquiry.subject;
      enquiry.message = req.body.message || enquiry.message;

      await enquiry.save();
      res.json(enquiry);
    } else {
      res.status(404).json({ message: "Enquiry not found" });
    }
  } catch (error) {
    console.error("Error in updateEnquiry:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete enquiry
// @route   DELETE /api/enquiry/:id
// @access  Private/Admin
const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (enquiry) {
      await enquiry.deleteOne();
      res.json({ message: "Enquiry removed" });
    } else {
      res.status(404).json({ message: "Enquiry not found" });
    }
  } catch (error) {
    console.error("Error in deleteEnquiry:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
};
