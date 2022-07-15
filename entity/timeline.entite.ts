import { BaseEntity, PrimaryGeneratedColumn, Entity, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Tweet, Retweet, User } from ".";

@Entity("timeline")
export class Timeline extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    timeline_id: string;

    @OneToOne(() => User, user => user.timeline, {
        eager: true
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(
        () => Tweet,
        tweet => tweet.timeline
    )
    tweets: Tweet[];

    @OneToMany(() => Retweet, retweet => retweet.user)
    retweets: Retweet[]
}
