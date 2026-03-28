import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from "fs"

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
    api_key: process.env.CLOUNDNARY_API_KEY, 
    api_secret: process.env.CLOUNDNARY_API_SECRET 
})
const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloundinary
        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })
        //file has been uploaded successfull
        console.log("file is uploaded on cloundinary", response.url);
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath)// remove the locally saved temporary file as the upload got filed
        return null;
    }
}

export {uploadOnCloudinary}