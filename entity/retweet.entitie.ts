import { Entity, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tweet } from "./tweet.entitie";
import { User } from "./user.entitie";

@Entity('retweet')
export class Retweet extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    retweet_id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.retweets)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => Tweet, tweet => tweet.retweets)
    @JoinColumn({ name: 'tweet_id' })
    tweet: Tweet
}
