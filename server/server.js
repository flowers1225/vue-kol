/**
 * Created by Administrator on 2016/7/22.
 */
'use strict';
var AV = require('leancloud-storage');
var leancloud = require('./config/config').leancloud;

AV.init({
    appId: leancloud.appId,
    appKey: leancloud.appKey,
    masterKey: leancloud.masterKey
});

// 如果不希望使用 masterKey 权限，可以将下面一行删除
AV.Cloud.useMasterKey();

var app = require('./index');

// 端口一定要从环境变量 `process.env.POR` 中获取。
// 运行时会分配端口并赋值到该变量。

var PORT = parseInt(process.env.PORT || 3030);

app.listen(PORT, function () {
    console.log('Node app is running, port:', PORT);

    // 注册全局未捕获异常处理器
    process.on('uncaughtException', function(err) {
        console.error("Caught exception:", err.stack);
    });
    process.on('unhandledRejection', function(reason, p) {
        console.error("Unhandled Rejection at: Promise ", p, " reason: ", reason.stack);
    });
});