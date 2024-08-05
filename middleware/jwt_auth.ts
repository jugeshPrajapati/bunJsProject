import jwt  from 'jsonwebtoken';
import {type Request, type Response, type NextFunction} from "express";

const jwt_auth_middleware = ( req :Request ,res : Response , next : NextFunction)=>{
    const authHeader = req.headers.authorization ;
    if (authHeader === null || authHeader === undefined){
        return res.status(401).json({
            status : 401,
            error : "unauthorize user "})
    }
    const token = authHeader.split(" ")[1]
    if (!Bun.env.JWT_SECRETE) {
        console.log('JWT secret is not defined');
        return res.status(500).json({
            error: "something wrong"
        })
    };
    jwt.verify(token , Bun.env.JWT_SECRETE,(err:any ,user:any) =>{
        if(err){
            return res.status(401).json({
                error: "unauthorize user"
            })
        }
        req.user =user;
        next();
    })
};
export default jwt_auth_middleware;