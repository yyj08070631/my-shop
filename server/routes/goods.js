var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Goods = require('../models/goods');

mongoose.connect('mongodb://127.0.0.1:27017/dumall');

mongoose.connection.on('connected', function () {
    console.log('mongodb connected success');
});

mongoose.connection.on('error', function () {
    console.log('mongodb connected fail');
});

mongoose.connection.on('disconnected', function () {
    console.log('mongodb connected disconnected');
});

// 查询商品列表数据
router.get("/list", function (req, res, next) {
    let page = parseInt(req.param('page'));
    let pageSize = parseInt(req.param('pageSize'));
    let sort = req.param('sort');
    let priceLevel = req.param('priceLevel');
    let skip = (page - 1) * pageSize;
    let priceGt = '',
        priceLte = '';
    let params = {};
    if (priceLevel != 'all') {
        switch (priceLevel) {
            case '0': priceGt = 0; priceLte = 100; break;
            case '1': priceGt = 100; priceLte = 500; break;
            case '2': priceGt = 500; priceLte = 1000; break;
            case '3': priceGt = 1000; priceLte = 5000; break;
        };
        params = {
            salePrice: {
                $gt: priceGt,
                $lte: priceLte
            }
        }
    }

    let goodModel = Goods.find(params).skip(skip).limit(pageSize);

    goodModel.sort({ 'salePrice': sort });
    goodModel.exec(function (err, doc) {
        if (err) {
            return res.json({
                status: '1',
                msg: err.message
            });
        } else {
            return res.json({
                status: '0',
                msg: '',
                result: {
                    count: doc.length,
                    list: doc
                }
            });
        }
    });
});

// 加入购物车
router.post('/addCart', (req, res, next) => {
    let userId = '100000077',
        productId = req.body.productId,
        User = require('../models/user');

    User.findOne({ userId: userId }, (err, userDoc) => {
        if (err) {
            return res.json({
                status: '1',
                msg: err.message
            });
        } else {
            console.log(`cartList: ${userDoc.cartList}`);
            if (userDoc) {
                let goodsItem = '';
                userDoc.cartList.forEach((val, key) => {
                    if (val.productId == productId) {
                        goodsItem = val;
                        val.productNum++;
                    }
                });
                if (goodsItem) {
                    userDoc.save((err3, doc3) => {
                        if (err3) {
                            return res.json({
                                status: '1',
                                msg: err3.message
                            });
                        } else {
                            return res.json({
                                status: '0',
                                msg: '',
                                result: 'succ'
                            });
                        }
                    });
                } else {
                    Goods.findOne({ productId: productId }, (err1, doc) => {
                        if (err1) {
                            return res.json({
                                status: '1',
                                msg: err1.message
                            });
                        } else {
                            if (doc) {
                                let docUse = JSON.parse(JSON.stringify(doc));
                                docUse.productNum = 1;
                                docUse.checked = 1;
                                delete docUse._id;

                                userDoc.cartList.push(docUse);
                                // userDoc.cartList = doc;
                                userDoc.save((err2, doc2) => {
                                    if (err2) {
                                        return res.json({
                                            status: '1',
                                            msg: err2.message
                                        });
                                    } else {
                                        return res.json({
                                            status: '0',
                                            msg: '',
                                            result: 'succ'
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            }
        }
    });
});

module.exports = router;