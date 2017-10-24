var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function (req, res, next) {
	return res.send('respond with a resource');
});

// 登录接口
router.post('/login', (req, res, next) => {
	let param = {
		userName: req.body.userName,
		userPwd: req.body.userPwd
	}

	User.findOne(param, (err, doc) => {
		if (doc) {
			res.cookie('userId', doc.userId, {
				path: '/',
				maxAge: 1000 * 60 * 60
			});
			res.cookie('userName', doc.userName, {
				path: '/',
				maxAge: 1000 * 60 * 60
			});
			// req.session.user = doc;
			res.json({
				status: '0',
				msg: '登录成功',
				result: {
					userName: doc.userName
				}
			});
		} else {
			res.json({
				status: '1',
				msg: '怕是用户名和密码不正确吧'
			});
		}
	})
});

// 登出接口
router.post('/logout', (req, res, next)=>{
	res.cookie('userId', '', {
		path: '/',
		maxAge: -1
	});
	res.json({
		status: '0',
		msg: '登出成功',
		result: ''
	});
});

// 登录校验
router.get('/checkLogin', (req, res, next)=>{
	if (req.cookies.userId) {
		res.json({
			status: '0',
			msg: '',
			result: {
				userName: req.cookies.userName
			}
		});
	} else {
		res.json({
			status: '1',
			msg: '未登录',
			result: ''
		});
	}
});

// 购物车列表展示
router.get('/cartList', (req, res, next)=>{
	let userId = req.cookies.userId;
	User.findOne({userId: userId}, (err, doc)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			if (doc) {
				res.json({
					status: '0',
					msg: '',
					result: doc.cartList
				});
			}
		}
	});
});

module.exports = router;
