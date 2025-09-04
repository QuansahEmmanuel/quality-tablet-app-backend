import Collection from "../model/tabletCollection.model.js";

// Start a new collection transaction
export const startCollection = async (req, res) => {
  try {
    const { building, shift } = req.body;

    // console.log(building, shift);

    if (!building || !shift) {
      return res
        .status(400)
        .json({ success: false, message: "Building and shift are required" });
    }

    const collection = new Collection({
      transaction: "COLLECTION",
      collectedBy: req.user._id,
      building,
      shift,
      items: [], // start empty
    });

    await collection.save();

    res.status(201).json({
      success: true,
      message: "Collection started successfully",
      collectionId: collection._id,
      data: collection,
    });
  } catch (error) {
    console.error("Error in startCollection:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Add an item to an existing collection
export const addItemToCollection = async (req, res) => {
  try {
    const { collectionId, tabletId, checkerId, lineIssuedTo } = req.body;

    // console.log(collectionId, tabletId, checkerId, lineIssuedTo);

    if (!collectionId || !tabletId || !checkerId || !lineIssuedTo) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    // Push item into items array
    collection.items.push({
      tabletId,
      checkerId,
      lineCollectedFrom: lineIssuedTo,
    });

    await collection.save();

    res.status(200).json({
      success: true,
      message: "Tablet successfully collected",
      data: collection,
    });
  } catch (error) {
    console.error("Error in addItemToCollection:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get collection by ID
export const getCollectionById = async (req, res) => {
  try {
    const { id } = req.params;

    const collection = await Collection.findById(id);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error("Error in getCollectionById:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all items in a collection
export const getAllCollectionItems = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ success: false, message: "Collection ID is required" });
    }

    const collection = await Collection.findById(id)
      .populate({
        path: "items.tabletId",
        select: "tabletName modelNumber serialNumber line",
      })
      .populate({
        path: "collectedBy",
        select: "name email",
      });

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, data: collection });
  } catch (error) {
    console.error("Error in getAllCollectionItems:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete a single item from collection
export const deleteItem = async (req, res) => {
  try {
    const { collectionId, itemId } = req.params;
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    collection.items = collection.items.filter(
      (item) => item._id.toString() !== itemId
    );
    await collection.save();

    res.json({ success: true, message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error in deleteItem:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete item" });
  }
};

// Delete multiple items from collection
export const deleteItems = async (req, res) => {
  try {
    const { collectionId } = req.params;
    const { itemIds } = req.body;

    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    collection.items = collection.items.filter(
      (item) => !itemIds.includes(item._id.toString())
    );
    await collection.save();

    res.json({ success: true, message: "Items deleted successfully" });
  } catch (error) {
    console.error("Error in deleteItems:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete items" });
  }
};

export default {
  startCollection,
  addItemToCollection,
  getCollectionById,
  getAllCollectionItems,
  deleteItem,
  deleteItems,
};
