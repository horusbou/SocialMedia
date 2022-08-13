import { Router } from 'express'
import { getMessages, sendMessage, getParticepent } from '../controllers/messages.controller';
import requiresUser from '../middleware/requiresUser';
const router = Router();
router.get('/messages', requiresUser, getParticepent)
router.get('/messages/:reciever_id', requiresUser, getMessages)
router.post('/messages/:reciever_id', requiresUser, sendMessage)
export default router
