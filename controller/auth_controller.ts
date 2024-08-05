import prisma from '../DB/db.config';
import bcrypt from "bcryptjs";
import vine ,{errors} from "@vinejs/vine";
import { login_validator, register_validator } from '../validator/auth_validator';
import  { type Request, type Response} from 'express';
import jwt from 'jsonwebtoken';

class AuthController{
    static async register(req: Request, res: Response){
        try{
            const body = req.body;
            const validator =vine.compile(register_validator);
            const payload= await validator.validate(body);

            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password,salt);
            
            // check user exist
            const find_user = await prisma.users.findUnique({
                where:{
                    email:payload.email
                }
            });
            if(find_user){
                return res.status(400).json({errors:{
                    email:"email already exist"
                }})
            }
            const user = await prisma.users.create({
                data : payload,
            });

            return res.status(201).json({
                message: "user created successfully",
                user,
            });

        }catch(error){
                console.log(`error:${error}`)
                if(error instanceof errors.E_VALIDATION_ERROR){
                    console.log(error.messages);
                    return res.status(400).json({error:error.messages})
                }else{
                    return res.status(500).json({error:"something went wrong"})
                }
        }
    }

     static async login(req:Request ,res:Response){
        try {
            const payload= await vine.compile(login_validator).validate(req.body);
            //check if user exist
            const find_user = await prisma.users.findUnique({
                where:{
                    email: payload.email
                }
            })
            if (!Bun.env.JWT_SECRETE) {
                console.log('JWT secret is not defined');
                return res.status(500).json({
                    error: "something wrong"
                })
              };
            if (find_user){
                if (bcrypt.compareSync(payload.password,find_user.password)){
                    const jwt_payload = {
                        id :find_user.id,
                        name:find_user.name,
                        email:find_user.email,
                        profile:find_user.profile
                    };
                    const token = jwt.sign(
                        jwt_payload,
                        Bun.env.JWT_SECRETE,
                        {expiresIn: "59m",}
                    )

                    return res.status(200).json({
                        status: "login",
                        access_token: `Bearer ${token}`});
                }else{
                    return res.status(400).json({error:"invalid credential"});
                };

            }else{
                return res.status(400).json({error:"user does not exist"});
            };


        } catch (error) {
            console.log(`error:${error}`);
            if (error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({
                    error:error.messages
                })
            }else{
                return res.status(500).json({
                    error:"something wrong"
                })
            }
           
        }
       
     }
    
}

export default AuthController;