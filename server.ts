import express, { Request, Response, NextFunction } from 'express';
import log from './logger/log';
import db from './util/database';
import multer from 'multer';
import path from 'path';
import PostRoutes from './routes/post.routes';
import UserRoutes from './routes/user.routes';
import authRoutes from './routes/auth.routes';
import { Post as PostModel } from './models/PostModel';
import { User as UserModel } from './models/UserModel';
import { Retweet as RetweetModel } from './models/RetweetModel';
import { Timeline as TimelineModel } from './models/TimelineModel';
import { Like as LikeModel } from './models/LikesModel';
import deserializeUser from './middleware/deserializeUser';

//associations
UserModel.hasOne(TimelineModel, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
    foreignKey: 'userId',
});
TimelineModel.hasMany(PostModel, {
    foreignKey: 'timelineId',
});
PostModel.belongsTo(TimelineModel, {
    foreignKey: 'timelineId',
});

//
TimelineModel.hasMany(RetweetModel, {
    foreignKey: 'timelineId',
});
RetweetModel.belongsTo(TimelineModel, {
    foreignKey: 'timelineId',
});

PostModel.hasMany(LikeModel, {
    foreignKey: 'postId',
});
LikeModel.belongsTo(PostModel, {
    foreignKey: 'postId',
});

PostModel.hasMany(RetweetModel, {
    foreignKey: 'postId',
});
RetweetModel.belongsTo(PostModel, {
    foreignKey: 'postId',
});

PostModel.belongsTo(UserModel, {
    foreignKey: 'userId',
});
UserModel.hasMany(PostModel, {
    foreignKey: 'userId',
});

// UserModel.hasMany(RetweetModel, {
// 	foreignKey: 'userId',
// });
// RetweetModel.belongsTo(UserModel, {
// 	foreignKey: 'userId',
// });

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

app.use(function (req: Request, res: Response, next: NextFunction) {
    res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});
app.use(deserializeUser);
app.use(multer({ storage: fileStorage }).array('file'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(PostRoutes);
app.use(authRoutes);
app.use(UserRoutes);

// db.sync({ force: true })
db.sync()
    // db.sync({ alter: true })
    .then(() => {
        app.listen(3001, () => {
            log.info('this is up runnning');
        });
    });
