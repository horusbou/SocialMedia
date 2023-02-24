import { Router } from "express"
import { hydrateTimeline } from "../controllers"
const router = Router()

router.get('/:user_id',hydrateTimeline)

export default router
