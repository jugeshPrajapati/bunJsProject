import vine from '@vinejs/vine';
import {JSONAPIErrorReporter} from '../utils/custom_error_reporter';
vine.errorReporter =()=>new JSONAPIErrorReporter();
export const news_validator =vine.object({
    title :vine.string().minLength(5).maxLength(200),
    content: vine.string().minLength(10).maxLength(30000),


});