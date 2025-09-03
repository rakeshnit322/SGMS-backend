import XLSX from 'xlsx';
import { Student } from '../models/student.model.js';

export const processExcelFile = async (req, res, next) => {
    try {
        if (!req.file) {
            throw new Error('No file uploaded');
        }

        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Validate headers
        const requiredHeaders = ['Student_ID', 'Student_Name', 'Total_Marks', 'Marks_Obtained'];
        const fileHeaders = Object.keys(data[0]);
        
        const missingHeaders = requiredHeaders.filter(header => 
            !fileHeaders.includes(header)
        );

        if (missingHeaders.length > 0) {
            throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
        }

        // Process and validate data
        const processedData = data.map(row => ({
            student_id: row.Student_ID?.toString(),
            student_name: row.Student_Name,
            total_marks: Number(row.Total_Marks),
            marks_obtained: Number(row.Marks_Obtained),
            percentage: (Number(row.Marks_Obtained) / Number(row.Total_Marks)) * 100
        }));

        // Validate data types and required fields
        const invalidData = processedData.find(item => 
            !item.student_id || 
            !item.student_name ||
            isNaN(item.total_marks) ||
            isNaN(item.marks_obtained) ||
            item.total_marks <= 0 ||
            item.marks_obtained < 0 ||
            item.marks_obtained > item.total_marks
        );

        if (invalidData) {
            throw new Error('Invalid data found in Excel file');
        }

        req.processedData = processedData;
        next();

    } catch (error) {
        next(error);
    }
};