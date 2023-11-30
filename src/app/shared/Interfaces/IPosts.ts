import { IComment } from "src/app/core/post-details/post-details.component";

export interface IPosts {
    comments: any; 
    datePosted: string;
    likedBy: string[];
    likes: number;
    originalPost: string;
    post: string;
    postImage: string[]; 
    postVideo: string[];
    title: string;
    user: string;
    userImage: string;
    username: string;
    viewedBy: string[];
    docId:string
  }