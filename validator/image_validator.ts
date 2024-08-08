import { supportedMimes } from "../utils/image_support_types";
import {v4} from 'uuid';
import fs from "fs";

export const image_validator =(size: number,mime:string) : string | null=>{
    try {
        if (bytes_to_mb(size) > 5){
            return "image should be less than 5mb";
        }
        else if (!supportedMimes.includes(mime)){
            return "image must be png, jpg,jpeg";
        }
        return null;
    } catch (error) {
        if (error instanceof Error) {
            return  error.message;
          } else {
            return 'An unknown error occurred';
          }
    }
   
};

export const bytes_to_mb =(bytes:number):number=>{
    return bytes / ( 1024*1024);
};

export const generate_image_name = ()=>{ return v4() };

export const get_image_url = (image_name:string) =>{
    
    return `${Bun.env.APP_URL}/images/${image_name}`;
};

export const  remove_image =(image_name:string)=>{
    const path = process.cwd()+"/public/images/"+image_name;
    if (fs.existsSync(path)){
        fs.unlinkSync(path);
    }
};

export const upload_image =(image)=>{
            const image_ext = image?.name.split(".");
            const image_name = generate_image_name()+"."+image_ext.pop()
            // const upload_path=  Bun.pathToFileURL(`/public/images+${image_name}`);
            const upload_path =process.cwd()+`/public/images/${image_name}`
            console.log(upload_path); // "file:///foo/bar.txt"
            image.mv(upload_path,(err)=>{if(err) throw err});
            return image_name;

};