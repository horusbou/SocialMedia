import { Entity, BaseEntity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { Tweet } from "./tweet.entitie";
import { User } from "./user.entitie";

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

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
}
