import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    student_id: {
        type: String,
        required: true,
        unique: true
    },
    student_name: {
        type: String,
        required: true
    },
    total_marks: {
        type: Number,
        required: true
    },
    marks_obtained: {
        type: Number,
        required: true
    },
    percentage: {
        type: Number,
        required: true
    }
}, { timestamps: true });

export const Student = mongoose.model("Student", studentSchema);