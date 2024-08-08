import { news_validator } from "../validator/news_validator";
import vine, { errors } from '@vinejs/vine'
import {type Request, type Response} from 'express';
import { image_validator,generate_image_name, remove_image, upload_image } from '../validator/image_validator';
import { type UploadedFile} from 'express-fileupload';
import prisma from '../DB/db.config';
import {type NewsPayload } from "../utils/news_type";
import {NewsTransformer} from "../utils/news_transformer";

// The async keyword transforms a regular JavaScript function into an asynchronous function, causing it to return a Promise.
// The await keyword is used inside an async function to pause its execution and wait for a Promise to resolve before continuing.

export class NewsController{
    static async index(req : Request,res: Response){
        try {

            var page  : number  = Number(req.query.page) || 1;
            var limit : number =Number (req.query.limit) || 10 ;
            if (page <= 0){page= 1};
            if (limit <= 0 || limit > 100 ){limit= 10};
            var skip : number = (page-1)*limit;


            const news = await prisma.news.findMany({
                take:limit,
                skip: skip,
                include:{
                    user:{
                        select:{
                            id:true,
                            name:true,
                            profile:true,
                        },
                    },
                }
            });
            const transform_news =  news?.map((item)=>  NewsTransformer.news_transform(item));
            const total_news =await prisma.news.count();
            const total_page = Math.ceil(total_news/limit);

            return res.status(200).json({
                news:transform_news,
                metadata:{
                    total_page,
                    current_page:page,
                    current_limit:limit
                }
                });
        } catch (error) {
            return res.status(500).json("something went wrong");
        }
    };

    static async store(req : Request,res: Response){
        try {
            const user = req.user;
            const news_payload : NewsPayload = await vine.compile(news_validator).validate(req.body);
            //Object.keys(req.files) returns an array of the keys in the req.files object.
            //If the length of this array is 0, it means there are no files in the object.
            if ( !req.files|| Object.keys(req.files).length===0){
                return res.status(400).json({error:"image field is required"})};
            const image = req.files?.image as UploadedFile ;
            const message = image_validator(image?.size,image?.mimetype);
            if (message!=null){return res.status(400).json({errors:message})};
            // const image_ext = image?.name.split(".");
            // const image_name = generate_image_name()+"."+image_ext.pop()
            // // const upload_path=  Bun.pathToFileURL(`/public/images+${image_name}`);
            // const upload_path =process.cwd()+`/public/images/${image_name}`
            // console.log(upload_path); // "file:///foo/bar.txt"
            // image.mv(upload_path,(err)=>{if(err) throw err});
            const image_name = upload_image(image);
            news_payload.image = image_name;
            news_payload.user_id = user.id as number;
            await prisma.news.create({data:news_payload});
            return res.status(200).json({
                name:image.name,
                size:image?.size,
                mime:image?.mimetype,
                message:"news uploaded successfully"
            });
            
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({error: error.messages});

            }else{
                return res.status(500).json("something went wrong");
            } 
        }
        
    };

    static async show(req : Request,res: Response){
        //const { id } = req.params;, the curly braces {} are used for destructuring 
        //When you write const { id } = req.params;, you are telling JavaScript to take
        // the id property from the req.params object and create a variable named id with its value.
        //Without destructuring, you would write const id = req.params.id;.
        try {
            const {id} = req.params;
            const news =await prisma.news.findUnique({
            where:{id: Number(id)},
            include:{
                user:{
                    select:{
                        id:true,
                        name:true,
                        profile:true,
                    },
                },
            }
        });
        const transform_news = news ? NewsTransformer.news_transform(news)  : null;
        return res.status(200).json(transform_news);
        } catch (error) {
            return res.status(500).json("something went wrong");
        }
        
    };

    static async update(req : Request,res: Response){
        try {
            const {id} = req.params;
            const user =req.user;
            const news = await prisma.news.findUnique({
                where:{ id: Number(id)}});
            //authenticate user and id exist or not
            console.log(news);
            if(!news){
                return res.status(400).json({message:" news does not exist"})
            }
            if (user.id !== news?.user_id ){
                return res.status(400).json({message:" unauthorized user"})
            };
            
            // validate payload
            console.log("validate payload");
            const payload: NewsPayload = await vine.compile(news_validator).validate(req.body);
            console.log("validate image");
            const image =req?.files?.image as UploadedFile ; //new image from request
            //validate image
            
            if (image){
                const message = image_validator(image?.size,image?.mimetype);
                if(message!==null){ return res.status(400).json({ error: message }) };
                const image_name = upload_image(image);
                payload.image= image_name;
                remove_image(news.image); //image from existing news
            };
            console.log("update");
            await prisma.news.update({
                data:payload,
                where:{ id: Number(id)}});
            return res.status(200).json("news updated  successfully");
        } catch (error) {
            console.log(error);
            //handle validation error
            if (error instanceof errors.E_VALIDATION_ERROR){
                return res.status(400).json({error: error.messages});

            }else{
                //handle unexpected error
                return res.status(500).json("something went wrong");
            } 
        }
        };

        static async destroy(req : Request,res: Response){
            try {
                const {id} = req.params;
            const user =req.user;
            const news = await prisma.news.findUnique({
                where:{ id: Number(id)}});
            //authenticate user and id exist or not
            console.log(news);
            if(!news){
                return res.status(400).json({message:" news does not exist"})
            }
            if (user.id !== news?.user_id ){
                return res.status(400).json({message:" unauthorized user"})
            };
            remove_image(news.image);
            await prisma.news.delete({
                where : { id : Number(id)}
            });
            res.status(200).json("news deleted successfully");
            } catch (error) {
                return res.status(500).json("something went wrong");
     
            }
        }
    };


