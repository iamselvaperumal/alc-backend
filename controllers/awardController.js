const Award = require("../models/Award");

// @desc    Create Award/Certification
// @route   POST /api/awards
// @access  Private/Admin
const createAward = async (req, res) => {
  try {
    const {
      title,
      description,
      awardDate,
      issuingOrganization,
      certificate,
      imageUrl,
      category,
      displayOrder,
    } = req.body;

    const award = await Award.create({
      title,
      description,
      awardDate,
      issuingOrganization,
      certificate,
      imageUrl,
      category: category || "Award",
      displayOrder: displayOrder || 0,
    });

    res.status(201).json(award);
  } catch (error) {
    console.error("Error in createAward:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all awards
// @route   GET /api/awards
// @access  Public
const getAwards = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    const awards = await Award.find(query).sort({
      displayOrder: 1,
      awardDate: -1,
    });
    res.json(awards);
  } catch (error) {
    console.error("Error in getAwards:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get award by ID
// @route   GET /api/awards/:id
// @access  Public
const getAwardById = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (award) {
      res.json(award);
    } else {
      res.status(404).json({ message: "Award not found" });
    }
  } catch (error) {
    console.error("Error in getAwardById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update award
// @route   PUT /api/awards/:id
// @access  Private/Admin
const updateAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (award) {
      award.title = req.body.title || award.title;
      award.description = req.body.description || award.description;
      award.awardDate = req.body.awardDate || award.awardDate;
      award.issuingOrganization =
        req.body.issuingOrganization || award.issuingOrganization;
      award.certificate = req.body.certificate || award.certificate;
      award.imageUrl = req.body.imageUrl || award.imageUrl;
      award.category = req.body.category || award.category;
      award.displayOrder =
        req.body.displayOrder !== undefined
          ? req.body.displayOrder
          : award.displayOrder;

      await award.save();
      res.json(award);
    } else {
      res.status(404).json({ message: "Award not found" });
    }
  } catch (error) {
    console.error("Error in updateAward:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete award
// @route   DELETE /api/awards/:id
// @access  Private/Admin
const deleteAward = async (req, res) => {
  try {
    const award = await Award.findById(req.params.id);

    if (award) {
      await award.deleteOne();
      res.json({ message: "Award removed" });
    } else {
      res.status(404).json({ message: "Award not found" });
    }
  } catch (error) {
    console.error("Error in deleteAward:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAward,
  getAwards,
  getAwardById,
  updateAward,
  deleteAward,
};
