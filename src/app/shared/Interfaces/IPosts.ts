export interface IPosts {
    comments: { [key: string]: any }; 
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
  }