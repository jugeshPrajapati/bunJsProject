import {type Request ,type Response} from 'express';
import { image_validator,generate_image_name } from '../validator/image_validator';
import { type UploadedFile} from 'express-fileupload';
import prisma from '../DB/db.config';

class ProfileController{
    static async index( req : Request, res : Response){

        try {
            const user =req.user;
            return res.json(user);
        } catch (error) {
            return res.status(500).json({message: " something went wrong!"});
        }
      
    }

    static async update(req : Request, res : Response){
        try {
            const {id} =req.params;
        const authUser =req.user;
        if (!req.files || Object.keys(req.files).length===0){
            return res.status(400).json({message : " profile image required"})
        }
        //solve error : Property 'size' does not exist on type 'UploadedFile | UploadedFile[]'.
        // Property 'size' does not exist on type 'UploadedFile[]
        //this is a TypeScript type assertion. It tells the TypeScript compiler to treat req.files.profile as an instance of the UploadedFile type.
        const profile_image  = req.files.profile as UploadedFile; //req.files.profile 
        //profile is the name of the file input field in the form, so req.files.profile refers to the uploaded file associated with that field
        //profile_image?.size uses optional chaining (?.) to safely access the size property of profile_image.
        //  If profile_image is undefined or null, it will return undefined instead of throwing an error.
        const message = image_validator(profile_image?.size , profile_image.mimetype);
        if (message!== null){
            return res.status(400).json({error:message});
        }

        const image_ext = profile_image?.name.split(".");
        const image_name = generate_image_name()+"."+image_ext.pop()
        // const upload_path=  Bun.pathToFileURL(`/public/images+${image_name}`);
        const upload_path =process.cwd()+`/public/images/${image_name}`
        console.log(upload_path); // "file:///foo/bar.txt"
        profile_image.mv(upload_path,(err)=>{
            if(err) throw err
        });
        await prisma.users.update({
            data:{
                profile:image_name
            },
            where:{
                id: Number(id)
            }
        })
        return res.status(200).json({
            name:profile_image.name,
            size:profile_image?.size,
            mime:profile_image?.mimetype,
            message:"profile image updated successfully"
        });
        } catch (error) {
            return res.status(500).json({error:"something wrong"});
        }
        
    }
}

export default  ProfileController;