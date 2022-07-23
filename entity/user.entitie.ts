import { Entity, BaseEntity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { Retweet } from "./retweet.entitie";
import { Comment } from "./comment.entitie";
import { Session } from "./session.entitie";
import { Timeline } from "./timeline.entite";
import { Like } from "./like.entitie"
import { Tweet } from './tweet.entitie'

@Entity('user')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;
    @Column({ unique: true })
    username: string;
    @Column()
    firstname: string;
    @Column()
    lastname: string;
    @Column({
        unique: true
    })
    email: string;
    @Column()
    password: string;
    @Column()
    userAvatar: string;
    @Column({ default: '' })
    bio: string;
    @Column({
        default: false
    })
    isActive: boolean
    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;

    @OneToMany(
        () => Tweet,
        tweet => tweet.user
    )
    tweets: Tweet[];

    @OneToMany(
        () => Comment,
        comment => comment.user
    )
    comments: Comment[];

    @OneToMany(() => Retweet, retweet => retweet.user)
    retweets: Retweet[]

    @OneToOne(() => Session, session => session.user)
    session: Session

    @OneToOne(() => Timeline, timeline => timeline.user)
    timeline: Timeline

    @OneToMany(() => Like, like => like.user)
    likes: Like[]

}
