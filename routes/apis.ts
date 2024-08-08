import {Router} from 'express';
import AuthController from '../controller/auth_controller'; 
import ProfileController from '../controller/profile_controller'
import jwt_auth_middleware from '../middleware/jwt_auth';
import {NewsController} from '../controller/news_controller';
import { redis_cache } from '../DB/redis.config';
const router =Router()

//http://localhost:8080/api
// authorization api
router.post("/auth/register",AuthController.register);
router.post("/auth/login",AuthController.login);

// user profile api
router.get("/profile", jwt_auth_middleware,ProfileController.index);
router.put("/profile/image/:id", jwt_auth_middleware,ProfileController.update);

// news apis 
router.get("/news", NewsController.index);
router.get("/news/:id",NewsController.show);
router.post("/news",jwt_auth_middleware,NewsController.store);
router.put("/news/:id",jwt_auth_middleware, NewsController.update);
router.delete("/news/:id",jwt_auth_middleware, NewsController.destroy);

export default router;