import { supportedMimes } from "../utils/image_support_types";
import {v4} from 'uuid';

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