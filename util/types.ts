import { Comment, Tweet, Retweet, Session, User } from "../entity";
export interface UserInterface {
    user_id: string;
    username: string;
    firstname: string;
    lastname: string;
    userAvatar: string;
    email: string;
    password: string;
    bio: string;
    isActive: boolean;
    session: Session;
    created_at: Date;
    updated_at: Date;
}
export interface SessionInterface {
    session_id: string;
    user: User;
    valid: boolean;
    userAgent: string;
}
