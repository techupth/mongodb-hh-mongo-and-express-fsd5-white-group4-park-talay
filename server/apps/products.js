import { Router, json } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find({ category: "it" }).toArray();
    return res.json({ data: products });
  } catch {
    return res.json({ message: "can't get product from database" });
  }
});

productRouter.get("/:id", (req, res) => {});

productRouter.post("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productData = {
      ...req.body,
    };
    const product = await collection.insertOne(productData);
    return res.json({ message: "Product has been created successfully" });
  } catch {
    return res.json({ message: "can't create new products" });
  }
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const targetID = new ObjectId(req.params.id);
  const newProduct = { ...req.body };

  try {
    await collection.updateOne({ _id: targetID }, { $set: newProduct });
    return res.json({
      message: `Product ${targetID} has been updated successfully`,
    });
  } catch {
    return res.json({
      message: "Product can't updated ",
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  try {
    const targetID = new ObjectId(req.params.id);
    const collection = db.collection("products");

    await collection.deleteOne({ _id: targetID });
    return res.json({
      message: `Product ID ${targetID} has been deleted successfully`,
    });
  } catch {
    return res.json({
      message: "Product can't deleted ",
    });
  }
});

export default productRouter;
