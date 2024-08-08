import vine from "@vinejs/vine";
import {JSONAPIErrorReporter} from "../utils/custom_error_reporter"

vine.errorReporter =()=> new JSONAPIErrorReporter();
export const register_validator = vine.object({
    name: vine.string().minLength(2).maxLength(150),
    email:vine.string().email(),
    password:vine.string().minLength(6).maxLength(100).confirmed()
});
export const login_validator = vine.object({
    email:vine.string().email(),
    password:vine.string()
});