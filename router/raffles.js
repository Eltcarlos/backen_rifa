const { Router } = require("express");
const raffles = require("../controllers/raffles");
const router = Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, `clone_${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/all", raffles.getAllRaffles);
router.get("/fetch/:id", raffles.getRaffleById);
router.put("/update/:id", raffles.updateRaffle);
router.post("/create", upload.fields([{ name: "posterImage" }, { name: "backgroundImage" }]), raffles.createRaffle);
router.delete("/delete/:id", raffles.deleteRaffle);

module.exports = router;
