"use strict";

exports.__esModule = true;
exports.between = between;
exports.effectuate = effectuate;
exports.fixDecimal = fixDecimal;
exports.isBetween = isBetween;
exports.ratioOffset = ratioOffset;
/*
 * @Author: Huangjs
 * @Date: 2023-06-26 09:46:00
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-07-28 15:49:45
 * @Description: ******
 */

// 解决0.1+0.2不等于0.3的问题
function fixDecimal(value, places) {
  if (places === void 0) {
    places = 15;
  }
  var multiple = Math.pow(10, places);
  return Math.round(value * multiple) / multiple;
}
// 算出双击时offset的比例
function ratioOffset(v, k, t) {
  if (v <= (1 - k) / (2 * k)) {
    return -1 / 2;
  } else if (v >= (1 + k - 2 * t) / (2 * k)) {
    return 1 / 2;
  } else {
    return (v - (1 - t) / (2 * k)) / (1 - t / k);
  }
}
// 传入的a是函数，就返回函数执行结果，否则直接返回a
function effectuate(fn) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return typeof fn === 'function' ? fn.apply(void 0, args) : fn;
}
// 判断v是否在min和max之间
function isBetween(v, _ref) {
  var min = _ref[0],
    max = _ref[1];
  return min <= v && v <= max;
}
// 若v在min和max之间，则返回v值，否则，返回边缘值min或max
function between(v, _ref2, _) {
  var min = _ref2[0],
    max = _ref2[1];
  return Math.max(Math.min(v, max), min);
}