import express, { type Request, type Response, type NextFunction, type Express } from 'express';
import routes from "../routes/apis";
import  fileUpload from "express-fileupload";
import helmet from 'helmet';
import cors from "cors";
import {limiter} from "../utils/rate_limiter";
import apicache from 'apicache';
const app: Express = express();
//  you won't need dotenv to install in bun js
const port = Bun.env.PORT || 8081;
const cache = apicache.middleware

app.use(cache('50 minutes'))

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(fileUpload());

app.use(helmet());

app.use(cors());
app.use(limiter); // it should be above express static
app.use(express.static("public"));

app.use("/",routes);
// app.get(
//   '/',
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//       res.status(200).json({
//         message: 'Hurray!! we create our first server on bun js hot updated ',
//       });
//     } catch (error) { next(error); }

//   },
// );

app.listen(port, () => {
  console.log(`Server is up and running on port localhost: http://localhost:${port}`);
});