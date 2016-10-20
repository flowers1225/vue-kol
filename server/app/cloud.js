 /**
 * Created by Administrator on 2016/7/25.
 */
"use strict";

var AV = require('leancloud-storage');

//添加数据
var Classify = AV.Object.extend('Classify');
var ListContent = AV.Object.extend('ListContent');


/**
 * 获取分类列表
 *
 *  @param {function}  callback
 *
 *  @return {array} data  分类列表
 *
 */
module.exports.getClassifyData = function (callback) {

    var ClassifyQuery = new AV.Query('Classify');

    ClassifyQuery.ascending('index'); //按index进行升序排列

    ClassifyQuery.find().then(function (results) {

        if(!results.length) {

            callback && callback(null, []);

        };

        var count = 0;

        var data = [];

        for (var i = 0; i < results.length; i++) {
            var list = results[i];
            var cName = list.get('cName');
            var name = list.get('name');
            var id = list.get('objectId');
            var userList = list.get('userList');
            data.push({ 
                cName: cName,
                name: name
            });

            count += 1;

            if(count == results.length) {
                count = 0;
                callback && callback(null, data);
            };
        }

    },function (error) {
        callback && callback(error, null);
    });
}

/**
 * 获取list内容
 *
 * @param {string} classifyId 分类id
 * @param {function} callback
 *
 * @return {object}  ListContentQuery 内容列表的查询对象
 *
 */
module.exports.getListDate = function (classifyId, callback){

    var ClassifyQuery = new AV.Query('Classify');

    var ListContentQuery = new AV.Query('ListContent');

    ClassifyQuery.get(classifyId).then(function (classifyObj) {

        var userList = classifyObj.get('userList');

        //userList.reverse(); //数组翻转

        //console.log(userList)

        ListContentQuery.containedIn('objectId', userList);  //查询包含userList中包含该id的
        
        ListContentQuery.descending('createdAt');            //对查询结果进行降序排列

        ListContentQuery.equalTo('status', 1);

        callback && callback (null, ListContentQuery);


    }, function (error) {
        // 失败了
        callback && callback(error, null);
    });
}

/**
 * 添加社交链接
 *
 * @param {string}  kolId 内容id
 * @param {string}  websiteURL 社交链接
 * @param {function}  callback
 *
 * @return {object} data 最新社交链接
 *
 */
module.exports.addWebsitesURL = function (kolId, websiteURL, callback) {

    var ListContentQuery = new AV.Query('ListContent');

    // var kolId = kolObj.kolId;
    // var websiteURL = kolObj.websiteURL;

    var data = {};

    ListContentQuery.get(kolId).then(function (list) {

        list.add('websites',websiteURL);  //数组方法 添加

        list.save().then(function () {

            data.websites = list.get('websites');

            console.log(data);

            callback && callback (null, data)

        }, function (error) {

            callback && callback (error, null)
        });

    }, function (error) {
      
        callback && callback(error, null);
        
    });
}

/**
 * 添加新达人
 *
 * @param {string}  classifyId 分类id
 * @param {object}  kolContentObj 添加的内容
 * @param {function}  callback
 *
 * @return {object} {}
 *
 */
module.exports.addKOL = function (classifyId, kolContentObj, callback) {

    var ClassifyQuery = new AV.Query('Classify');

    var listContent = new ListContent();

    console.log(typeof kolContentObj.websiteURL);

    listContent.set('avatar', kolContentObj.avatar);
    listContent.set('title', kolContentObj.title);
    listContent.set('content', kolContentObj.content);
    listContent.set('websites', kolContentObj.websiteURL);
    listContent.set('status', 0);
    listContent.set('ups', 0);
    listContent.set('tags', []);

    listContent.save().then(function (list) {

        console.log('save list success');

        console.log(list.id);

        var listId= list.id;

        var websiteURL = list.get('websiteURL');

        ClassifyQuery.get(classifyId).then(function (results) {

            results.add('userList',listId);

            results.save().then(function () {

                console.log('add classify userList');

                callback && callback(null, {});

            }, function (error) {

                callback && callback(error, null);

            });

        }, function (error) {

            callback && callback(error, null);

        });

    }, function (error) {

        callback && callback(error, null);

    });
};

/**
 * 点赞
 *
 * @param {string}  kolId 内容id
 * @param {function}  callback
 *
 * @return {object} {}
 *
 */
module.exports.addUps = function (kolId, callback) {

    var ListContentQuery = new AV.Query('ListContent');

    ListContentQuery.get(kolId).then(function (results) {


        results.increment("ups");  //用于自增

        results.save().then(function () {

            console.log('save ups success!');

            callback && callback(null, {});

        }, function (error) {

            callback && callback(error, null)

        });

    }, function (error) {

        callback && callback (error, null);

    });
}

/**
 * 获取status为0的内容
 *
 * @param {string} classifyId 分类id
 * @param {function} callback
 *
 * return {object} {}
 *
 */
module.exports.getStatusList = function (classifyId, callback) {

    var ClassifyQuery = new AV.Query('Classify');

    var ListContentQuery = new AV.Query('ListContent');

    ClassifyQuery.get(classifyId).then(function (classifyObj) {

        var userList = classifyObj.get('userList');

        ListContentQuery.containedIn('objectId', userList);

        ListContentQuery.descending('createdAt');            //对查询结果进行降序排列

        ListContentQuery.equalTo('status', 0);

        ListContentQuery.find().then(function (results) {

                console.log(results);

        }, function (error) {

            callback && callback (error, null);

        });

    }, function (error) {

        callback && callback(error, null);

    });

}

