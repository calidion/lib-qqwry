var assert = require('assert')﻿;

var Qqwry = require('../lib/index.js');

qqwry = Qqwry.init();

describe('QQWry', function() {

  it('should throw if ip is negative', function() {
    var func = require('../lib/func');
    var catched = false;
    try {
      func.intToIP(-1);
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });

  it('should throw if ip is negative', function() {
    var func = require('../lib/func');
    var catched = false;
    try {
      func.intToIP(0xFFFFFFFF + 1);
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });

  it('should throw if ip is invalid', function() {
    var func = require('../lib/func');
    var catched = false;
    try {
      func.ipToInt('123.122');
    } catch (e) {
      catched = true;
    }
    assert(catched);
  });

  it('should search single ip', function() {
    var ip = qqwry.searchIP("113.45.183.91");
    assert.deepEqual(ip, {
      int: 1898821467,
      ip: '113.45.183.91',
      Country: '北京市',
      Area: '电信通'
    });
  });

  it('should search single ip again', function() {
    var ip = qqwry.searchIP(0xFFFFFF00);
    assert.deepEqual(ip, {
      int: 4294967040,
      ip: '255.255.255.0',
      Country: '纯真网络',
      Area: '2015年12月20日IP数据'
    });
  });

  it('should search single ip range', function() {
    qqwry.searchIPScope("8.8.8.0", "8.8.8.8", function(err, ipArr) {
      assert(!err);
      assert.deepEqual(ipArr, [{
        begInt: 134744064,
        endInt: 134744071,
        begIP: '8.8.8.0',
        endIP: '8.8.8.7',
        Country: '美国',
        Area: '加利福尼亚州圣克拉拉县山景市谷歌公司'
      }, {
        begInt: 134744072,
        endInt: 134744072,
        begIP: '8.8.8.8',
        endIP: '8.8.8.8',
        Country: '美国',
        Area: '加利福尼亚州圣克拉拉县山景市谷歌公司DNS服务器'
      }]);
      console.log(iparr);
    });
  });

});

//异步初始化调用
// qqwry.infoAsync(function(){
// console.log(qqwry.searchIPLocation("255.255.255.255"));
// console.log(qqwry.searchIPLocation(0xFFFFFF00));
// })
//console.log("-----end-----");
