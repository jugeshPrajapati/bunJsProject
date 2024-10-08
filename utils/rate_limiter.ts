import rateLimit from "express-rate-limit";
export const limiter = rateLimit({
    windowMs:1*60*1000,
    limit:100,
    standardHeaders:'draft-7',
    legacyHeaders:false,
});