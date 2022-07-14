import { UserInterface } from '../../util/types'

declare global {
    namespace Express {
        interface Request {
            user: UserInterface
        }
    }
}
