import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "images/");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const checkFileType = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  if (
    filetypes.test(path.extname(file.originalname).toLowerCase()) &&
    filetypes.test(file.mimetype)
  )
    cb(null, true);
  else cb("Chỉ cho phép tải lên hình ảnh!");
};

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => checkFileType(file, cb),
});

router.post("/", upload.single("image"), (req, res) => {
  res.send(`/${req.file.path.replace(/\\/g, "/")}`);
});

export default router;
