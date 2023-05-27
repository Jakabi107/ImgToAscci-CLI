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
    pallate: string;
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
        return this.data;
    }

    private _rawBmp = this.input.bf;



    // ---
    private getBitmapSorted(){

        let getPixel = (i):PixelFormat =>{
            let rawPix = this._rawBmp.subarray(i*4, (i+1)*4);

            return {
                b:rawPix.readUInt8(0),
                g:rawPix.readUInt8(1),
                r:rawPix.readUInt8(2),
                alpha:rawPix.readUInt8(3)
            };
        };

        let row:[PixelFormat] = [getPixel(0)];
        let bitmapRGBA:[[PixelFormat]] = [row];

        
        for(let i = 1; i < this._rawBmp.length/4; i++) {

            let pixel = getPixel(i);

            if (i % this._data.width == 0){
                bitmapRGBA[Math.floor(i / this._data.width)] = row;
                row = [pixel];
            }  
            else {
                row.push(pixel);
            }
        };
    
        return bitmapRGBA;
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

    let bitmapRGBA = getBitmapSorted(bf, data);
    return bitmapRGBAToText(bitmapRGBA, pallatte, lettersPerPixel)[0];
}


function getBitmap (bf, data) {
    return bf.subarray(data.dataOffset);
}



function bitmapRGBAToText(bitmapRGBA, pallate, lettersPerPixel){

    let highest = -1;
    let lowest = 256;

    let brightMap = bitmapRGBA.map(row => {
        return row.map(pixel => {
            let pixelBright = pixelBrightness(pixel);
            if (pixelBright > highest) highest = pixelBright;
            else if (pixelBright < lowest) lowest = pixelBright;
            return pixelBright;
        });
    });

    let range = (highest - lowest)/pallate.length;


    //remove for fit range
    range = 255/pallate.length;
    lowest = 0;

    return brightMap.map(row =>{
        return row.map(pixelBr => {
            let letter = brightToLetter(pixelBr, range, lowest, pallate);
            return Array(lettersPerPixel).fill(letter).join("");
        }).join("");
    });
}


function pixelBrightness (pixel) {
    //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
    return (pixel.r + pixel.g + pixel.b)/3;
}


function brightToLetter(brightness, range, base, pallate){
    let pos = Math.floor((brightness - base) / range);
    if (pos == pallate.length) pos = pallate.length -1;
    return pallate[pos]
}


export default {
    ascciArtFromFile: ascciArtFromFile,
    ascciArtFromLine: ascciArtFromLine
}