module.exports = {
  intToIP: function _intToIP(value) {
    if (value < 0 || value > 0xFFFFFFFF) {
      throw new Error("The number is not normal! >> " + value);
    }
    return (value >>> 24) + "." + (value >>> 16 & 0xFF) + "." + (value >>> 8 & 0xFF) + "." + (value >>> 0 & 0xFF);
  },
  ipToInt: function _ipToInt(ipv4) {
    var IP_REGEXP = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var result = IP_REGEXP.exec(ipv4);
    var ip;
    if (result) {
      var ipArr = result.slice(1);
      ip = (parseInt(ipArr[0], 10) << 24 |
        parseInt(ipArr[1], 10) << 16 |
        parseInt(ipArr[2], 10) << 8 |
        parseInt(ipArr[3], 10)) >>> 0;
    } else if (/^\d+$/.test(ipv4) && (ip = parseInt(ipv4, 10)) >= 0 && ip <= 0xFFFFFFFF) {
      ip = Number(ipv4);
    } else {
      throw new Error("The IP address is not normal! >> " + ipv4);
    }
    return ip;
  }
};
