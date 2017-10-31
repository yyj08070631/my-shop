var express = require('express');
var router = express.Router();
require('../util/util');
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

// 获取购物车数量
router.get('/getCartCount', (req, res, next)=>{
	let userId = req.cookies.userId;
	User.findOne({ userId: userId }, (err, doc)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			let cartList = doc.cartList,
				cartCount = 0;
			cartList.map((item)=>{
				cartCount += parseInt(item.productNum);
			});
			
			res.json({
				status: '0',
				msg: '',
				result: cartCount
			});
		}
	});
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

// 删除购物车商品
router.post('/delCart', (req, res, next)=>{
	let productId = req.body.productId,
		userId = req.cookies.userId;
	
	User.update({ 
		userId: userId 
	},
	{
		$pull: {
			cartList: {
				productId: productId
			}
		}
	},
	(err, doc)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'succ'
			});
		}
	});
});

// 编辑购物车商品数量
router.post('/editCart', (req, res, next)=>{
	let userId = req.cookies.userId,
		productId = req.body.productId,
		productNum = req.body.productNum,
		checked = req.body.checked;
	User.update({ 
		'userId': userId, 'cartList.productId': productId
	},{
		'cartList.$.productNum': productNum,
		'cartList.$.checked': checked
	},(err, doc)=>{
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
					result: 'succ'
				});
			}
		}
	});
});

// 全选
router.post('/editCheckAll', (req, res, next)=>{
	let userId = req.cookies.userId,
		checkAll = req.body.checkAll ? '1' : '0';
	User.findOne({ userId: userId }, (err, user)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			if (user) {
				user.cartList.forEach((item)=>{
					item.checked = checkAll;
				});
				user.save((err1, doc)=>{
					if (err1) {
						res.json({
							status: '1',
							msg: err1.message,
							result: ''
						});
					} else {
						res.json({
							status: '0',
							msg: '',
							result: 'succ'
						});
					}
				});
			} else {
				res.json({
					status: '1',
					msg: 'unknown err',
					result: ''
				});
			}
		}
	});
});

// 查询用户地址接口
router.get('/addressList', (req, res, next)=>{
	let userId = req.cookies.userId;
	User.findOne({ userId: userId }, (err, doc)=>{
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
					result: doc.addressList
				});
			}
		}
	});
});

// 设置默认地址
router.post('/setDefault', (req, res, next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addressId;
	if (!addressId) {
		res.json({
			status: '1003',
			msg: 'addressId is null',
			result: ''
		});
	} else {
		User.find({ userId: userId }, (err, doc)=>{
			if (err) {
				res.json({
					status: '1',
					msg: err.message,
					result: ''
				});
			} else {
				let addressList = doc[0].addressList;
				addressList.forEach((item)=>{
					if (item.addressId == addressId) {
						item.isDefault = true;
					} else {
						item.isDefault = false;
					}
				});

				doc[0].save((err1, doc1)=>{
					if (err1) {
						res.json({
							status: '1',
							msg: err1.message,
							result: ''
						});
					} else {
						res.json({
							status: '0',
							msg: '',
							result: 'succ'
						});
					}
				});
			}
		});
	}
});

// 删除地址
router.post('/delAddress', (req, res, next)=>{
	let userId = req.cookies.userId,
		addressId = req.body.addressId;
	User.update({ 
		userId: userId,
	},
	{
		$pull: {
			addressList: {
				addressId: addressId
			}
		}
	},
	(err, doc)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'succ'
			});
		}
	});
});

// 生成订单
router.post('/payment', (req, res, next)=>{
	let userId = req.cookies.userId,
		orderTotal = req.body.orderTotal,
		addressId = req.body.addressId;
	User.findOne({ userId: userId }, (err, doc)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			if (doc) {
				let address = '',
					goodsList = [];
				// 获取当前用户的地址信息
				doc.addressList.forEach((item)=>{
					if (addressId == item.addressId) {
						address = item;
					}
				});
				// 获取用户购物车的购买商品
				doc.cartList.filter((item)=>{
					if (item.isChecked == '1') {
						goodsList.push(item);
					}
				});

				let platform = '622';
				let r1 = Math.floor(Math.random() * 10);
				let r2 = Math.floor(Math.random() * 10);

				let sysDate = new Date().Format('yyyyMMddhhmmss');
				let createDate = new Date().Format('yyyy-MM-dd hh:mm:ss');
				let orderId = platform + r1 + sysDate + r2;
				let order = {
					orderId: orderId,
					orderTotal: orderTotal,
					addressInfo: address,
					goodsList: goodsList,
					orderStatus: '1',
					createDate: createDate
				}
				doc.orderList.push(order);
				doc.save((err1, doc1)=>{
					if (err1) {
						res.json({
							status: '1',
							msg: err.message,
							result: ''
						});
					} else {
						// 订单创建成功
						res.json({
							status: '0',
							msg: '',
							result: {
								orderId: order.orderId,
								orderTotal: order.orderTotal
							}
						});
					}
				});
			}
		}
	});
});

// 获取订单信息
router.get('/orderList', (req, res, next)=>{
	let userId = req.cookies.userId,
		orderId = req.param('orderId');
	User.findOne({ userId: userId }, (err, userInfo)=>{
		if (err) {
			res.json({
				status: '1',
				msg: err.message,
				result: ''
			});
		} else {
			let orderList = userInfo.orderList;
			if (orderList.length > 0) {
				let orderTotal = 0;
				orderList.forEach((item)=>{
					if (item.orderId == orderId) {
						orderTotal = item.orderTotal;
					}
				});
				if (orderTotal > 0) {
					res.json({
						status: '0',
						msg: '',
						result: {
							orderId: orderId,
							orderTotal: orderTotal
						}
					});
				} else {
					res.json({
						status: '120002',
						msg: '无此订单',
						result: ''
					});
				}
			} else {
				res.json({
					status: '120001',
					msg: '当前用户未创建订单',
					result: ''
				});
			}
		}
	});
});

module.exports = router;
