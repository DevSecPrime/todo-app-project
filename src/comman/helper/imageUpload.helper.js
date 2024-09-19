import fs from "fs";
import path from "path";
import { STORAGE_PATH, SUPPORTED_FILETYPES } from "../constants/constants";
import { MAX_FILE_SIZE } from "../constants/constants";
import UnauthorizedException from "../exceptions/unAuthorized.exception";
import BadRequestException from "../exceptions/badRequest.exception";
import ConflictRequestException from "../exceptions/conflict.request.exception";

/**
 * Check if file type is supported
 * @param {string} fileType 
 * @param {string} supportedFileTye 
 * @returns 
 */
export const isSupportedFileType = (fileType, supportedFileTye) => {
    return supportedFileTye.includes(fileType);
}
/**
 * Upload image
 * @param {*} file 
 * @param {string} fileName 
 */
export const uploadImage = (file, fileName) => {
    
    //valiadte file
    if (!file) {
        throw new BadRequestException("Logo is required");
    }
    ///2. get file name
    const supportedFileType = SUPPORTED_FILETYPES

    const fileType = file.name.split(".").pop().toLowerCase();
   
    //chek file size
    if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException("File size must be less than 5MB");
    }

    //3. check if file type is supported
    if (!isSupportedFileType(fileType, supportedFileType)) {
        throw new ConflictRequestException("File must be png, jpg, jpeg, pdf, doc, docx, format");
    }

    //4. get file name
    // const fileName = `${Date.now()}-${file.name}`;

    //5. define file path
    const uploadPath = path.join(__dirname, STORAGE_PATH, fileName);


    //6. chek if file path exist or not if not create
    const isDirExist = path.dirname(uploadPath);
    if (!fs.existsSync(isDirExist)) {
        fs.mkdirSync(isDirExist, { recursive: true });
    };

    //7. upload file
    file.mv(uploadPath, (error) => {
        if (error) {
            throw new UnauthorizedException(error.message);
        }

    })
}

/**
 * Send file to storage
 * @param {file} file 
 * @returns 
 */
export const castToStorage = (fileName) => {
    return `${process.env.APP_URL}/storage/uploadImages/${fileName}`
}

