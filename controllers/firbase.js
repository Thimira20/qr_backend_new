const UserData = require("../models/userDataModel");
// Add Firebase Admin SDK for uploading images
const admin = require("firebase-admin");
//const serviceAccount = require("../routes/serviceAccountKey.json");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://qr-code-generator-7c436.appspot.com",
});

exports.bucket = admin.storage().bucket();

exports.saveQrCode = async (req, res) => {
  try {
    const { userId, qrText, qrImageBase64 } = req.body;

    // Upload image to Firebase Storage
    const buffer = Buffer.from(qrImageBase64, "base64");
    const fileName = `qr-codes/${userId}/${Date.now()}.png`;
    const file = this.bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: "image/png" },
      public: true,
    });

    const qrImageUrl = `https://storage.googleapis.com/${this.bucket.name}/${fileName}`;

    const userData = new UserData({ userId, qrText, qrImageUrl });
    await userData.save();

    res.status(201).json({ message: "QR Code saved successfully!" });
  } catch (error) {
    console.error("Error saving QR code:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getQrCodes = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const qrCodes = await UserData.find({ userId });

    res.status(200).json(qrCodes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteQrCode = async (req, res) => {
  try {
    const { qrCodeId } = req.params;
    console.log(qrCodeId);
    const qrCode = await UserData.findById(qrCodeId);
   

    if (!qrCode) {
      return res.status(404).json({ message: "QR Code not found" });
    }

    // Delete from Firebase Storage
    const fileName = qrCode.qrImageUrl.split(`${this.bucket.name}/`)[1];
    const file = this.bucket.file(fileName);
    await file.delete();

    //await qrCode.remove();
    await UserData.findByIdAndDelete(qrCodeId);
    res.status(200).json({ message: "QR Code deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAllQrCodes = async (req, res) => {
  try {
    const { userId } = req.params;
    const qrCodes = await UserData.find({ userId });

    for (const qrCode of qrCodes) {
      const fileName = qrCode.qrImageUrl.split(`${this.bucket.name}/`)[1];
      const file = this.bucket.file(fileName);
      await file.delete();
    }

    await UserData.deleteMany({ userId });
    res.status(200).json({ message: "All QR Codes deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.toggleFavorite = async (req, res) => {
  try {
    const { qrCodeId } = req.params;
    const qrCode = await UserData.findById(qrCodeId);

    if (!qrCode) {
      return res.status(404).json({ message: "QR Code not found" });
    }

    qrCode.isFavorite = !qrCode.isFavorite;
    await qrCode.save();
    res.status(200).json({ message: "Favorite status updated", qrCode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


