import prisma from '../DB/db.config';
import vine ,{errors} from "@vinejs/vine";
import { registerSchema } from '../validator/auth_validator';
import  { type Request, type Response} from 'express';

class AuthController{
    static async register(req: Request, res: Response){
        try{
            const body =req.body;
            const validator =vine.compile(registerSchema);
            const payload= await validator.validate(body);
            return res.status(200).json(body);
        }catch(error){
                if(error instanceof errors.E_VALIDATION_ERROR){
                    console.log(error.messages);
                    return res.status(400).json({error:error.messages})
                }
        }
    }
    
}
