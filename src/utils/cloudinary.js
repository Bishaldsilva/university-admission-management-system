import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"
          
cloudinary.config({ 
  cloud_name: 'dpshezudg', 
  api_key: '647369551172285', 
  api_secret: 'IxF5I-8GRvhXlZI-ED9_-D9pp1A' 
});

const uploadOnCloud = async (localFilePath) => {
    try {
        if(!localFilePath) return null;
        const resource = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"raw"
        })
        fs.unlinkSync(localFilePath)
        return resource;

    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadOnCloud }