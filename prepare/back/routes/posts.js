const express = require('express');

const { Post, User, Image,Comment } = require('../models')

const router = express.Router();

router.get('/', async (req, res, next) => {
	try {
		const posts = await Post.findAll({
			limit: 10,
			// offset: 0, // 리미트와 오프셋 방법은 비효율적, 중간에 삭제 추가가 되었을 시 중복 데이터나 사라진 데이터 발생
			order: [
				['createdAt', 'DESC'],
				[Comment, 'createdAt', 'DESC'],
			],
			include: [{
				model: User,
				attributes: ['id', 'nickname'],
			}, {
				model: Image,
			}, {
				model: Comment,
				include: [{
					model:User,
					attributes: ['id', 'nickname'],
				}]
			}, {
				model: User, // 좋아요 누른사람
				as: 'Likers',
				attributes: ['id']
			}]
		});
		res.status(200).json(posts);
		
	} catch (error) {
		console.error(error);
		next(error);
	}
})

module.exports = router;