import Orders from "../models/orders/orders.js";
import User from "../models/user/user.js";
import fs from "fs-extra";
import { fileURLToPath } from "url";
// Import archiver for creating ZIP archives
import archiver from "archiver";
import { isValidObjectId } from "mongoose";
// Import path (native Node.js module)
import path from "path";
export const getDesignTasks = async (req, res) => {
  try {
    const userid = req.user;
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const designTasks = await Orders.find({ assignedTo: userid })
      .skip(skip)
      .limit(limit);

    const total = await Orders.countDocuments();

    if (designTasks.length === 0) {
      return res.status(404).json({ message: "No design tasks found" });
    }

    const userdetails = await User.find({ _id: designTasks[0].userId });

    res.status(200).json({
      status: "success",
      data: designTasks,
      userdetails,
      pagination: {
        page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getAllDesignImages = async (req, res) => {
  try {
    const orderId = req.params.orderId;

    // Validate orderId format
    if (!isValidObjectId(orderId)) {
      // Check if it matches the custom identifier format
      const isCustomIdValid = /^[A-Z]{3}-\d{10}$/.test(orderId); // Adjust regex as needed
      if (!isCustomIdValid) {
        return res.status(400).json({ message: "Invalid orderId format" });
      }
    }

    // Query the order using the custom identifier (e.g., orderId)
    const order = await Orders.findOne({ orderId });

    if (!order) {
      return res
        .status(404)
        .json({ message: `Order with ID ${orderId} not found` });
    }

    const filenames = order.filenames || [];

    if (!filenames || filenames.length === 0) {
      return res
        .status(404)
        .json({ message: `No images found for order ID ${orderId}` });
    }

    const uploadDir = path.join(__dirname, "..", "uploads", "orders");

    // Ensure the temp directory exists
    const tempDir = path.join(__dirname, "temp");
    await fs.ensureDir(tempDir);

    // Create the zip file path
    const zipFilePath = path.join(tempDir, `${orderId}.zip`);

    // Create a write stream for the zip file
    const output = fs.createWriteStream(zipFilePath);
    const archive = archiver("zip", { zlib: { level: 9 } });

    output.on("close", async () => {
      res.download(zipFilePath, `${orderId}_images.zip`, async (err) => {
        if (err) {
          console.error("Error sending zip file:", err);
        }
        // Clean up temporary files and directory
        await cleanupTempFiles(tempDir, zipFilePath);
      });
    });

    archive.on("error", async (err) => {
      console.error("Error creating zip archive:", err);
      await cleanupTempFiles(tempDir, zipFilePath);
      res.status(500).json({ message: "Failed to create zip archive" });
    });

    archive.pipe(output);

    for (const filename of filenames) {
      const sourceFilePath = path.join(uploadDir, filename);
      try {
        await fs.access(sourceFilePath);
        archive.file(sourceFilePath, { name: filename });
      } catch (err) {
        console.error(`File not found: ${sourceFilePath}`);
      }
    }

    await archive.finalize();
  } catch (error) {
    console.error("Error downloading images:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Helper function to clean up temporary files
const cleanupTempFiles = async (tempDir, zipFilePath) => {
  try {
    if (zipFilePath) {
      await fs.remove(zipFilePath);
    }
    if (tempDir) {
      await fs.emptyDir(tempDir); // Empty the temp directory after use
    }
  } catch (err) {
    console.error("Error cleaning up temporary files:", err);
  }
};