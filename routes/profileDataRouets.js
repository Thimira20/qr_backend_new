const express = require("express");
//const UserData = require("./models/UserData");
const { saveQrCode, getQrCodes, deleteQrCode, deleteAllQrCodes, toggleFavorite } = require("../controllers/firbase");
const router = express.Router();



router.post("/save-qr-code", saveQrCode);
router.get("/user-qr-codes/:userId", getQrCodes);
router.delete("/deleteqr/:qrCodeId", deleteQrCode);
router.delete("/deleteall/:userId", deleteAllQrCodes);
router.post("/favorite/:qrCodeId", toggleFavorite);

module.exports = router;
