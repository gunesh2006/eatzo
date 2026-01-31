import express from "express";
import { createEditShop } from "../controllers/shop.controller.js";
import isAuth from "../middlewares/isAuth.js";
import {
  addItem,
  deleteItem,
  editItem,
  getAllItemsByCity,
  getItemById,
  rating,
} from "../controllers/item.controller.js";
import { upload } from "../middlewares/multer.js";
import { getItemsByShop } from "../controllers/order.controller.js";

const itemRouter = express.Router();

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem);
itemRouter.post("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRouter.get("/get-by-id/:itemId", isAuth, getItemById);
itemRouter.get("/delete-item/:itemId", isAuth, deleteItem);
itemRouter.get("/get-all-items-by-city/:city", isAuth, getAllItemsByCity);
itemRouter.get("/get-items-by-shop/:shopId", isAuth, getItemsByShop);
itemRouter.post("/rating", isAuth, rating);
export default itemRouter;
