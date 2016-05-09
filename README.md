# lib-qqwry [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]
> IP to Location for nodejs

## Installation

```sh
$ npm install --save lib-qqwry2
```

## Usage

```js
var Qqwry = require('lib-qqwry2');
qqwry = Qqwry.init();

var ip = qqwry.searchIP("113.45.183.91");

>ip

// 结果
{
  int: 1898821467,
  ip: '113.45.183.91',
  Country: '北京市',
  Area: '电信通'
}

```
## License

Apache-2.0 © [calidion]()


[npm-image]: https://badge.fury.io/js/lib-qqwry2.svg
[npm-url]: https://npmjs.org/package/lib-qqwry2
[travis-image]: https://travis-ci.org/calidion/lib-qqwry.svg?branch=master
[travis-url]: https://travis-ci.org/calidion/lib-qqwry
[daviddm-image]: https://david-dm.org/calidion/lib-qqwry.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/calidion/lib-qqwry
[coveralls-image]: https://coveralls.io/repos/calidion/lib-qqwry/badge.svg
[coveralls-url]: https://coveralls.io/r/calidion/lib-qqwry
