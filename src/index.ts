import express, { type Request, type Response, type NextFunction, type Express } from 'express';
import routes from "../routes/apis";

const app: Express = express();
//  you won't need dotenv to install in bun js
const port = Bun.env.PORT || 8081;


app.use(express.json());
app.use(express.urlencoded({extended:false}));
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
  console.log(`Server is up and running on port localhost:${port}`);
});