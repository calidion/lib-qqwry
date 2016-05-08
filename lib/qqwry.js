"use strict";

/* eslint space-before-function-paren: 0 */
/* eslint semi: 0 */
/* eslint camelcase: 0 */
/* eslint-env es6 */

var fs = require('fs');
var path = require('path');
var gbk = require("./gbk.js");

var func = require('./func');

var IP_RECORD_LENGTH = 7;
var REDIRECT_MODE_1 = 1;
var REDIRECT_MODE_2 = 2;

var gBuffer = null;
var gFd = null;
var gPath = null;

// IP库默认路径
var pathDefined = path.join(__dirname, "./data/qqwry.dat");

function Qqwry(speed, _path) {
  gPath = _path || pathDefined;
  gFd = fs.openSync(gPath, 'r');
  var buf = new Buffer(8);
  fs.readSync(gFd, buf, 0, 8)
  this.ipBegin = buf.readUInt32LE(0);
  this.ipEnd = buf.readUInt32LE(4);
  if (speed) {
    this.speed();
  }
}

// 极速模式
Qqwry.prototype.speed = function() {
  if (gBuffer) {
    return this;
  }
  var fs = require('fs');
  var filepath = typeof gPath === "string" ? gPath : pathDefined;
  gBuffer = fs.readFileSync(filepath);
  // 缓存IP库文件;
  return this;
}

// 关闭极速模式
Qqwry.prototype.unSpeed = function() {
  gBuffer = null;
}

Qqwry.prototype.searchIP = function(IP) {
  var ip = func.ipToInt(IP);
  var g = LocateIP.call(this, ip);
  var loc = {};
  if (g === -1) {
    return false;
  }
  var add = setIPLocation.call(this, g);
  loc.int = ip;
  loc.ip = func.intToIP(ip);
  loc.Country = add.Country;
  loc.Area = add.Area;
  return loc;
}

Qqwry.prototype.searchIPScope = function(bginIP, endIP, callback) {
  if (typeof callback === "function") {
    var o = this;
    process.nextTick(function() {
      try {
        callback(null, o.searchIPScope(bginIP, endIP));
      } catch (e) {
        callback(e);
      }
    })
    return;
  }
  var _ip1;
  var _ip2;
  var b_g;
  var e_g;
  var ips = [];
  try {
    _ip1 = func.ipToInt(bginIP);
  } catch (e) {
    throw new Error("The bginIP is not normal! >> " + bginIP);
  }
  try {
    _ip2 = func.ipToInt(endIP);
  } catch (e) {
    throw new Error("The endIP is not normal! >> " + endIP);
  }
  b_g = LocateIP.call(this, _ip1);
  e_g = LocateIP.call(this, _ip2);
  for (var i = b_g; i <= e_g; i += IP_RECORD_LENGTH) {
    var loc = {};
    var add = setIPLocation.call(this, i);
    loc.begInt = readUIntLE.call(this, i, 4);
    loc.endInt = readUIntLE.call(this, readUIntLE.call(this, i + 4, 3), 4);
    loc.begIP = func.intToIP(loc.begInt);
    loc.endIP = func.intToIP(loc.endInt);
    loc.Country = add.Country;
    loc.Area = add.Area;
    ips.push(loc);
  }
  return ips;
}

// 从指定位置(g),读取指定(w*8)位数int
function readUIntLE(offset, bytes) {
  offset = offset || 0;
  if (bytes < 1) {
    bytes = 1;
  }
  if (bytes > 6) {
    bytes = 6;
  }
  if (gBuffer) {
    return gBuffer.readUIntLE(offset, bytes);
  }

  var buf = new Buffer(bytes);
  fs.readSync(gFd, buf, 0, bytes, offset);
  return buf.readUIntLE(0, bytes);
}

// 读取字节,直到为0x00结束,返回数组
function setIpFileString(Begin) {
  var B = Begin || 0;
  var toarr = [];
  var M;
  var isSuper = Boolean(gBuffer);
  M = isSuper ? gBuffer.length : fs.fstatSync(gFd).size;
  B = B < 0 ? 0 : B;
  for (var i = B; i < M; i++) {
    var s;
    if (isSuper) {
      s = gBuffer[i];
    } else {
      var buf = new Buffer(1);
      fs.readSync(gFd, buf, 0, 1, i)
      s = buf[0];
    }
    if (s === 0) {
      return toarr;
    }
    toarr.push(s);
  }
  return toarr;
}

// 取得begin和end中间的偏移(用于2分法查询);
function getMiddleOffset(begin, end, recordLength) {
  var records = ((end - begin) / recordLength >> 1) * recordLength + begin;
  return records ^ begin ? records : records + recordLength;
}

// 2分法查找指定的IP偏移
function LocateIP(ip) {
  var g;
  var temp;
  for (var b = this.ipBegin, e = this.ipEnd; b < e;) {
    g = getMiddleOffset(b, e, IP_RECORD_LENGTH); // 获取中间位置
    temp = readUIntLE.call(this, g, 4);
    if (ip > temp) {
      b = g;
    } else if (ip < temp) {
      if (g === e) {
        g -= IP_RECORD_LENGTH;
        break;
      }
      e = g;
    } else {
      break;
    }
  }
  return g;
}

function setIPLocation(g) {
  var ipwz = readUIntLE.call(this, g + 4, 3) + 4;
  var lx = readUIntLE.call(this, ipwz, 1);
  var loc = {};
  var Gjbut;
  if (lx === REDIRECT_MODE_1) { // Country根据标识再判断
    ipwz = readUIntLE.call(this, ipwz + 1, 3); // 读取国家偏移
    lx = readUIntLE.call(this, ipwz, 1); // 再次获取标识字节

    if (lx === REDIRECT_MODE_2) { // 再次检查标识字节
      Gjbut = setIpFileString.call(this, readUIntLE.call(this, ipwz + 1, 3));
      loc.Country = gbk.decodeGBK(Gjbut);
      ipwz += 4;
    } else {
      Gjbut = setIpFileString.call(this, ipwz)
      loc.Country = gbk.decodeGBK(Gjbut);
      ipwz += Gjbut.length + 1;
    }
    loc.Area = ReadArea.call(this, ipwz);
  } else if (lx === REDIRECT_MODE_2) { // Country直接读取偏移处字符串
    Gjbut = setIpFileString.call(this, readUIntLE.call(this, ipwz + 1, 3));
    loc.Country = gbk.decodeGBK(Gjbut);
    loc.Area = ReadArea.call(this, ipwz + 4);
  } else { // Country直接读取 Area根据标志再判断
    Gjbut = setIpFileString.call(this, ipwz);
    ipwz += Gjbut.length + 1;
    loc.Country = gbk.decodeGBK(Gjbut);
    loc.Area = ReadArea.call(this, ipwz);
  }
  return loc;
}

// 读取Area
function ReadArea(offset) {
  var one = readUIntLE.call(this, offset, 1);
  if (one === REDIRECT_MODE_1 || one === REDIRECT_MODE_2) {
    var areaOffset = readUIntLE.call(this, offset + 1, 3);
    if (areaOffset === 0) {
      return "";
    }
    return gbk.decodeGBK(setIpFileString.call(this, areaOffset));
  }
  return gbk.decodeGBK(setIpFileString.call(this, offset));
}

function newQqwry(path) {
  return new Qqwry(path);
}

newQqwry.init = function(path) {
  return newQqwry(path);
}

module.exports = newQqwry;
