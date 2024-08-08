import { get_image_url } from "../validator/image_validator"
// import { type NewsType } from "./news_type"
export class NewsTransformer{
    static  news_transform(news:any){
        return {
            id: news.id,
            heading:news.title,
            news: news.content,
            image: get_image_url(news.image),
            created_at: news.created_at,
            reporter:{
                id:news?.user.id,
                name:news?.user.name,
                profile : news?.user?.profile != null ? get_image_url(news?.user?.profile) : null,
            }
        }
    }
}