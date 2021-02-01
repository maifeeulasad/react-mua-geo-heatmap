"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var GeoHeatmap = /*#__PURE__*/function (_React$Component) {
  _inherits(GeoHeatmap, _React$Component);

  var _super = _createSuper(GeoHeatmap);

  function GeoHeatmap(props) {
    var _this;

    _classCallCheck(this, GeoHeatmap);

    _this = _super.call(this, props);

    _defineProperty(_assertThisInitialized(_this), "setCanvas", function (elem) {
      _this.setState({
        canvas: elem,
        canvasContext: elem.getContext('2d')
      }, function () {
        return _this.drawData();
      });
    });

    _defineProperty(_assertThisInitialized(_this), "getColor", function (input) {
      var indexFloat = _this.state.heatSequenceColors.length * input / 255;
      var indexFloor = Math.floor(indexFloat);
      var indexCeil = Math.ceil(indexFloat);

      if (indexFloor < 0) {
        indexFloor = 0;
      } else if (indexFloor >= _this.state.heatSequenceColors.length) {
        indexFloor = _this.state.heatSequenceColors.length - 1;
      }

      if (indexCeil < 0) {
        indexCeil = 0;
      } else if (indexCeil >= _this.state.heatSequenceColors.length) {
        indexCeil = _this.state.heatSequenceColors.length - 1;
      }

      var ratio = indexFloat - indexFloor;
      return _this.state.heatSequenceColors[indexFloor].map(function (c, i) {
        var weightedAvg = (c * ratio + _this.state.heatSequenceColors[indexCeil][i] * (1 - ratio)) / 2;
        return parseInt(Math.round(weightedAvg).toString());
      });
    });

    _defineProperty(_assertThisInitialized(_this), "drawData", function () {
      for (var i = 0; i < _this.props.data.length; i++) {
        var p = _this.props.data[i];

        _this.state.canvasContext.beginPath();

        var color = 'rgba(0,0,0,255)';

        var _gradient = _this.state.canvasContext.createRadialGradient(0, 0, p[2] / 5, 0, 0, p[2]);

        _gradient.addColorStop(0, color);

        _gradient.addColorStop(1, 'rgba(255,255,255,0)');

        _this.state.canvasContext.fillStyle = _gradient;

        _this.state.canvasContext.setTransform(1, 0, 0, 1, p[0], p[1]);

        _this.state.canvasContext.beginPath();

        _this.state.canvasContext.arc(0, 0, p[2], 0, 2 * Math.PI, false);

        _this.state.canvasContext.fill();
      }

      var gradient = _this.state.canvasContext.getImageData(0, 0, _this.props.width, _this.props.height);

      gradient = _this.colorData(gradient);

      _this.state.canvasContext.putImageData(gradient, 0, 0, 0, 0, _this.props.width, _this.props.height);
    });

    _defineProperty(_assertThisInitialized(_this), "colorData", function (gradient) {
      console.log(gradient);

      for (var i = 0; i < gradient.data.length; i += 4) {
        var r = gradient.data[i];
        var g = gradient.data[i + 1];
        var b = gradient.data[i + 2]; //let gray = r*0.3 + g*0.59 + b*0.11;

        var gray = r * 0.3 + g * 0.59 + b * 0.11;
        var a = gradient.data[i + 3];
        var actualGray = gray * (255 - a) / 255;

        var color = _this.getColor(actualGray);

        gradient.data[i] = color[0];
        gradient.data[i + 1] = color[1];
        gradient.data[i + 2] = color[2];
      }

      console.log(gradient);
      return gradient;
    });

    _this.state = {
      canvas: null,
      canvasContext: null,
      heatSequenceColors: [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    };
    return _this;
  }

  _createClass(GeoHeatmap, [{
    key: "componentDidMount",
    value: function componentDidMount() {//this.drawData();
    }
  }, {
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react.default.createElement("canvas", {
        className: "background",
        ref: this.setCanvas,
        width: this.props.width,
        height: this.props.height
      });
    }
  }]);

  return GeoHeatmap;
}(_react.default.Component);

var _default = GeoHeatmap;
exports.default = _default;