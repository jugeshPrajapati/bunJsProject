import {Router} from 'express';
import AuthController from '../controller/auth_controller'; 
import ProfileController from '../controller/profile_controller'
import jwt_auth_middleware from '../middleware/jwt_auth';
const router =Router()

//http://localhost:8080/api
// authorization api
router.post("/auth/register",AuthController.register);
router.post("/auth/login",AuthController.login);

// user profile api
router.get("/profile", jwt_auth_middleware,ProfileController.index);
router.put("/profile/image/:id", jwt_auth_middleware,ProfileController.update);
export default router;