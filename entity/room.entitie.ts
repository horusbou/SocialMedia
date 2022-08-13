import { BaseEntity, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm'
import { Message } from './message.entitie';
import { User } from "./user.entitie";
@Entity('room')
export class Room extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    room_id: string;
    @ManyToOne(() => User, user => user.rooms)
    @JoinColumn({ name: "participant_1" })
    participant_1: User
    @ManyToOne(() => User, user => user.rooms)
    @JoinColumn({ name: "participant_2" })
    participant_2: User
    @OneToMany(() => Message, message => message.room)
    messages: Message[];
}
