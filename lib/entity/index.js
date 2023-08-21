"use strict";

var _WeakMap = require("@babel/runtime-corejs3/core-js/weak-map");
var _Object$getOwnPropertyDescriptor = require("@babel/runtime-corejs3/core-js/object/get-own-property-descriptor");
var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");
exports.__esModule = true;
exports.default = void 0;
var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/promise"));
var _map = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/instance/map"));
var _keys = _interopRequireDefault(require("@babel/runtime-corejs3/core-js/object/keys"));
var _extends2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/extends"));
var _inheritsLoose2 = _interopRequireDefault(require("@babel/runtime-corejs3/helpers/inheritsLoose"));
var _transition = _interopRequireWildcard(require("@huangjs888/transition"));
var _transform = _interopRequireDefault(require("@huangjs888/transform"));
var _damping = require("@huangjs888/damping");
var _utils = require("./utils");
function _getRequireWildcardCache(nodeInterop) { if (typeof _WeakMap !== "function") return null; var cacheBabelInterop = new _WeakMap(); var cacheNodeInterop = new _WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && _Object$getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? _Object$getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
/*
 * @Author: Huangjs
 * @Date: 2023-02-13 15:22:58
 * @LastEditors: Huangjs
 * @LastEditTime: 2023-08-18 09:27:38
 * @Description: ******
 */
var Entity = /*#__PURE__*/function () {
  function Entity(_ref) {
    var element = _ref.element,
      sizeInfo = _ref.sizeInfo,
      dblAdjust = _ref.dblAdjust,
      dblScale = _ref.dblScale,
      damping = _ref.damping,
      rotation = _ref.rotation,
      scalation = _ref.scalation,
      translation = _ref.translation;
    // 当前手势操作之后的变换对象
    // 当前渐变对象
    this._dblAdjust = true;
    this._dblScale = 0;
    // 双击放大比例和是否调整放大时的中心点
    this._damping = [];
    // 可以进行阻尼的变换
    this._rotation = [];
    // 旋转范围
    this._scalation = [];
    // 缩放范围
    this._translation = [];
    // 平移范围
    this._sizeInfo = {
      containerCenter: [0, 0],
      containerWidth: 0,
      containerHeight: 0,
      naturalWidth: 0,
      naturalHeight: 0,
      elementWidth: 0,
      elementHeight: 0
    };
    var _element;
    try {
      if (typeof element === 'string') {
        _element = document.querySelector(element);
      } else {
        _element = element;
      }
    } catch (e) {
      _element = null;
    }
    if (!_element || !(_element instanceof HTMLElement)) {
      _element = document.createElement('div');
    }
    _element.style.opacity = '0';
    _element.innerHTML = '';
    this._element = _element;
    this._transform = new _transform.default({
      a: 0,
      k: 1,
      x: 0,
      y: 0
    });
    // 创建过渡
    this._transition = new _transition.default({
      element: this._element,
      propertyName: 'transform',
      propertyValue: new ( /*#__PURE__*/function (_TAProperty) {
        (0, _inheritsLoose2.default)(_class2, _TAProperty);
        function _class2() {
          return _TAProperty.apply(this, arguments) || this;
        }
        var _proto2 = _class2.prototype;
        _proto2.toString = function toString() {
          // 这里注意，在不存在任何过渡动画的时候，这里的this.value应该和上面的this._transform内的每项值应该是相等的
          // 但是由于 0.1+0.2!==0.3 的问题，导致经过各种计算后，其值并不是完全相等，存在极小的精度问题
          return new _transform.default(this.value).toString();
        };
        return _class2;
      }(_transition.TAProperty))(this._transform.toRaw())
    });
    this.setSizeInfo(sizeInfo); // 设置尺寸
    this.setDblAdjust(dblAdjust); // 设置双击是否调整中心点
    this.setDamping(damping); // 设置[]，则全都不阻尼
    this.setDblScale(dblScale); // 设置1，则不进行双击缩放，但可双击归位
    this.setRotation(rotation); // 设置相同数字（比如0），则不允许旋转，该数字为初始旋转
    this.setScalation(scalation); // 设置相同数字（比如1），则不允许缩放，该数为初始缩放
    this.setTranslation(translation); // 设置相同数字（比如0），则不允许平移，该数为初始位置
  }
  var _proto = Entity.prototype;
  _proto.getElement = function getElement() {
    return this._element;
  };
  _proto.getTransform = function getTransform() {
    return this._transform;
  };
  _proto.getSizeInfo = function getSizeInfo() {
    return this._sizeInfo;
  };
  _proto.setSizeInfo = function setSizeInfo(sizeInfo) {
    if (sizeInfo) {
      var containerCenter = sizeInfo.containerCenter,
        containerWidth = sizeInfo.containerWidth,
        containerHeight = sizeInfo.containerHeight,
        naturalWidth = sizeInfo.naturalWidth,
        naturalHeight = sizeInfo.naturalHeight;
      var aspectRatio = naturalWidth / naturalHeight;
      var boxAspectRatio = containerWidth / containerHeight;
      var width = naturalWidth;
      if (aspectRatio >= boxAspectRatio) {
        width = containerWidth;
      } else if (aspectRatio >= 1 / 2.2) {
        // 0.4545454545...
        //微信 iphone 横竖屏和微信 android 竖屏时
        width = containerHeight * aspectRatio;
      } /* else if (aspectRatio >= 0.4) {
        // 微信 android 横屏时
        width = containerHeight * aspectRatio;
        } */else {
        // 微信 iphone 是取 containerWidth 和 naturalWidth 最小值
        width = Math.min(containerWidth, naturalWidth);
        // 微信 android 直接是取 containerWidth;
        // width = containerWidth;
      }

      var height = width / aspectRatio;
      this._element.style.opacity = '1';
      this._element.style.width = width + "px";
      this._element.style.height = height + "px";
      this._sizeInfo = {
        containerCenter: containerCenter,
        containerWidth: containerWidth,
        containerHeight: containerHeight,
        naturalWidth: naturalWidth,
        naturalHeight: naturalHeight,
        elementWidth: width,
        elementHeight: height
      };
      this.reset();
    }
  };
  _proto.setRotation = function setRotation(a) {
    if (a && typeof a[0] === 'number' && typeof a[1] === 'number' && a[1] >= a[0]) {
      // 最大范围 -Infinity 到 + Infinity
      this._rotation = a;
      return;
    }
    // 测微信得到的结论，是不给旋转的
    // 如果设置不合理，则取默认
    this._rotation = function () {
      return [0, 0];
    };
  };
  _proto.getRotation = function getRotation() {
    return (0, _utils.effectuate)(this._rotation);
  };
  _proto.setScalation = function setScalation(k) {
    var _this = this;
    if (k && typeof k[0] === 'number' && typeof k[1] === 'number' && k[1] >= k[0] && k[0] > 0) {
      this._scalation = k; // 最大范围 0 到 +Infinity (不等于0)
      return;
    }
    // 测微信得到的结论，最小值为1，最大值永远是双击值放大值的2倍
    // 如果设置不合理，则取默认
    this._scalation = function () {
      return [1, 2 * _this.getDblScale()];
    };
  };
  _proto.getScalation = function getScalation() {
    return (0, _utils.effectuate)(this._scalation);
  };
  _proto.setTranslation = function setTranslation(xy) {
    this.setXTranslation(xy && xy[0]);
    this.setYTranslation(xy && xy[1]);
  };
  _proto.getTranslation = function getTranslation(k) {
    return [this.getXTranslation(k), this.getYTranslation()];
  };
  _proto.setXTranslation = function setXTranslation(x) {
    var _this2 = this;
    if (x && typeof x[0] === 'number' && typeof x[1] === 'number' && x[1] >= x[0]) {
      this._translation[0] = x; // 最大范围 -Infinity 到 + Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后宽度和容器宽度之差，左右各一半的范围
    this._translation[0] = function (k) {
      var _this2$getSizeInfo = _this2.getSizeInfo(),
        containerWidth = _this2$getSizeInfo.containerWidth,
        elementWidth = _this2$getSizeInfo.elementWidth;
      var bx = Math.max((elementWidth * k - containerWidth) / 2, 0);
      return [-bx, bx];
    };
  };
  _proto.getXTranslation = function getXTranslation(k) {
    return (0, _utils.effectuate)(this._translation[0], k || this._transform.k || 1);
  };
  _proto.setYTranslation = function setYTranslation(y) {
    var _this3 = this;
    if (y && typeof y[0] === 'number' && typeof y[1] === 'number' && y[1] >= y[0]) {
      this._translation[1] = y; // 最大范围 -Infinity 到 +Infinity
      return;
    }
    // 测微信得到的结论，边界范围是元素按照当前比例缩放后高度和容器高度之差，上下各一半的范围
    this._translation[1] = function (k) {
      var _this3$getSizeInfo = _this3.getSizeInfo(),
        containerHeight = _this3$getSizeInfo.containerHeight,
        elementHeight = _this3$getSizeInfo.elementHeight;
      var by = Math.max((elementHeight * k - containerHeight) / 2, 0);
      return [-by, by];
    };
  };
  _proto.getYTranslation = function getYTranslation(k) {
    return (0, _utils.effectuate)(this._translation[1], k || this._transform.k || 1);
  };
  _proto.setDblScale = function setDblScale(k) {
    var _this4 = this;
    if (typeof k === 'number' && k > 0) {
      this._dblScale = k;
      return;
    }
    // 测微信得到的结论，双击放大比例是
    // 1，容器宽/元素宽 和 容器高/元素高 的最大值
    // 2，元素实际宽/容器宽 和 元素实际高/容器高 的最小值
    // 3，在1、2两个值和数值2这三个之中的最大值
    this._dblScale = function () {
      var _this4$getSizeInfo = _this4.getSizeInfo(),
        containerWidth = _this4$getSizeInfo.containerWidth,
        containerHeight = _this4$getSizeInfo.containerHeight,
        naturalWidth = _this4$getSizeInfo.naturalWidth,
        naturalHeight = _this4$getSizeInfo.naturalHeight,
        elementWidth = _this4$getSizeInfo.elementWidth,
        elementHeight = _this4$getSizeInfo.elementHeight;
      return Math.max(2, Math.max(containerWidth / elementWidth, containerHeight / elementHeight), Math.min(naturalWidth / containerWidth, naturalHeight / containerHeight)) || 1;
    };
  };
  _proto.getDblScale = function getDblScale() {
    return (0, _utils.effectuate)(this._dblScale);
  };
  _proto.setDblAdjust = function setDblAdjust(aj) {
    if (aj === void 0) {
      aj = true;
    }
    this._dblAdjust = aj;
  };
  _proto.getDblAdjust = function getDblAdjust() {
    return this._dblAdjust;
  };
  _proto.isDamping = function isDamping(key) {
    return this._damping && this._damping.indexOf(key) !== -1;
  };
  _proto.setDamping = function setDamping(damping) {
    if (damping) {
      this._damping = damping;
      return;
    }
    // 如果不设置，默认只对缩放比例和位移进行阻尼
    this._damping = ['scale', 'translate'];
  };
  _proto.rotate = function rotate(a) {
    // 负数顺时针，正数逆时针
    // 在原来的基础上再旋转 a
    return this.transform({
      a: a
    });
  };
  _proto.rotateTo = function rotateTo(a) {
    // 负数顺时针，正数逆时针
    // 直接旋转到 a
    return this.transformTo({
      a: a
    });
  };
  _proto.scale = function scale(k, point) {
    // 在原来的基础上相对 point 点缩放 k
    return this.transform({
      k: k
    }, point);
  };
  _proto.scaleTo = function scaleTo(k, point) {
    // 直接相对 point 点缩放到 k
    return this.transformTo({
      k: k
    }, point);
  };
  _proto.translate = function translate(x, y) {
    // 在原来的基础上平移 x, y
    return this.transform({
      x: x,
      y: y
    });
  };
  _proto.translateTo = function translateTo(x, y) {
    // 直接平移到 x, y
    return this.transformTo({
      x: x,
      y: y
    });
  };
  _proto.translateX = function translateX(x) {
    // 在原来的基础上横向平移 x
    return this.transform({
      x: x
    });
  };
  _proto.translateXTo = function translateXTo(x) {
    // 直接横向平移到 x
    return this.transformTo({
      x: x
    });
  };
  _proto.translateY = function translateY(y) {
    // 在原来的基础上竖向平移  y
    return this.transform({
      y: y
    });
  };
  _proto.translateYTo = function translateYTo(y) {
    // 直接竖向平移到 y
    return this.transformTo({
      y: y
    });
  };
  _proto.transform = function transform(transformRaw, point, options) {
    var _this$getTransform = this.getTransform(),
      _this$getTransform$a = _this$getTransform.a,
      ta = _this$getTransform$a === void 0 ? 0 : _this$getTransform$a,
      _this$getTransform$k = _this$getTransform.k,
      tk = _this$getTransform$k === void 0 ? 1 : _this$getTransform$k,
      _this$getTransform$x = _this$getTransform.x,
      tx = _this$getTransform$x === void 0 ? 0 : _this$getTransform$x,
      _this$getTransform$y = _this$getTransform.y,
      ty = _this$getTransform$y === void 0 ? 0 : _this$getTransform$y;
    var a = transformRaw.a,
      k = transformRaw.k,
      x = transformRaw.x,
      y = transformRaw.y;
    if (typeof a === 'number') {
      a += ta;
    }
    if (typeof k === 'number') {
      k *= tk;
    }
    if (typeof x === 'number') {
      x += tx;
    }
    if (typeof y === 'number') {
      y += ty;
    }
    return this.transformTo({
      a: a,
      k: k,
      x: x,
      y: y
    }, point, options);
  };
  _proto.transformTo = function transformTo(transformRaw, point, options) {
    var _point = point;
    var _options = options;
    if (!options && !Array.isArray(point)) {
      _options = point;
      _point = undefined;
    }
    var _a = transformRaw.a,
      _k = transformRaw.k,
      _x = transformRaw.x,
      _y = transformRaw.y;
    var _transformRaw = {};
    if (typeof _a === 'number') {
      _transformRaw.a = (0, _utils.between)(_a, this.getRotation());
    }
    if (typeof _k === 'number') {
      var k = _transformRaw.k = (0, _utils.between)(_k, this.getScalation());
      if (Array.isArray(_point)) {
        var _this$computeOffset = this.computeOffset(_point, k),
          ox = _this$computeOffset[0],
          oy = _this$computeOffset[1];
        var _this$_transform = this._transform,
          _this$_transform$x = _this$_transform.x,
          tx = _this$_transform$x === void 0 ? 0 : _this$_transform$x,
          _this$_transform$y = _this$_transform.y,
          ty = _this$_transform$y === void 0 ? 0 : _this$_transform$y;
        _transformRaw.x = (0, _utils.between)((typeof _x === 'number' ? _x : tx) + ox, this.getXTranslation(k));
        _transformRaw.y = (0, _utils.between)((typeof _y === 'number' ? _y : ty) + oy, this.getYTranslation(k));
      } else {
        if (typeof _x === 'number') {
          _transformRaw.x = (0, _utils.between)(_x, this.getXTranslation(k));
        }
        if (typeof _y === 'number') {
          _transformRaw.y = (0, _utils.between)(_y, this.getYTranslation(k));
        }
      }
    } else {
      if (typeof _x === 'number') {
        _transformRaw.x = (0, _utils.between)(_x, this.getXTranslation());
      }
      if (typeof _y === 'number') {
        _transformRaw.y = (0, _utils.between)(_y, this.getYTranslation());
      }
    }
    return this.transitionRun(_transformRaw, _options);
  };
  _proto.transitionRun = function transitionRun(transformRaw, options) {
    var _this5 = this;
    if (options === void 0) {
      options = {};
    }
    if (typeof options.duration === 'number' && options.duration <= 0) {
      // 这里移动时不需要动画，可以直接进行绑定赋值
      this._transform = new _transform.default(transformRaw);
      this._transition.bind(transformRaw);
      return _promise.default.resolve(transformRaw);
    }
    var a = transformRaw.a,
      k = transformRaw.k,
      x = transformRaw.x,
      y = transformRaw.y;
    var _this$getTransform2 = this.getTransform(),
      _this$getTransform2$a = _this$getTransform2.a,
      ta = _this$getTransform2$a === void 0 ? 0 : _this$getTransform2$a,
      _this$getTransform2$k = _this$getTransform2.k,
      tk = _this$getTransform2$k === void 0 ? 1 : _this$getTransform2$k,
      _this$getTransform2$x = _this$getTransform2.x,
      tx = _this$getTransform2$x === void 0 ? 0 : _this$getTransform2$x,
      _this$getTransform2$y = _this$getTransform2.y,
      ty = _this$getTransform2$y === void 0 ? 0 : _this$getTransform2$y;
    var deltaValue = {};
    var precision = {};
    if (typeof a === 'number') {
      deltaValue.a = (this._transform.a = a) - ta;
      // 角度精度按照屏幕尺寸一般暂时设置为0.001
      precision.a = 0.001;
    }
    if (typeof k === 'number') {
      deltaValue.k = (this._transform.k = k) - tk;
      // 缩放精度按照屏幕尺寸一般暂时设置为0.001
      precision.k = 0.001;
    }
    if (typeof x === 'number') {
      deltaValue.x = (this._transform.x = x) - tx;
      // 像素精度都在1px
      precision.x = 1;
    }
    if (typeof y === 'number') {
      deltaValue.y = (this._transform.y = y) - ty;
      // 像素精度都在1px
      precision.y = 1;
    }
    return this._transition.apply(deltaValue, (0, _extends2.default)({
      precision: precision,
      cancel: true,
      duration: 500,
      easing: _transition.easeOutQuart
    }, options)).then(function (value) {
      if (!_this5.isTransitioning()) {
        // 在最后一个动画的最后一帧结束重新绑定一下过渡值，目的是为了让_transition里的value和_transform保持一致
        _this5._transition.bind(_this5._transform.toRaw());
      }
      return value;
    });
  };
  _proto.transitionCancel = function transitionCancel() {
    var _context,
      _this6 = this;
    // cancel返回值是动画未执行的部分
    return (0, _map.default)(_context = this._transition.cancel()).call(_context, function (value) {
      // 取消动画时应该把this._transform内的值减掉还未执行的部分
      var _this6$getTransform = _this6.getTransform(),
        _this6$getTransform$a = _this6$getTransform.a,
        ta = _this6$getTransform$a === void 0 ? 0 : _this6$getTransform$a,
        _this6$getTransform$k = _this6$getTransform.k,
        tk = _this6$getTransform$k === void 0 ? 1 : _this6$getTransform$k,
        _this6$getTransform$x = _this6$getTransform.x,
        tx = _this6$getTransform$x === void 0 ? 0 : _this6$getTransform$x,
        _this6$getTransform$y = _this6$getTransform.y,
        ty = _this6$getTransform$y === void 0 ? 0 : _this6$getTransform$y;
      (0, _keys.default)(value).forEach(function (key) {
        var val = value[key];
        if (key === 'a') {
          _this6._transform.a = ta - val;
        } else if (key === 'k') {
          _this6._transform.k = tk - val;
        } else if (key === 'x') {
          _this6._transform.x = tx - val;
        } else if (key === 'y') {
          _this6._transform.y = ty - val;
        }
      });
    }).length;
  };
  _proto.isTransitioning = function isTransitioning() {
    return this._transition.transitioning();
  };
  _proto.reset = function reset(duration) {
    if (duration === void 0) {
      duration = 0;
    }
    var a = (0, _utils.between)(0, this.getRotation()); // 初始角度a
    var k = (0, _utils.between)(1, this.getScalation()); // 初始比例k
    var x = (0, _utils.between)(0, this.getXTranslation(k)); // 初始位移x
    var y = (0, _utils.between)(0, this.getYTranslation(k)); //初始位移y
    this.transitionRun({
      a: a,
      k: k,
      x: x,
      y: y
    }, {
      duration: duration
    });
  };
  _proto.computeOffset = function computeOffset(point, k, adjust) {
    if (adjust === void 0) {
      adjust = false;
    }
    var _this$getSizeInfo = this.getSizeInfo(),
      containerCenter = _this$getSizeInfo.containerCenter,
      containerWidth = _this$getSizeInfo.containerWidth,
      containerHeight = _this$getSizeInfo.containerHeight,
      elementWidth = _this$getSizeInfo.elementWidth,
      elementHeight = _this$getSizeInfo.elementHeight;
    var _this$getTransform3 = this.getTransform(),
      _this$getTransform3$k = _this$getTransform3.k,
      tk = _this$getTransform3$k === void 0 ? 1 : _this$getTransform3$k,
      _this$getTransform3$x = _this$getTransform3.x,
      tx = _this$getTransform3$x === void 0 ? 0 : _this$getTransform3$x,
      _this$getTransform3$y = _this$getTransform3.y,
      ty = _this$getTransform3$y === void 0 ? 0 : _this$getTransform3$y;
    var dk = k / tk;
    var cx = containerCenter[0],
      cy = containerCenter[1];
    var ox = (typeof point[0] === 'number' ? point[0] : cx) - (cx + tx);
    var oy = (typeof point[1] === 'number' ? point[1] : cy) - (cy + ty);
    if (adjust) {
      // 思路：对元素进行划线分界
      // 1，在元素上边的时候，用元素实际高度一半(eh/2)的基础上在除以双击比例 k 即 eh/2k 作为上分界线，分界线到元素上边缘区域内点击，全部视为在元素上边缘线上点击，即放大后元素上边缘会紧贴在容器上边缘
      // 2，在元素下边的时候，先用容器的高(ch)比上元素实际高(eh)，即ch/eh（但是这个比例值只能在1和2之间（即只针对元素高小于容器高且大于容器高一半的情况）），用这个比例减去1/2k，得到的结果乘以元素实际高(eh)，再以此作为下分界线，分界线到元素下边缘区域内点击，全部视为在元素下边缘线上点击，即放大后元素下边缘会紧贴在容器下边缘
      // 3，找出元素在不受偏移量和边界限制的影响下，点击元素中心点放大后，元素上下各存在一条界线正好与容器边缘重合，计算出该界线到中心点的距离，该距离一定是在元素中心点到元素边缘之间即0,ew/2之间，并且两条界线等距
      // 4，在1，2中算出的上下分界线之间内点击，计算均匀分布对应到在3中算出的上下界线之间内点击，分界线中点处对应元素中点处，最后得到对应的偏移量oy
      // 5，元素左右计算方式如同上下方式一样得到ox
      // 测微信得到的结论
      // 这个偏移量需要要向着边缘点发散
      var cw = containerWidth / 1;
      var ch = containerHeight / 1;
      var ew = elementWidth / tk;
      var eh = elementHeight / tk;
      ox = (0, _utils.between)(ew - (cw - ew) / (dk - 1), [0, ew]) * (0, _utils.ratioOffset)(ox / ew, dk, (0, _utils.between)(cw / ew, [1, 2])) || 0;
      oy = (0, _utils.between)(eh - (ch - eh) / (dk - 1), [0, eh]) * (0, _utils.ratioOffset)(oy / eh, dk, (0, _utils.between)(ch / eh, [1, 2])) || 0;
    }
    ox *= 1 - dk;
    oy *= 1 - dk;
    return [ox, oy];
  };
  _proto.moveBounce = function moveBounce(angle, scale, deltaX, deltaY, point) {
    if (point === void 0) {
      point = [];
    }
    var _this$getTransform4 = this.getTransform(),
      _this$getTransform4$a = _this$getTransform4.a,
      a = _this$getTransform4$a === void 0 ? 0 : _this$getTransform4$a,
      _this$getTransform4$k = _this$getTransform4.k,
      k = _this$getTransform4$k === void 0 ? 1 : _this$getTransform4$k,
      _this$getTransform4$x = _this$getTransform4.x,
      x = _this$getTransform4$x === void 0 ? 0 : _this$getTransform4$x,
      _this$getTransform4$y = _this$getTransform4.y,
      y = _this$getTransform4$y === void 0 ? 0 : _this$getTransform4$y;
    var aRange = this.getRotation();
    if (this.isDamping('rotate')) {
      // 先把当前值反算出阻尼之前的原值
      var ba = (0, _utils.between)(a, aRange);
      a = ba + (0, _damping.revokeDamping)(a - ba, {
        max: 180
      });
      // 再对总值进行总体阻尼计算
      ba = (0, _utils.between)(a += angle, aRange);
      a = ba + (0, _damping.performDamping)(a - ba, {
        max: 180
      });
    } else {
      a = (0, _utils.between)(a += angle, aRange);
    }
    var kRange = this.getScalation();
    if (this.isDamping('scale')) {
      // 先把当前值反算出阻尼之前的原值
      var bk = (0, _utils.between)(k, kRange);
      k = bk * (0, _damping.revokeDamping)(k / bk, {
        max: 2,
        mode: 1
      });
      // 再对总值进行总体阻尼计算
      bk = (0, _utils.between)(k *= scale, kRange);
      k = bk * (0, _damping.performDamping)(k / bk, {
        max: 2,
        mode: 1
      });
    } else {
      k = (0, _utils.between)(k *= scale, kRange);
    }
    var _this$computeOffset2 = this.computeOffset(point, k),
      ox = _this$computeOffset2[0],
      oy = _this$computeOffset2[1];
    if (this.isDamping('scale')) {
      var _this$getSizeInfo2 = this.getSizeInfo(),
        xMax = _this$getSizeInfo2.containerWidth,
        yMax = _this$getSizeInfo2.containerHeight;
      // 先把当前值反算出阻尼之前的原值
      var bx = (0, _utils.between)(x, this.getXTranslation());
      x = bx + (0, _damping.revokeDamping)(x - bx, {
        max: xMax
      });
      // 再对总值进行总体阻尼计算
      bx = (0, _utils.between)(x += ox + deltaX, this.getXTranslation(k));
      x = bx + (0, _damping.performDamping)(x - bx, {
        max: xMax
      });
      // 先把当前值反算出阻尼之前的原值
      var by = (0, _utils.between)(y, this.getYTranslation());
      y = by + (0, _damping.revokeDamping)(y - by, {
        max: yMax
      });
      // 再对总值进行总体阻尼计算
      by = (0, _utils.between)(y += oy + deltaY, this.getYTranslation(k));
      y = by + (0, _damping.performDamping)(y - by, {
        max: yMax
      });
    } else {
      x = (0, _utils.between)(x += ox + deltaX, this.getXTranslation(k));
      y = (0, _utils.between)(y += oy + deltaY, this.getYTranslation(k));
    }
    this.transitionRun({
      a: a,
      k: k,
      x: x,
      y: y
    }, {
      duration: 0
    });
  };
  _proto.resetBounce = function resetBounce(point, cancel) {
    if (point === void 0) {
      point = [];
    }
    if (cancel === void 0) {
      cancel = false;
    }
    var _this$getTransform5 = this.getTransform(),
      _this$getTransform5$a = _this$getTransform5.a,
      a = _this$getTransform5$a === void 0 ? 0 : _this$getTransform5$a,
      _this$getTransform5$k = _this$getTransform5.k,
      k = _this$getTransform5$k === void 0 ? 1 : _this$getTransform5$k,
      _this$getTransform5$x = _this$getTransform5.x,
      x = _this$getTransform5$x === void 0 ? 0 : _this$getTransform5$x,
      _this$getTransform5$y = _this$getTransform5.y,
      y = _this$getTransform5$y === void 0 ? 0 : _this$getTransform5$y;
    // 若允许阻尼，首先应该先把当前值反算出阻尼之前的原值
    if (this.isDamping('rotate')) {
      var ba = (0, _utils.between)(a, this.getRotation());
      a = ba + (0, _damping.revokeDamping)(a - ba, {
        max: 180
      });
    }
    if (this.isDamping('scale')) {
      var bk = (0, _utils.between)(k, this.getScalation());
      k = bk * (0, _damping.revokeDamping)(k / bk, {
        max: 2,
        mode: 1
      });
    }
    if (this.isDamping('translate')) {
      var _this$getSizeInfo3 = this.getSizeInfo(),
        xMax = _this$getSizeInfo3.containerWidth,
        yMax = _this$getSizeInfo3.containerHeight;
      var bx = (0, _utils.between)(x, this.getXTranslation());
      x = bx + (0, _damping.revokeDamping)(x - bx, {
        max: xMax
      });
      var by = (0, _utils.between)(y, this.getYTranslation());
      y = by + (0, _damping.revokeDamping)(y - by, {
        max: yMax
      });
    } // 重置之前是双指移动，是不允许取消动画的
    this.transformTo({
      a: a,
      k: k,
      x: x,
      y: y
    }, point, {
      cancel: cancel
    });
  };
  _proto.dblScale = function dblScale(point) {
    if (point === void 0) {
      point = [];
    }
    // 这三个比例都是用保留三位小数的结果进行比较
    // 其实这里的3应该用1/屏幕的宽高算出的小数位数
    // 此刻比例和位移
    var tk = this.getTransform().k || 1;
    // 双击变化的比例
    var dk = (0, _utils.between)(this.getDblScale(), this.getScalation());
    // 再次双击恢复的比例（初始比例）
    var bk = (0, _utils.between)(1, this.getScalation());
    // 双击变化（如果设置的双击比例大于初始比例并且此刻比例小于或等于初始比例
    // 或者设置的双击比例小于初始比例且此刻比例大于或等于初始比例）
    if (dk > bk && tk <= bk || dk < bk && tk >= bk) {
      if (this.getDblAdjust()) {
        // 需要调整的情况，自己算偏移量，并且旋转置为0
        var _this$computeOffset3 = this.computeOffset(point, dk, this.getDblAdjust()),
          ox = _this$computeOffset3[0],
          oy = _this$computeOffset3[1];
        var _this$getTransform6 = this.getTransform(),
          _this$getTransform6$x = _this$getTransform6.x,
          tx = _this$getTransform6$x === void 0 ? 0 : _this$getTransform6$x,
          _this$getTransform6$y = _this$getTransform6.y,
          ty = _this$getTransform6$y === void 0 ? 0 : _this$getTransform6$y;
        this.transformTo({
          a: 0,
          k: dk,
          x: tx + ox,
          y: ty + oy
        }, {
          cancel: false
        });
      } else {
        // 交给transformTo
        this.transformTo({
          k: dk
        }, point, {
          cancel: false
        });
      }
    } else {
      // 再次双击恢复
      if (this.getDblAdjust()) {
        // 需要调整的情况，置为初始状态
        this.transformTo({
          a: 0,
          k: bk,
          x: 0,
          y: 0
        }, {
          cancel: false
        });
      } else {
        // 交给transformTo
        this.transformTo({
          k: bk
        }, point, {
          cancel: false
        });
      }
    }
  };
  _proto.swipeBounce = function swipeBounce(duration, stretch, key, transition) {
    var _this7 = this;
    var sizeInfo = this.getSizeInfo();
    var maxBounce = sizeInfo[key === 'x' ? 'containerWidth' : 'containerHeight'];
    var xyScale = 1.2 * this.getDblScale();
    var xyPos = this.getTransform()[key] || 0;
    var xyRange = this.getTranslation()[key === 'x' ? 0 : 1];
    var sign = stretch > 0 ? 1 : -1;
    // 对距离进行优化(最大值是当前双击比例下图片宽度)
    var _stretch = Math.max(1, Math.min(Math.abs(stretch), xyScale * maxBounce)) * sign;
    // 对时间进行优化
    var _duration = Math.max(800, Math.min(2500, duration));
    if ((0, _utils.isBetween)(xyPos + _stretch, xyRange)) {
      var _this$transitionRun;
      // 如果加上惯性滑动距离之后图片未超出边界，则图片直接移动
      this.transitionRun((_this$transitionRun = {}, _this$transitionRun[key] = xyPos + _stretch, _this$transitionRun), {
        easing: _transition.easeOutQuad,
        duration: _duration
      });
    } else {
      // 根据边界算出到达边界要走的的距离，有可能松开时已经超出边界，此时xySwipe是需要减掉的超出部分距离
      var _xySwipe = (0, _utils.between)(xyPos + _stretch, xyRange) - xyPos;
      var _xyBounce = 0;
      if (this.isDamping('translate')) {
        // 计算速度时，如果松开时超出边界，xySwipe视作0，其实得到的就是初始速度
        var velocity = ((0, _utils.isBetween)(xyPos, xyRange) ? Math.sqrt(1 - Math.abs(_xySwipe / _stretch)) : 1) * (2 * Math.abs(_stretch) / _duration);
        // 根据到达边界时速度的大小计算出将要Damping的距离（一个与速度成正比计算方式，最大值不能超过容器宽度的1/4）
        _xyBounce = Math.min(30 * velocity, maxBounce / 4) * sign;
      }
      if (typeof transition === 'function') {
        // 交给调用者去计算分配如何transition，并使用回调计算transition配置
        transition(key, _xySwipe, _xyBounce, function (xyMove) {
          // 根据实际走的距离xyMove算出时间占比
          var kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
          return {
            duration: kt * _duration,
            easing: _transition.easeOutQuad
          };
        });
      } else {
        // 如果松开时超出边界，相当于在xyBounce里减掉超出的部分得到的结果，如果超出很多，远远大于xyBounce，则直接就是0
        var xyMove = Math.max((_xySwipe + _xyBounce) * sign, 0) * sign;
        // 整个减速运动中，移动xyMove的时间占比
        var kt = 1 - Math.sqrt(1 - Math.abs(xyMove / _stretch));
        if (xyMove === 0) {
          var _this$transitionRun2;
          // 如果swipe抬起没有移动的距离，则直接归位
          this.transitionRun((_this$transitionRun2 = {}, _this$transitionRun2[key] = (0, _utils.between)(xyPos + xyMove, xyRange), _this$transitionRun2));
        } else {
          var _this$transitionRun3;
          // 先移动xyMove距离
          this.transitionRun((_this$transitionRun3 = {}, _this$transitionRun3[key] = xyPos + xyMove, _this$transitionRun3), {
            duration: kt * _duration,
            easing: _transition.easeOutQuad
          }).then(function () {
            var _this7$transitionRun;
            // 移动后归位
            _this7.transitionRun((_this7$transitionRun = {}, _this7$transitionRun[key] = (0, _utils.between)(xyPos + xyMove, xyRange), _this7$transitionRun));
          });
        }
      }
    }
  };
  return Entity;
}();
var _default = Entity;
exports.default = _default;