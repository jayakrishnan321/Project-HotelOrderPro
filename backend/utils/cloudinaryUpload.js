const cloudinary =
  require("../config/cloudinary");


// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================

const uploadToCloudinary =
  (file) => {

    return new Promise(
      (resolve, reject) => {

        const uploadStream =

          cloudinary.uploader.upload_stream(

            {

              folder:
                "foodroute",

              resource_type:
                "image",

            },


            (error, result) => {

              if (error) {

                console.error(
                  "[Cloudinary] Upload Error:",
                  error
                );


                return reject(
                  error
                );

              }


              resolve(
                result
              );

            }

          );


        // Upload Multer buffer
        uploadStream.end(

          file.buffer

        );

      }

    );

  };



// ==========================================
// DELETE IMAGE FROM CLOUDINARY
// ==========================================

const deleteFromCloudinary =
  async (publicId) => {

    try {

      const result =

        await cloudinary.uploader.destroy(

          publicId,

          {

            resource_type:
              "image",

          }

        );


      console.log(

        "[Cloudinary] Delete Result:",

        result

      );


      return result;


    } catch (error) {

      console.error(

        "[Cloudinary] Delete Error:",

        error

      );


      throw error;

    }

  };



module.exports = {

  uploadToCloudinary,

  deleteFromCloudinary,

};