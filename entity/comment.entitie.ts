import {
    Entity,
    BaseEntity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    Column
} from "typeorm";
import { Tweet } from "./tweet.entitie";
import { User } from "./user.entitie";

@Entity("comment")
export class Comment extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    comment_id: string;
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @Column({ type: 'simple-json' })
    comment_body: {
        comment: string,
        gifSrc: string,
        filesSrc: string,
    };
    @ManyToOne(() => Tweet, tweet => tweet.comments)
    @JoinColumn({ name: 'tweet_id' })
    tweet: Tweet;

    @ManyToOne(
        () => User,
        user => user.comments
    )
    @JoinColumn({
        name: 'user_id'
    })
    user: User;


    // @Column({ nullable: true })
    // source_id: string;


    // @ManyToOne(() => Comment, comment => comment.comment_id)
    // @JoinColumn({ name: "source_id" })
    // public sub_comment?: Comment;
}
