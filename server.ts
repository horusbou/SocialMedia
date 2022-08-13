import express, { Request, Response, NextFunction } from 'express';
import log from './logger/log';
import multer from 'multer';
import path from 'path';
import PostRoutes from './routes/post.routes';
import UserRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import bookmarkRouters from './routes/bookmark.routes'
import MessageRoutes from './routes/messages.routes'
import deserializeUser from './middleware/deserializeUser';
import HttpException from './util/HttpException';
import { Tweet, Retweet, Like, User, Session, Comment, Timeline, Bookmark, Message, Room } from './entity'
import { createConnection } from "typeorm"
import { Server } from "socket.io";
import { createServer } from "http";
import chat from './controllers/chat'


//setting up multer
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + file.originalname);
    },
});

const app = express();
const http = createServer(app)

const main = async () => {
    try {
        await createConnection({
            type: "mysql",
            host: 'localhost',
            port: 3306,
            username: "root",
            password: "compaq7550",
            database: "ensaTweet",
            entities: [User, Tweet, Like, Comment, Retweet, Session, Timeline, Bookmark, Room, Message],
            synchronize: true,
        })


        app.use(function (req: Request, res: Response, next: NextFunction) {
            res.header('Access-Control-Allow-Origin', 'http://localhost:3000'); // update to match the domain you will make the request from
            res.header('Access-Control-Allow-Credentials', 'true');

            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept'
            );
            next();
        });
        log.info('connected to mysql')
        app.use(express.json());
        app.use(deserializeUser);
        app.use(multer({ storage: fileStorage }).array('file'));
        app.use(express.urlencoded({ extended: false }));

        app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
        app.use(PostRoutes);
        app.use(authRoutes);
        app.use(UserRoutes);
        app.use(bookmarkRouters);
        app.use(MessageRoutes);
        app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
            log.error(err.message)
            next(err);
        })
        app.use((err: HttpException, req: Request, res: Response, next: NextFunction) => {
            const status = err.status || 500;
            const message = err.message || 'Something went wrong';
            const options = err.options;
            return res.status(status).send({
                status,
                message,
                options
            })
        })
        const io = new Server(http, {
            cors: {
                origin: 'http://localhost:3000'
            }
        });
        chat(io)

        // io.use((socket, next) => {
        //     const user = socket.handshake.auth.user;
        //     if (!Object.keys(user).length) {
        //         return next(new Error("invalid username"));
        //     }
        //     //@ts-ignore
        //     socket.user = user;
        //     next();
        // })

        // io.on('connection', function (socket) {
        //     console.log("a user connected");
        //     socket.on('disconnect', function () {
        //         console.log('A user disconnected');
        //     });
        //     console.log(io.of("/").sockets.get('id'), io.of("/").sockets.get('socket'))
        // })
        http.listen(3001, () => {
            log.info('this is up runnning');
        });

    } catch (error) {
        log.error(error)
        throw new Error('unable to connect to mysql')
    }
}
main();
