import { Response, Request } from "express"
import HttpException from "../util/HttpException";
import { Message, Room, User } from "../entity";
export const sendMessage = async (req: Request, res: Response) => {
    const { message } = req.body
    const { reciever_id } = req.params
    const user_id = req.user.user_id;
    const sender = await User.findOne({ where: { user_id } })
    const reciever = await User.findOne({ where: { user_id: reciever_id } })
    if (!reciever) {
        return res.send(new HttpException(404, 'user not found'))
    }
    if (!sender) {
        return res.send(new HttpException(404, 'user not found'))
    }
    const room = await Room.findOne({
        where: [
            {
                participant_1: {
                    user_id
                }, participant_2: {
                    user_id: reciever_id
                }
            },
            {
                participant_2: {
                    user_id
                }, participant_1: {
                    user_id: reciever_id
                }
            }]
    })
    if (!room) {
        //never been connected with each others
        const createdRoom = Room.create({ participant_1: sender, participant_2: reciever })
        await createdRoom.save();
        const messageRow = Message.create({ message, room: createdRoom, user: sender })
        await messageRow.save()
        return res.json([])
    } else {
        const messageRow = Message.create({ message, room, user: sender })
        await messageRow.save();
        return res.json([])
    }
}
export const getMessages = async (req: Request, res: Response) => {
    const { reciever_id } = req.params
    const user_id = req.user.user_id;

    const room = await Room.findOne({
        where: [
            {
                participant_1: {
                    user_id
                }, participant_2: {
                    user_id: reciever_id
                }
            },
            {
                participant_2: {
                    user_id
                }, participant_1: {
                    user_id: reciever_id
                }
            }]
        ,
        order: { messages: { created_at: 'ASC' } }
        , relations: ['messages', 'messages.user']
    })
    if (!room)
        return res.json([])
    return res.json(room.messages)
}
export const getParticepent = async (req: Request, res: Response) => {
    const user_id = req.user.user_id;
    const room = await Room.find({
        where: [{ participant_1: { user_id } }, { participant_2: { user_id } }],
        relations: ['participant_1', 'participant_2']
    })
    const participants = room.filter((el) => el.participant_1.user_id !== user_id || el.participant_2.user_id !== user_id)
    const participants2 = participants.map(el => Object.entries(el))
    const result = participants2.map(el => Object.fromEntries(el.filter(item => item[0] !== 'room_id' && item[1].user_id !== user_id).map((el, i) => {
        el[0] = 'user'
        return el;
    }))).map(el => el.user)
    return res.json(result)
}
