"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Main = /** @class */ (function () {
    function Main(input) {
        this.input = input;
        //varibles
        this._data = {
            width: Number.POSITIVE_INFINITY,
            height: 1
        };
        this._rawBmp = this.input.bf;
        this._pixelMap = this.getPixelMap();
    }
    Object.defineProperty(Main.prototype, "data", {
        get: function () {
            return this._data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Main.prototype, "pixelMap", {
        get: function () {
            return this._pixelMap;
        },
        enumerable: false,
        configurable: true
    });
    // --- 
    Main.prototype.getPixelMap = function () {
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
        var row = [getPixel(0)];
        var pixelMap = [row];
        for (var i = 1; i < this._rawBmp.length / 4; i++) {
            var pixel = getPixel(i);
            if (i % this._data.width == 0) {
                pixelMap[Math.floor(i / this._data.width)] = row;
                row = [pixel];
            }
            else {
                row.push(pixel);
            }
        }
        ;
        return pixelMap;
    };
    Main.prototype.pixelMapToTextArr = function (palette, lettersPerPixel) {
        var _this = this;
        return this._pixelMap.map(function (row) {
            return row.map(function (pixel) {
                return _this.brightnessToLetter(_this.pixelBrightness(pixel), palette);
            });
        });
    };
    Main.prototype.pixelBrightness = function (pixel) {
        //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
        return (pixel.r + pixel.g + pixel.b) / 3;
    };
    Main.prototype.brightnessToLetter = function (brightness, pallate) {
        var pos = Math.floor(brightness / (255 / pallate.length));
        if (pos == pallate.length)
            pos--;
        return pallate[pos];
    };
    return Main;
}());
function ascciArtFromFile(bf, palatte, lettersPerPixel, log) {
    if (log === void 0) { log = false; }
    var data = getBmpData(bf);
    if (log)
        console.log("Bit-Format: " + data.bitsPerPixel + "-bit");
    var bitmap = getBitmap(bf, data);
    var bitmapRGBA = getBitmapSorted(bitmap, data);
    if (log)
        console.log(data);
    return bitmapRGBAToText(bitmapRGBA, palatte, lettersPerPixel);
}
function ascciArtFromLine(bf, pallatte, lettersPerPixel) {
    // let data = {
    //     width:number.POSITIVE_INFINITY,
    //     height:1
    // };
    //let bitmapRGBA = getBitmapSorted(bf, data);
    return bitmapRGBAToText(bitmapRGBA, pallatte, lettersPerPixel)[0];
}
function getBitmap(bf, data) {
    return bf.subarray(data.dataOffset);
}
function bitmapRGBAToText(bitmapRGBA, pallate, lettersPerPixel) {
    var highest = -1;
    var lowest = 256;
    var range = (highest - lowest) / pallate.length;
    //remove for fit range
    range = 255 / pallate.length;
    lowest = 0;
}
exports.default = {
    ascciArtFromFile: ascciArtFromFile,
    ascciArtFromLine: ascciArtFromLine
};
