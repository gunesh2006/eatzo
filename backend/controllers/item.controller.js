import Item from "../models/item.model.js";
import Shop from "../models/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const addItem = async (req, res) => {
  try {
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const shop = await Shop.findOne({ owner: req.userId });
    if (!shop) {
      return res.status(400).json({ message: "shop not found" });
    }
    const item = await Item.create({
      name,
      category,
      price,
      foodType,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items owner");
    return res.status(201).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `add item error:${error}` });
  }
};

export const editItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, category, foodType, price } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true },
    );
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId }).populate("items");
    return res.status(200).json(shop);
  } catch (error) {
    return res.status(500).json({ message: `edit item error:${error}` });
  }
};

export const getItemById = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    return res.status(200).json(item);
  } catch (error) {
    return res.status(500).json({ message: `get item by id error : ${error}` });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }
    const shop = await Shop.findOne({ owner: req.userId });
    shop.items = shop.items.filter((i) => i._id !== item._id);
    await shop.save();
    await shop.populate("items");
    return res.status(200).json(shop);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `delete item by id error : ${error}` });
  }
};

export const getAllItemsByCity = async (req, res) => {
  try {
    const { city } = req.params;
    if (!city) {
      return res.status(400).json({ message: "city is required" });
    }
    const shops = await Shop.find({
      city: { $regex: new RegExp(`^${city}$`, "i") }, //matches city despite having it in anyCase
    }).populate("items");
    if (shops.length === 0) {
      return res.status(400).json(`shops not found`);
    }
    const shopIds = shops.map((shop) => shop._id);
    const items = await Item.find({ shop: { $in: shopIds } });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ message: `get all items error : ${error}` });
  }
};

export const rating = async (req, res) => {
  try {
    const { itemId, rating } = req.body;
    if (!itemId || !rating) {
      return res.status(400).json({ message: "rating and item required" });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating must be between 1 to 5" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(400).json({ message: "item not found" });
    }

    const newCount = item?.rating?.count + 1;
    const newAverage =
      (item?.rating?.average * item?.rating?.count + rating) / newCount;

    item.rating.count = newCount;
    item.rating.average = Number(newAverage.toFixed(1));

    await item.save();

    return res.status(200).json({
      rating: item.rating,
    });
  } catch (error) {
    return res.status(500).json({ message: `rating error : ${error}` });
  }
};
