import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { processExcelFile } from "../middleware/ExcleProcessing.middleware.js";
import { 
    uploadStudentData, 
    getAllStudents, 
    updateStudent, 
    deleteStudent 
} from "../controller/student.controller.js";

const router = Router();

// Upload route with file processing middlewares
router.post("/upload", 
    upload.single('file'), 
    processExcelFile, 
    uploadStudentData
);

// Student CRUD routes
router.get("/list", getAllStudents);
router.put("/:studentId", updateStudent);
router.delete("/:studentId", deleteStudent);

export default router;