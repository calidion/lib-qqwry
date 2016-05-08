var ua = require('./data/ua');

exports.decodeGBK = function decodeGBK(arr) {
  var str = '';
  for (var n = 0; n < arr.length; n++) {
    var code = arr[n];
    if (code & 0x80) {
      code = ua[code << 8 | arr[++n]];
    }
    str += String.fromCharCode(code);
  }
  return str;
};
