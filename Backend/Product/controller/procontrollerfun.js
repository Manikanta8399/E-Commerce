//here
const productmodel = require("../Model/Product.js");
const permod = require("../Model/Person.js");
const cartmodel = require("../Model/Cart.js");
const ordermodel = require("../Model/Order.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
//posting data
const postproduct = async (req, res) => {
  try {
    const { name, price, discription, image } = req.body;
    const userr = new productmodel({ name, price, discription, image });
    await userr.save();
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//UPDATE DATA
const updateproduct = async (req, res) => {
  try {
    const { name, price, discription, image } = req.body;
    const userr = await productmodel.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        discription,
        image,
      },
      { new: true }
    );
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//DELETE PRODUCT
const deleteproduct = async (req, res) => {
  try {
    const userr = await productmodel.findByIdAndDelete(req.params.id);
    res.status(200).send("product deleted");
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//GET A SINGLE PRODUCT
const getproduct = async (req, res) => {
  try {
    const userr = await productmodel.findById(req.params.id);
    if (!userr) {
      return res.status(404).json({ message: "product not found" });
    }
    res.status(200).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//GET ALL PRODUCTS
const getallproduct = async (req, res) => {
  try {
    const userr = await productmodel.find();
    res.status(200).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//REGISTER
const posdata = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await permod.findOne({ email });
    if (user) {
      return res.status(400).send("user already exist");
    }
    const userr = new permod({ name, email, password, role });
    await userr.save();
    res.status(201).json(userr);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const secret = process.env.secretkey;
//LOGIN
const logdata = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await permod.findOne({ email });
    if (!user) {
      return res.status(400).send(" no emailuser not exist");
    }
    const checkpass = await bcrypt.compare(password, user.password);
    if (!checkpass) {
      return res.status(400).send(" wrong pass user not exist");
    }
    //creating token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      secret
    );
    res.status(200).json({ userdata: user, token: token });
  } catch (err) {
    res.send({ msg: err.message });
  }
};

//CART CONTROLLER FUNCTIONS
//ADDCART FUNCTION
const addcart = async (req, res) => {
  try {
    const productid = req.body.productid;
    const userid = req.user.id;
    let cart = await cartmodel.findOne({ user: userid });
    if (!cart) {
      cart = new cartmodel({
        user: userid,
        items: [{ product: productid, quantity: 1 }],
      });
    } else {
      let itemindex = cart.items.findIndex(
        (i) => productid == i.product.toString()
      );
      if (itemindex > -1) {
        cart.items[itemindex].quantity += 1;
      } else {
        cart.items.push({ product: productid, quantity: 1 });
      }
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//GET CARTITEMS
const getcart = async (req, res) => {
  const showcart = await cartmodel
    .findOne({ user: req.user.id })
    .populate("items.product");
  if (!showcart) {
    res.status(400).send("no products are added to cart");
  } else {
    res.status(201).json(showcart);
  }
};
//REMOVE PRODUCTS
const removecartitem = async (req, res) => {
  try {
    const showcart = await cartmodel.findOne({ user: req.user.id });
    const productid = req.body.productid;
    if (!showcart) {
      return res.status(400).send("no products are added to cart");
    }
    showcart.items = showcart.items.filter(
      (i) => productid != i.product.toString()
    );
    await showcart.save();
    res.status(201).json(showcart);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//UPDATE QUANTITY
const updatequantity = async (req, res) => {
  const showcart = await cartmodel.findOne({ user: req.user.id });
  const productid = req.body.productid;
  const quantity = req.body.quantity;
  if (quantity < 1) {
    return res.status(400).send("quantity must be at least 1");
  }
  if (!showcart) {
    return res.status(400).send("no products are added to cart");
  }
  const incrquan = showcart.items.findIndex(
    (i) => productid == i.product.toString()
  );
  if (incrquan === -1) {
    return res.status(404).send("product not found in cart");
  }
  showcart.items[incrquan].quantity = quantity;
  await showcart.save();
  res.status(200).json(showcart);
};
//ORDERS
//PLACING ORDER
const placeorder = async (req, res) => {
  try {
    const address = req.body.address;
    const userid = req.user.id;
    const cart = await cartmodel
      .findOne({ user: userid })
      .populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "cart is empty" });
    }
    let total = 0;
    cart.items.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    const order = new ordermodel({
      user: userid,
      items: cart.items,
      address: address,
      totalamount: total,
    });
    await order.save();
    cart.items = [];
    await cart.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
//to get orders by users
const getorder = async (req, res) => {
  try {
    const userid = req.user.id;
    const order = await ordermodel
      .findOne({ user: userid })
      .populate("items.product");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//TO GET ALL ORDERS BY ADMIN
const getallorder = async (req, res) => {
  try {
    const userid = req.user.id;
    const order = await ordermodel.find().populate("items.product");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//UPDATE STATUS BY ADMIN
const updatestatus = async (req, res) => {
  try {
    const userid = req.params.id;
    const status = req.body.orderstatus;
    const order = await ordermodel
      .findByIdAndUpdate(userid, { orderstatus: status }, { new: true })
      .populate("items.product");
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//CANCEL ORDER BY USER
const cancelorder = async (req, res) => {
  try {
    const orderid = req.params.id;
    const userid = req.user.id;
    const order = await ordermodel.findOne({ user: userid, _id: orderid });
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }
    if (order.orderstatus !== "pending") {
      return res.status(400).json({ message: "order  cant be cancelled " });
    }

    order.orderstatus = "cancel order";
    await order.save();
    return res.status(200).json({ message: "order  cancelled succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
//MOCK PAYMENT
const payment = async (req, res) => {
  try {
    const userid = req.user.id;
    const orderid = req.body.orderid;
    const paymentmethod = req.body.paymentmethod;
    const order = await ordermodel.findOne({ user: userid, _id: orderid });
    if (!order) {
      return res.status(400).json({ message: "order not found" });
    }
    order.paymentstatus = "success";
    order.paymentmethod = paymentmethod || "TEST_PAYMENT";
    await order.save();

    return res.status(200).json({ message: "payment succesfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
module.exports = {
  postproduct,
  updateproduct,
  getproduct,
  getallproduct,
  deleteproduct,
  posdata,
  logdata,
  addcart,
  getcart,
  removecartitem,
  updatequantity,
  placeorder,
  getorder,
  updatestatus,
  cancelorder,
  payment,
};
