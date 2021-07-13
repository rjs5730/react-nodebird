const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { User, Post } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const user = require('../models/user');

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		if(req.user) {
			const fullUserWithoutPassword = await User.findOne({
				where: { id: req.user.id },
				attributes: {
					exclude: ['password']
				},
				include: [{
					model: Post,
					attributes: ['id'],
				}, {
					model: User,
					as: 'Followings',
					attributes: ['id'],
				}, {
					model: User,
					as: 'Followers',
					attributes: ['id'],
				}]
			})
			res.status(200).json(fullUserWithoutPassword);
		} else {
			return res.status(200).json(null);
		}
	
	} catch(error) {
		console.error(error);
		next(error);
	}
})

router.post('/login', isNotLoggedIn, (req,res,next) => {
	passport.authenticate('local', (err, user, info) => {
		if(err) {
			console.error('error : '+err);
			return next(error)
		}
		if(info) { // 클라이언트 에러 발생 , 401 허가되지 않는 사용자
			return res.status(401).send(info.reason);
		}
		return req.login(user, async (loginErr) => {
			if (loginErr) {
				console.log(loginErr);
				return next(loginErr);
			}
			const fullUserWithoutPassword = await User.findOne({ 
				where: { id: user.id },
				attributes: {
					exclude: ['password']
				},
				include: [{
					model: Post,
					attributes: ['id'],
				}, {
					model: User,
					as: 'Followings',
					attributes: ['id'],
				}, {
					model: User,
					as: 'Followers',
					attributes: ['id'],
				}]
			})
			return res.json(fullUserWithoutPassword);
		});
	})(req ,res, next);
});

router.post('/', isNotLoggedIn,async (req, res, next) => {
	try {
		const exUser = await User.findOne({
			where: {
				email: req.body.email,
			}
		});
		if (exUser) {
			return res.status(403).send('이미 사용중인 아이디입니다.');
		}
		const hashedPassword = await bcrypt.hash(req.body.password, 12);
		await User.create({
			email: req.body.email,
			nickname: req.body.nickname,
			password: hashedPassword,
		});
		res.send('ok');
	} catch(error) {
		console.error(error);
		next(error);
	}
});


router.post('/logout', isLoggedIn,(req, res, next) => {
	req.logout();
	req.session.destroy();
	res.send('ok');
})

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
	try {
		await User.update({
			nickname: req.body.nickname,
		}, {
			where: { id: req.user.id }
		})
		res.status(200).json({ nickname: req.body.nickname })
	} catch (error) {
		console.error(error);
		next(error);
	}
})

router.get('/followers', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.user.id }
		})
		if(!user) {
			res.status(403).send('없는 사람을 팔로우 하려고 합니다.');
		}
		const followers = await user.getFollowers();
		console.log(followers)
		res.status(200).json(followers)
	} catch (error) {
		console.error(error);
		next(error);
	}
})
router.get('/followings', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.user.id }
		})
		if(!user) {
			res.status(403).send('없는 사람을 팔로우 하려고 합니다.');
		}
		const followings = await user.getFollowings();
		res.status(200).json(followings)
	} catch (error) {
		console.error(error);
		next(error);
	}
})
router.patch('/:userId/follow', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.params.userId }
		})
		if(!user) {
			res.status(403).send('없는 사람을 팔로우 하려고 합니다.');
		}
		await user.addFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId,10) })
	} catch (error) {
		console.error(error);
		next(error);
	}
})

router.delete('/:userId/follow', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.params.userId }
		})
		if(!user) {
			res.status(403).send('없는 사람을 팔로우 하려고 합니다.');
		}
		await user.removeFollowers(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId,10) })
	} catch (error) {
		console.error(error);
		next(error);
	}
})

router.delete('/follower/:userId', isLoggedIn, async (req, res, next) => {
	try {
		const user = await User.findOne({
			where: { id: req.params.userId }
		})
		if(!user) {
			res.status(403).send('없는 사람을 팔로우 하려고 합니다.');
		}
		await user.removeFollowings(req.user.id);
		res.status(200).json({ UserId: parseInt(req.params.userId, 10) })
	} catch (error) {
		console.error(error);
		next(error);
	}
})

module.exports = router;