import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Tweet } from "./tweet.entitie";

@Entity("like")
export class Like extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    like_id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
    @ManyToOne(() => Tweet, tweet => tweet.likes)
    @JoinColumn({ name: 'tweet_id' })
    tweet: Tweet;
}
