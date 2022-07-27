import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, BaseEntity, ManyToOne, JoinColumn, OneToMany } from 'typeorm'
import { Like } from './like.entitie';
import { Comment } from './comment.entitie';
import { Retweet } from './retweet.entitie';
import { Timeline } from './timeline.entite';
import { User } from './user.entitie'
import { Bookmark } from './bookMark.entitie';

@Entity("tweet")
export class Tweet extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    tweet_id: string;
    @Column({ type: 'simple-json' })
    tweet_body: {
        tweet: string,
        gifSrc: string,
        filesSrc: string | string[],
    };
    @Column({ default: 0 })
    like_count: number;
    @Column({ default: 0 })
    retweet_count: number;
    @Column({ default: 0 })
    comment_count: number;

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    // @ManyToOne(
    //     () => User,
    //     user => user.tweets
    // )
    // @JoinColumn({
    //     name: 'user_id'
    // })
    // user: User;
    @ManyToOne(
        () => Timeline,
        timeline => timeline.tweets
    )
    @JoinColumn({
        name: 'timeline_id'
    })
    timeline: Timeline;

    @Column({ nullable: true })
    source_id: string;

    @ManyToOne(() => User, user => user.tweets)
    @JoinColumn({ name: "user_id" })
    public user: User;

    @ManyToOne(() => Tweet, tweet => tweet.tweet_id)
    @JoinColumn({ name: "source_id" })
    public source?: Tweet;

    @OneToMany(() => Like, like => like.tweet)
    likes: Like[];

    @OneToMany(() => Comment, comment => comment.tweet)
    comments: Comment[];

    @OneToMany(() => Retweet, retweet => retweet.tweet)
    retweets: Retweet[];

    @OneToMany(() => Bookmark, bookmark => bookmark.tweet)
    bookmarks: Bookmark[];
}
