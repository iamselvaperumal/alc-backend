const ClientOrder = require("../models/ClientOrder");

// @desc    Place new order
// @route   POST /api/orders
// @access  Private (Client/Admin)
const createOrder = async (req, res) => {
  try {
    const { items, deadline, deliveryAddress, priority, remarks } = req.body;

    let clientId = req.user._id;
    if (req.user.role === "Admin") {
      if (!req.body.client) {
        return res
          .status(400)
          .json({ message: "Admin must specify a client for the order" });
      }
      clientId = req.body.client;
    }

    // Calculate total amount
    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.totalPrice || 0;
    });

    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const order = await ClientOrder.create({
      orderNumber,
      client: clientId,
      items,
      totalAmount,
      deadline,
      deliveryAddress,
      priority: priority || "Medium",
      remarks,
      status: "Order Received",
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Error in createOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "Client") {
      query.client = req.user._id;
    }

    const { status, startDate, endDate } = req.query;

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.orderDate = {};
      if (startDate) {
        query.orderDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.orderDate.$lt = new Date(
          new Date(endDate).getTime() + 24 * 60 * 60 * 1000,
        );
      }
    }

    const orders = await ClientOrder.find(query)
      .populate("client", "username email phone")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("Error in getOrders:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await ClientOrder.findById(req.params.id).populate(
      "client",
      "username email phone address",
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error in getOrderById:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update Order Status
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrder = async (req, res) => {
  try {
    const order = await ClientOrder.findById(req.params.id);

    if (order) {
      order.status = req.body.status || order.status;
      order.totalAmount = req.body.totalAmount || order.totalAmount;
      order.advanceAmount = req.body.advanceAmount || order.advanceAmount;
      order.deadline = req.body.deadline || order.deadline;
      order.deliveryDate = req.body.deliveryDate || order.deliveryDate;
      order.deliveryAddress = req.body.deliveryAddress || order.deliveryAddress;
      order.remarks = req.body.remarks || order.remarks;
      order.invoiceNumber = req.body.invoiceNumber || order.invoiceNumber;
      order.priority = req.body.priority || order.priority;

      if (req.body.items) {
        order.items = req.body.items;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error in updateOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await ClientOrder.findById(req.params.id);

    if (order) {
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } else {
      res.status(404).json({ message: "Order not found" });
    }
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available fabric types
// @route   GET /api/orders/fabrics
// @access  Public
const getFabricTypes = async (req, res) => {
  try {
    const fabricTypes = [
      "Cotton",
      "Silk",
      "Linen",
      "Wool",
      "Polyester",
      "Blend",
      "Rayon",
      "Denim",
      "Tencel",
      "Modal",
      "Lycra",
      "Flannel",
      "Voile",
      "Oxford",
      "Chambray",
    ];
    res.json(fabricTypes);
  } catch (error) {
    console.error("Error in getFabricTypes:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  getFabricTypes,
};
