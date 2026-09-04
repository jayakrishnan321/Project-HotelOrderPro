const express = require("express");
const router = express.Router();
const multer = require("multer");

const Food = require("../models/Foods");

// Cloudinary functions
const {
  uploadToCloudinary,
  deleteFromCloudinary,
} = require("../utils/cloudinaryUpload");


// ==========================================
// MULTER CONFIGURATION
// ==========================================

const storage = multer.memoryStorage();

const imageFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Only image files are allowed!"),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter: imageFilter,

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});


// ==========================================
// CHECK CLOUDINARY CONFIGURATION
// ==========================================

function cloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}


// ==========================================
// POST: UPLOAD FOOD
// Image → Cloudinary
// URL + Public ID → MongoDB
// ==========================================

router.post(
  "/upload",
  upload.single("foodimage"),

  async (req, res) => {
    try {

      console.log(
        "[FoodRoute] POST /api/foods/upload"
      );


      // ======================================
      // CHECK CLOUDINARY ENV VARIABLES
      // ======================================

      if (!cloudinaryConfigured()) {

        const missing = [

          !process.env.CLOUDINARY_CLOUD_NAME &&
            "CLOUDINARY_CLOUD_NAME",

          !process.env.CLOUDINARY_API_KEY &&
            "CLOUDINARY_API_KEY",

          !process.env.CLOUDINARY_API_SECRET &&
            "CLOUDINARY_API_SECRET",

        ].filter(Boolean);


        console.error(
          "[FoodRoute] Cloudinary not configured. Missing:",
          missing
        );


        return res.status(503).json({

          error:
            "Cloudinary storage is not configured.",

          missing,

        });

      }


      // ======================================
      // CHECK IMAGE
      // ======================================

      if (!req.file) {

        console.error(
          "[FoodRoute] No file received."
        );

        console.log(
          "[FoodRoute] Body keys:",
          Object.keys(req.body || {})
        );


        return res.status(400).json({

          error:
            "foodimage file is required",

        });

      }


      // ======================================
      // GET FORM DATA
      // ======================================

      const {

        foodname,

        foodtype,

        foodnonacprice,

        foodacprice,

        fooddescription,

        adminId,

        adminemail,

      } = req.body;


      console.log(
        "[FoodRoute] Body received:",
        {

          foodname,

          foodtype,

          foodnonacprice,

          foodacprice,

          fooddescriptionLength:
            (fooddescription || "").length,

          adminId,

          adminemail,

        }
      );


      // ======================================
      // LOG MULTER FILE
      // ======================================

      console.log(
        "[FoodRoute] Multer file received:",
        {

          originalname:
            req.file.originalname,

          mimetype:
            req.file.mimetype,

          size:
            req.file.size,

          bufferLength:
            req.file.buffer
              ? req.file.buffer.length
              : 0,

        }
      );


      // ======================================
      // UPLOAD IMAGE TO CLOUDINARY
      // ======================================

      console.log(
        "[FoodRoute] Uploading image to Cloudinary..."
      );


      const cloudinaryResult =
        await uploadToCloudinary(
          req.file
        );


      console.log(
        "[FoodRoute] Cloudinary upload finished."
      );


      console.log(
        "[FoodRoute] Image URL:",
        cloudinaryResult.secure_url
      );


      console.log(
        "[FoodRoute] Public ID:",
        cloudinaryResult.public_id
      );


      // ======================================
      // SAVE FOOD TO MONGODB
      // ======================================

      const food = new Food({

        foodname,

        foodtype,

        foodnonacprice,

        foodacprice,

        fooddescription,


        // Cloudinary URL
        foodimage:
          cloudinaryResult.secure_url,


        // Cloudinary Public ID
        imagePublicId:
          cloudinaryResult.public_id,


        adminId,

        adminemail,

      });


      console.log(
        "[FoodRoute] Saving food to MongoDB..."
      );


      await food.save();


      console.log(
        "[FoodRoute] Food saved. ID:",
        food._id?.toString?.()
      );


      // ======================================
      // SUCCESS RESPONSE
      // ======================================

      res.status(201).json({

        message:
          "Food item added successfully",

        foodimage:
          cloudinaryResult.secure_url,

        food,

      });


    } catch (err) {

      console.error(
        "[FoodRoute] Upload Error:"
      );

      console.error(err);


      res.status(500).json({

        error:
          "Failed to upload food item",

        message:
          err.message,

      });

    }

  }
);



// ==========================================
// GET FOOD ITEMS BY ADMIN ID
// ==========================================

router.get(
  "/fooditems/:id",

  async (req, res) => {

    try {

      const foods =
        await Food.find({

          adminId:
            req.params.id,

        });


      res.json(foods);


    } catch (err) {

      console.error(err);


      res.status(500).json({

        error:
          "Failed to get food items",

        message:
          err.message,

      });

    }

  }
);



// ==========================================
// GET FOOD ITEMS BY EMAIL
// ==========================================

