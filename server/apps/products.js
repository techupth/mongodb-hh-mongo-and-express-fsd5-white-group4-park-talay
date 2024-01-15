import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

//assume hard code limit page = 5
const limitPage = 5;

const offsetPage = (page) => {
    return (page - 1) * limitPage;
};

const totalPage = (totalItem) => {
    return Math.ceil(totalItem / limitPage);
};

productRouter.get("/", async (req, res) => {
    const collection = db.collection("products");
    const category = req.query.category;
    const keywords = req.query.keywords;
    const page = req.query.page || 1;

    const query = {};

    if (category) {
        query.category = category;
    }

    if (keywords) {
        query.name = new RegExp(keywords, "i");
    }

    const totalItem = await collection.countDocuments(query);
    const products = await collection
        .find(query)
        .limit(limitPage)
        .skip(offsetPage(page))
        .sort({ created_at: -1 })
        .toArray();

    return res.json({ data: products, pages: totalPage(totalItem) });
});

productRouter.get("/:id", async (req, res) => {
    const collection = db.collection("products");
    const productID = new ObjectId(req.params.id);

    const product = await collection.findOne({ _id: productID });

    return res.json({
        data: product,
    });
});

productRouter.post("/", async (req, res) => {
    const collection = db.collection("products");

    const productData = { ...req.body, created_at: new Date() };
    await collection.insertOne(productData);

    return res.json({
        message: "Product has been created successfully",
    });
});

productRouter.put("/:id", async (req, res) => {
    const collection = db.collection("products");
    const productID = new ObjectId(req.params.id);

    const product = await collection.findOne({ _id: productID });
    const newProductData = { ...req.body };

    await collection.updateOne(
        {
            _id: productID,
        },
        {
            $set: newProductData,
        }
    );

    return res.json({
        message: "Product has been updated successfully",
    });
});

productRouter.delete("/:id", async (req, res) => {
    const collection = db.collection("products");
    const productID = new ObjectId(req.params.id);

    await collection.deleteOne({
        _id: productID,
    });

    return res.json({
        message: "Product has been deleted successfully",
    });
});

export default productRouter;
