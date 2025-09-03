import { Student } from "../models/student.model.js";
import fs from 'fs/promises';
import mongoose from "mongoose";

export const uploadStudentData = async (req, res, next) => {
    try {
        const students = req.processedData;
        
        // Insert many with ordered: false to continue even if some documents fail
        const result = await Student.insertMany(students, { ordered: false });
        
        // Cleanup: Remove temporary file
        if (req.file) {
            await fs.unlink(req.file.path);
        }

        return res.status(201).json({
            success: true,
            message: "Students data uploaded successfully",
            data: {
                totalProcessed: students.length,
                insertedCount: result.length
            }
        });
    } catch (error) {
        // Handle duplicate key errors gracefully
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Some students were not inserted due to duplicate IDs",
                error: error.message
            });
        }
        next(error);
    }
};

export const getAllStudents = async (req, res, next) => {
    try {
        const students = await Student.find()
            .sort({ createdAt: -1 }); // Latest first

        return res.status(200).json({
            success: true,
            message: "Students retrieved successfully",
            data: students,
            count: students.length
        });
    } catch (error) {
        next(error);
    }
};


export const updateStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const { marks_obtained, total_marks } = req.body;

        // Validate input
        if (!marks_obtained || !total_marks) {
            return res.status(400).json({
                success: false,
                message: "Both marks_obtained and total_marks are required"
            });
        }

        // Calculate new percentage
        const percentage = (marks_obtained / total_marks) * 100;

        // Search by ObjectId or student_id
        const query = mongoose.isValidObjectId(studentId) 
            ? { _id: studentId }
            : { student_id: studentId };

        const student = await Student.findOneAndUpdate(
            query,
            {
                marks_obtained,
                total_marks,
                percentage
            },
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student updated successfully",
            data: student
        });
    } catch (error) {
        next(error);
    }
};

export const deleteStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // Search by ObjectId or student_id
        const query = mongoose.isValidObjectId(studentId) 
            ? { _id: studentId }
            : { student_id: studentId };

        const student = await Student.findOneAndDelete(query);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Student deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};





// export const updateStudent = async (req, res, next) => {
//     try {
//         const { studentId } = req.params;
//         const { marks_obtained, total_marks } = req.body;

//         // Validate input
//         if (!marks_obtained || !total_marks) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Both marks_obtained and total_marks are required"
//             });
//         }

//         // Calculate new percentage
//         const percentage = (marks_obtained / total_marks) * 100;

//         const student = await Student.findByIdAndUpdate(
//             studentId,
//             {
//                 marks_obtained,
//                 total_marks,
//                 percentage
//             },
//             { new: true, runValidators: true }
//         );

//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Student updated successfully",
//             data: student
//         });
//     } catch (error) {
//         next(error);
//     }
// };






// export const deleteStudent = async (req, res, next) => {
//     try {
//         const { studentId } = req.params;

//         const student = await Student.findByIdAndDelete(studentId);

//         if (!student) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Student not found"
//             });
//         }

//         return res.status(200).json({
//             success: true,
//             message: "Student deleted successfully"
//         });
//     } catch (error) {
//         next(error);
//     }
// };