router.get(
  "/users/fooditems/:email",

  async (req, res) => {

    try {

      const email =
        req.params.email.toLowerCase();


      const foods =
        await Food.find({

          adminemail:
            email,

        });


      res.json(foods);


    } catch (err) {

      console.error(err);


      res.status(500).json({

        error:
          "Failed to get food items",

        message:
          err.message,

      });

    }

  }
);



// ==========================================
// GET SINGLE FOOD
// ==========================================

router.get(
  "/:id",

  async (req, res) => {

    try {

      const food =
        await Food.findById(
          req.params.id
        );


      if (!food) {

        return res.status(404).json({

          message:
            "Food not found",

        });

      }


      res.json(food);


    } catch (err) {

      console.error(err);


      res.status(500).json({

        error:
          "Failed to get food",

        message:
          err.message,

      });

    }

  }
);



// ==========================================
// DELETE FOOD
// Delete Image From Cloudinary
// Delete Food From MongoDB
// ==========================================

router.delete(
  "/:id",

  async (req, res) => {

    try {

      // ====================================
      // FIND FOOD
      // ====================================

      const food =
        await Food.findById(
          req.params.id
        );


      if (!food) {

        return res.status(404).json({

          message:
            "Food not found",

        });

      }


      // ====================================
      // DELETE IMAGE FROM CLOUDINARY
      // ====================================

      if (

        cloudinaryConfigured() &&

        food.imagePublicId

      ) {

        try {

          console.log(
            "[FoodRoute] Deleting image from Cloudinary..."
          );


          await deleteFromCloudinary(

            food.imagePublicId

          );


          console.log(
            "[FoodRoute] Image deleted from Cloudinary."
          );


        } catch (e) {

          console.warn(

            "[FoodRoute] Cloudinary delete failed:",

            e.message

          );

        }

      }


      // ====================================
      // DELETE FOOD FROM MONGODB
      // ====================================

      await Food.findByIdAndDelete(
        req.params.id
      );


      res.status(200).json({

        message:
          "Food item deleted successfully",

      });


    } catch (err) {

      console.error(err);


      res.status(500).json({

        message:
          "Delete failed",

        error:
          err.message,

      });

    }

  }
);



// ==========================================
// UPDATE FOOD
// If new image:
// Delete old Cloudinary image
// Upload new Cloudinary image
// ==========================================

router.put(
  "/edit/:id",

  upload.single("foodimage"),

  async (req, res) => {

    try {

      console.log(
        "[FoodRoute] PUT /api/foods/edit/:id"
      );


      // ====================================
      // CHECK CLOUDINARY ONLY IF IMAGE
      // IS BEING UPLOADED
      // ====================================

      if (

        req.file &&

        !cloudinaryConfigured()

      ) {

        return res.status(503).json({

          error:
            "Cloudinary storage is not configured.",

        });

      }


      // ====================================
      // GET REQUEST DATA
      // ====================================

      const {

        foodname,

        foodtype,

        foodnonacprice,

        foodacprice,

        fooddescription,

      } = req.body;


      const updateFields = {

        foodname,

        foodtype,

        foodnonacprice,

        foodacprice,

        fooddescription,

      };


      // ====================================
      // IF NEW IMAGE IS UPLOADED
      // ====================================

      if (req.file) {

        console.log(
          "[FoodRoute] New image received."
        );


        // Find existing food
        const existing =
          await Food.findById(
            req.params.id
          );


        if (!existing) {

          return res.status(404).json({

            message:
              "Food not found",

          });

        }


        // ==================================
        // DELETE OLD IMAGE
        // ==================================

        if (

          existing.imagePublicId

        ) {

          try {

            console.log(
              "[FoodRoute] Deleting old Cloudinary image..."
            );


            await deleteFromCloudinary(

              existing.imagePublicId

            );


            console.log(
              "[FoodRoute] Old image deleted."
            );


          } catch (e) {

            console.warn(

              "[FoodRoute] Old image delete failed:",

              e.message

            );

          }

        }


        // ==================================
        // UPLOAD NEW IMAGE
        // ==================================

        console.log(
          "[FoodRoute] Uploading new image..."
        );


        const cloudinaryResult =
          await uploadToCloudinary(

            req.file

          );


        // Save new image URL
        updateFields.foodimage =
          cloudinaryResult.secure_url;


        // Save new public ID
        updateFields.imagePublicId =
          cloudinaryResult.public_id;


        console.log(
          "[FoodRoute] New image uploaded:",
          cloudinaryResult.secure_url
        );

      }


      // ====================================
      // UPDATE FOOD IN MONGODB
      // ====================================

      const updatedFood =
        await Food.findByIdAndUpdate(

          req.params.id,

          updateFields,

          {

            new: true,

          }

        );


      if (!updatedFood) {

        return res.status(404).json({

          message:
            "Food not found",

        });

      }


      res.status(200).json({

        message:
          "Food updated successfully",

        food:
          updatedFood,

      });


    } catch (err) {

      console.error(
        "[FoodRoute] Update Error:"
      );

      console.error(err);


      res.status(500).json({

        error:
          "Update failed",

        message:
          err.message,

      });

    }

  }
);


module.exports = router;