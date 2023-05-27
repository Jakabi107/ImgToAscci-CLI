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
    }
    Object.defineProperty(Main.prototype, "data", {
        get: function () {
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    // ---
    Main.prototype.getBitmapSorted = function () {
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
        var bitmapRGBA = [row];
        for (var i = 1; i < this._rawBmp.length / 4; i++) {
            var pixel = getPixel(i);
            if (i % this._data.width == 0) {
                bitmapRGBA[Math.floor(i / this._data.width)] = row;
                row = [pixel];
            }
            else {
                row.push(pixel);
            }
        }
        ;
        return bitmapRGBA;
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
    var bitmapRGBA = getBitmapSorted(bf, data);
    return bitmapRGBAToText(bitmapRGBA, pallatte, lettersPerPixel)[0];
}
function getBitmap(bf, data) {
    return bf.subarray(data.dataOffset);
}
function bitmapRGBAToText(bitmapRGBA, pallate, lettersPerPixel) {
    var highest = -1;
    var lowest = 256;
    var brightMap = bitmapRGBA.map(function (row) {
        return row.map(function (pixel) {
            var pixelBright = pixelBrightness(pixel);
            if (pixelBright > highest)
                highest = pixelBright;
            else if (pixelBright < lowest)
                lowest = pixelBright;
            return pixelBright;
        });
    });
    var range = (highest - lowest) / pallate.length;
    //remove for fit range
    range = 255 / pallate.length;
    lowest = 0;
    return brightMap.map(function (row) {
        return row.map(function (pixelBr) {
            var letter = brightToLetter(pixelBr, range, lowest, pallate);
            return Array(lettersPerPixel).fill(letter).join("");
        }).join("");
    });
}
function pixelBrightness(pixel) {
    //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
    return (pixel.r + pixel.g + pixel.b) / 3;
}
function brightToLetter(brightness, range, base, pallate) {
    var pos = Math.floor((brightness - base) / range);
    if (pos == pallate.length)
        pos = pallate.length - 1;
    return pallate[pos];
}
exports.default = {
    ascciArtFromFile: ascciArtFromFile,
    ascciArtFromLine: ascciArtFromLine
};
