import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Tweet } from "./tweet.entitie";
import { User } from "./user.entitie";

@Entity("bookmark")
export class Bookmark extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    bookmark_id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => Tweet, tweet => tweet.bookmarks)
    @JoinColumn({ name: "tweet_id" })
    tweet: Tweet;

    @ManyToOne(() => User, user => user.bookmarks)
    @JoinColumn({ name: "user_id" })
    user: User;
}
