/**
 * Created by Administrator on 2016/7/21.
 */
"use strict";

var express = require('express');
var AV = require('leancloud-storage');
var bodyParser  = require('body-parser');

var app = express();

var cloud = require('./app/cloud.js');

var queryObj = {}; //保存分类查询的list

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json());

//require('./app/createTable.js');

/* status code
 * 0    成功
 * 1000 鉴权错误
 * 1001 网络错误
 * 1002 参错错误
 * 1003 服务超时错误
 * 1111 未知错误
 *
 */

var classifyObj = {
    'shoot': {
        id: '5795e1d65bbb500063e5bec2'
    },
    'home':{
        id: '5795e1d6128fe10056c3d1f8'
    },
    'car': {
        id: '5795e1d6a633bd006a53c6b7'
    },
    'eat': {
        id: '5795e1d679bc440066400afc'
    },
    'digital': {
        id: '5795e1d67db2a20054f8de5d'
    },
    'clothing': {
        id: '5795e1d61532bc0060d5b507'
    }

}
//查询获取对应list内容
var getListContent = function (classifyId, limit, page, res, callback) {

    var count = 0;
    var contentData = [];

    queryObj[classifyId].query.limit(limit);
    queryObj[classifyId].query.skip(page * limit);

    queryObj[classifyId].query.find().then(function (results) {

        //查询无结果返回空
        if(!results.length) {

            callback && callback(contentData);

        }

        for (var i = 0; i < results.length; i++) {

            contentData.push({
                id: results[i].get('objectId'),
                avatar: results[i].get('avatar'),
                title: results[i].get('title'),
                content: results[i].get('content'),
                websites: results[i].get('websites'),
                status: results[i].get('status'),
                ups: results[i].get('ups'),
                timestamp: results[i].get('createdAt')
            });

            count += 1;

            if(count == results.length) {

                count = 0;

                callback && callback(contentData);

            }

        }

    }, function (error){

        return res.json(error);

    });
}

//list
app.get('/ajax/list/:classifyName/:limit/:page', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');

    res.contentType('application/json');

    console.log(req.params);

    var classifyId = classifyObj[req.params.classifyName].id;
    var limit = req.params.limit || 10;
    var page = req.params.page || 0;

    if(!classifyId) {

        return res.json({
            code: 1002,
            data: {},
            msg: '参错错误！'
        });

    }

    if(!queryObj[classifyId]) {

        queryObj[classifyId] = {};

        cloud.getListDate(classifyId, function (err, data) {

            if(err){

                res.json(err);

            }else {

                //此处data是根据classifyId中的userList查询出的list查询对象
                queryObj[classifyId].query = data;
                queryObj[classifyId].timestamp = Date.parse(new Date()) / 1000;

                getListContent(classifyId, limit, page, res, function (results){
                    res.json({
                        code: 0,
                        data: results,
                        msg: '请求成功！'
                    });
                });
              }

        });

    }else {
        //24小时更新一次数据
        if(Date.parse(new Date()) / 1000 - queryObj[classifyId].timestamp > 86400) {

            cloud.getListDate(classifyId, function (err, data) {

                if(err){

                    res.json(err);

                }else {

                    //此处data是根据classifyId中的userList查询出的list查询对象
                    queryObj[classifyId].query = data;
                    queryObj[classifyId].timestamp = Date.parse(new Date()) / 1000;

                    getListContent(classifyId, limit, page, res, function (results){
                        res.json({
                            code: 0,
                            data: results,
                            msg: '请求成功！'
                        });
                    });
                }

            });

        }else {
            getListContent(classifyId, limit, page, res, function (results){
                res.json({
                    code: 0,
                    data: results,
                    msg: '请求成功！'
                });
            });

        };

    }

});

//classify
app.get('/ajax/classify', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');

    res.contentType('application/json');

    cloud.getClassifyData(function (err, data) {

        if(err){

            res.json(err);

        }else {

            res.json({
                code: 0,
                data: data,
                msg: '请求成功！'
            });

        }
    });

});

//addWebsitesURL
app.post('/ajax/addWebsitesURL', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');

    res.contentType('application/json');

    if (!req.body) return res.sendStatus(400);

    var kolId = req.body.kolId;
    var websiteURL = req.body.websiteURL;

    cloud.addWebsitesURL(kolId, websiteURL, function (err, data) {

        if(err){

            res.json(err);

        }else {

            res.json({
                code: 0,
                data: data,
                msg: '添加成功！'
            });

        }

    });
});

//addKOL
app.post('/ajax/addKOL', function (req, res) {

    res.header('Access-Control-Allow-Origin', '*');

    res.contentType('application/json');

    if (!req.body) return res.sendStatus(400);

    console.log(req.body);

    var classifyId = classifyObj[req.body.classifyName].id;
    var avatar = req.body.avatar || '';
    var title = req.body.title;
    var content = req.body.content;
    var websiteURL = req.body.websiteURL || [];

    console.log(websiteURL);

    if(!classifyId || !title || !content) {

        return res.json({
            code: 1002,
            data: {},
            msg: '参错错误！'
        });

    }

    return res.json({
        msg: '请求成功！'
    });
    // cloud.addKOL(classifyId, {
    //     avatar: avatar,
    //     title: title,
    //     content: content,
    //     websiteURL: websiteURL
    // },function (err, data){
    //
    //     if(err){
    //
    //         res.json(err);
    //
    //     }else {
    //
    //         res.json({
    //             code: 0,
    //             data: data,
    //             msg: '添加成功！'
    //         });
    //
    //     }
    //
    // });

});

//ups
app.post('/ajax/ups', function (req, res){

    res.header('Access-Control-Allow-Origin', '*');

    res.contentType('application/json');

    if (!req.body) return res.sendStatus(400);

    var kolId = req.body.kolId;

    if(!kolId) {

        return req.json({
            code : 1002,
            data: {},
            msg: '参错错误！'
        });
    }
    cloud.addUps(kolId, function (err, data) {

        if(err){

            res.json(err);

        }else {

            res.json({
                code: 0,
                data: data,
                msg: '点赞成功！'
            });

        }
    });

});

module.exports = app;