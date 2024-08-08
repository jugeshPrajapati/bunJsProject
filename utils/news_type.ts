export type NewsPayload = {
    title: string;
    content: string;
    image?: string; // Marked as optional
    user_id?:number;
};

export type  NewsType={
    id : number;
    user_id : number;
    title : string ;
    content: string;
    image: string;
    created_at : Date;
    updated_at: Date ;
   
};