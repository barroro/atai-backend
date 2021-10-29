import multer from "multer";
import imageFilter from "../utils/image-filter";
import storage from "../utils/storage";

const upload = multer({ storage: storage, fileFilter: imageFilter });

export default upload;
