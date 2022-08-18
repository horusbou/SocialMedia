import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, OneToOne } from "typeorm";
import { Room } from "./room.entitie";
import { User } from "./user.entitie";

@Entity('message')
export class Message extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    message_id: string
    @Column("longtext")
    message: string
    @ManyToOne(() => Room, room => room.messages)
    @JoinColumn({ name: "room_id" })
    room: Room;
    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => User, user => user.messages)
    @JoinColumn({ name: "user_id" })
    user: User;
}
