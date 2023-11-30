export interface IUsersInterface {
    InterestedIn: string;
    availability: string;
    bio: string;
    blocked: string[];
    created: string;
    dob: string;
    friends: string[];
    image: string;
    language: string;
    location: Record<string, any>; // You can define a more specific type for location if needed.
    name: string;
    notificationToken: string;
    password: Record<string, any>; // You can define a more specific type for password if needed.
    phone: string;
    requests: string[];
    suspended: boolean;
    username: string;
    docId:string;
    unread:string,
    melachatFor:string,
  }