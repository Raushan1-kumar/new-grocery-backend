const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT, // like https://ik.imagekit.io/your_imagekit_id
});

const uploadImage = async (fileBuffer, fileName) => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,               // buffer directly
      fileName: fileName || "image",  // default file name
      folder: "grocery_products",     // optional folder in ImageKit
    });
    return response.url;
  } catch (err) {
    throw new Error(`ImageKit upload failed: ${err.message}`);
  }
};

module.exports = { uploadImage };
