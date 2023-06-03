"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = exports.Line = void 0;
var Line = /** @class */ (function () {
    function Line(input) {
        this.input = input;
        //varibles
        this._data = {
            width: Number.POSITIVE_INFINITY,
            height: 1
        };
        this._rawBmp = input.bf;
    }
    Object.defineProperty(Line.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "pixelMap", {
        get: function () {
            return this.getPixelMap();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "textArr", {
        get: function () {
            return this.toTextArr();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Line.prototype, "string", {
        get: function () {
            return this.toString();
        },
        enumerable: false,
        configurable: true
    });
    // --- 
    Line.prototype.getPixelMap = function () {
        var _this = this;
        var getPixel = function (i) {
            var rawPix = _this._rawBmp.subarray(i * 4, (i + 1) * 4);
            return {
                b: rawPix.readUInt8(0),
                g: rawPix.readUInt8(1),
                r: rawPix.readUInt8(2),
                alpha: rawPix.readUInt8(3)
            };
        };
        var pixelMap = [];
        for (var i = 0; i < this._rawBmp.length / 4; i++) {
            if (i % this._data.width == 0)
                pixelMap.push([]);
            pixelMap[pixelMap.length - 1].push(getPixel(i));
        }
        return pixelMap;
    };
    Line.prototype.toTextArr = function (palette) {
        var _this = this;
        if (palette === void 0) { palette = this.input.palette; }
        return this.pixelMap.map(function (row) {
            return row.map(function (pixel) {
                return _this.brightnessToLetter(_this.pixelBrightness(pixel), palette);
            });
        });
    };
    Line.prototype.toString = function (palette, lettersPerPixel) {
        if (palette === void 0) { palette = this.input.palette; }
        if (lettersPerPixel === void 0) { lettersPerPixel = this.input.lettersPerPixel; }
        return this.toTextArr(palette).map(function (row) {
            return row.map(function (letter) {
                return Array(lettersPerPixel).fill(letter).join("");
            }).join("");
        }).join("\n");
    };
    Line.prototype.pixelBrightness = function (pixel) {
        //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
        return (pixel.r + pixel.g + pixel.b) / 3;
    };
    Line.prototype.brightnessToLetter = function (brightness, palette) {
        var pos = Math.floor(brightness / (255 / palette.length));
        if (pos == palette.length)
            pos--;
        return palette[pos];
    };
    return Line;
}());
exports.Line = Line;
var File = /** @class */ (function (_super) {
    __extends(File, _super);
    function File(input) {
        var _this = _super.call(this, input) || this;
        _this._data = _this.getBmpData();
        _this._rawBmp = _this.getRaw();
        return _this;
    }
    File.prototype.getBmpData = function () {
        return {
            fSize: this.input.bf.readInt32LE(2),
            dataOffset: this.input.bf.readInt32LE(10),
            width: this.input.bf.readInt32LE(18),
            height: Math.abs(this.input.bf.readInt32LE(22)),
            bitsPerPixel: Math.abs(this.input.bf.readInt32LE(28)),
            bmSize: this.input.bf.readUInt32LE(34)
        };
    };
    File.prototype.getRaw = function () {
        return this.input.bf.subarray(this._data.dataOffset);
    };
    return File;
}(Line));
exports.File = File;
