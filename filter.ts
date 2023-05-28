interface DataFormat {
    fSize?:number;
    dataOffset?:number;
    bitsPerPixel?:number;
    bmSize?:number;
    width:number;
    height:number;
}


interface PixelFormat {
    b:number;
    g:number;
    r:number;
    alpha:number;
}


interface Input {
    bf: Buffer;
    palette: string;
    lettersPerPixel:number;
}


class Main {
    
    constructor (private input:Input) {
    
    }

    //varibles
    private _data:DataFormat = {
        width:Number.POSITIVE_INFINITY,
        height:1
    }

    get data ():DataFormat{
        return this._data;
    }

    private _rawBmp:Buffer = this.input.bf;


    private _pixelMap:PixelFormat[][] = this.getPixelMap();

    get pixelMap () {
        return this._pixelMap;
    }

    get string () {
        return this.toString();
    }


    // --- 
    private getPixelMap():PixelFormat[][] {

        let getPixel = (i):PixelFormat =>{
            let rawPix = this._rawBmp.subarray(i*4, (i+1)*4);

            return {
                b:rawPix.readUInt8(0),
                g:rawPix.readUInt8(1),
                r:rawPix.readUInt8(2),
                alpha:rawPix.readUInt8(3)
            };
        };

        let pixelMap:PixelFormat[][] = [];

        for(let i = 1; i < this._rawBmp.length/4; i++) {
            if (i % this._data.width == 0) pixelMap.push([]);

            pixelMap[pixelMap.length - 1].push(getPixel(i));
        };
    
        return pixelMap;
    }


    public pixelMapToTextArr(palette:string = this.input.palette):string[][]{

        return this._pixelMap.map(row => {
            return row.map(pixel => {
                return this.brightnessToLetter(this.pixelBrightness(pixel), palette);
            });
        });

    }


    public toString(palette:string = this.input.palette, lettersPerPixel:number = this.input.lettersPerPixel):string {

        return this._pixelMap.map(row => {
            row.map(letter => {
                return Array(lettersPerPixel).fill(letter).join("");
            }).join("");
        }).join("\n");

    }

    
    public pixelBrightness (pixel:PixelFormat):number {
        //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
        return (pixel.r + pixel.g + pixel.b)/3;
    }


    public brightnessToLetter(brightness:number, palette:string):string {
        let pos:number = Math.floor( brightness / (255 / palette.length) );
        if (pos == palette.length) pos --;
        return palette[pos];
    }

    // private getBmpData():BmpDataFormat {

    //     return {
    //         fSize: this.input.bf.readInt32LE(2),
    //         dataOffset: this.input.bf.readInt32LE(10),
    //         width: this.input.bf.readInt32LE(18),
    //         height: Math.abs(this.input.bf.readInt32LE(22)),
    //         bitsPerPixel: Math.abs(this.input.bf.readInt32LE(28)),
    //         bmSize: this.input.bf.readUInt32LE(34)
    //     } 
    // }


}


function ascciArtFromFile (bf, palatte, lettersPerPixel, log = false){

    let data = getBmpData(bf);
    if (log) console.log("Bit-Format: " + data.bitsPerPixel + "-bit");
    let bitmap = getBitmap(bf, data);
    let bitmapRGBA = getBitmapSorted(bitmap, data);
    if (log) console.log(data);
    return bitmapRGBAToText(bitmapRGBA, palatte, lettersPerPixel);
}


function ascciArtFromLine (bf, pallatte, lettersPerPixel){

    // let data = {
    //     width:number.POSITIVE_INFINITY,
    //     height:1
    // };

    //let bitmapRGBA = getBitmapSorted(bf, data);
    return bitmapRGBAToText(bitmapRGBA, pallatte, lettersPerPixel)[0];
}


function getBitmap (bf, data) {
    return bf.subarray(data.dataOffset);
}



function bitmapRGBAToText(bitmapRGBA, pallate, lettersPerPixel){

    let highest = -1;
    let lowest = 256;



    let range = (highest - lowest)/pallate.length;


    //remove for fit range
    range = 255/pallate.length;
    lowest = 0;

    
}



export default {
    ascciArtFromFile: ascciArtFromFile,
    ascciArtFromLine: ascciArtFromLine
}