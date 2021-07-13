const db = require('./models');
const express = require('express');
const postRouter = require('./routes/post');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const cors = require('cors');
const passport = require('passport');
const dotenv = require('dotenv');
const morgan = require('morgan');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const passportConfig = require('./passport');

dotenv.config();
const app = express();

db.sequelize.sync()
	.then(() => {
		console.log('db 연결 성공');
	})
	.catch(console.log)


passportConfig();

	// 프론트에서 post로 보낸것을 req.body 에 데이터를 넣어줌
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());
app.use(session({
	saveUninitialized: false,
	resave: false,
	secret: process.env.COOKIE_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
	res.send('hello express')
});

app.use(morgan('dev'));
app.use(cors({
	origin: 'http://localhost:3000',
	credentials: true,
}))
app.use('/post',postRouter);
app.use('/posts',postsRouter);
app.use('/user',userRouter);

// 이 사이에 에러처리 미들웨어 내부적으로 존재


app.listen(3065, () => {
	console.log('서버 실행 중!')
});