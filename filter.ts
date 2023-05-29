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


export interface Input {
    bf: Buffer;
    palette: string;
    lettersPerPixel:number;
}


export class Line {
    
    constructor (protected input:Input) {
        this._rawBmp = input.bf;
    }

    //varibles
    protected _data:DataFormat = {
        width:Number.POSITIVE_INFINITY,
        height:1
    }

    get data ():DataFormat { 
        return this._data;
    }

    protected _rawBmp:Buffer;


    get pixelMap ():PixelFormat[][] {
        return this.getPixelMap();
    }


    get textArr ():string[][] {
        return this.toTextArr();
    }


    get string ():string {
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
        }

        let pixelMap:PixelFormat[][] = [];

        for(let i = 0; i < this._rawBmp.length/4; i++) {
            if (i % this._data.width == 0) pixelMap.push([]);

            pixelMap[pixelMap.length - 1].push(getPixel(i));
        }
    
        return pixelMap;
    }


    private toTextArr(palette:string = this.input.palette):string[][]{

        return this.pixelMap.map(row => {
            return row.map(pixel => {
                return this.brightnessToLetter(this.pixelBrightness(pixel), palette);
            })
        })

    }


    public toString(palette:string = this.input.palette, lettersPerPixel:number = this.input.lettersPerPixel):string {

        return this.toTextArr(palette).map(row => {
            return row.map(letter => {
                return Array(lettersPerPixel).fill(letter).join("");
            }).join("");
        }).join("\n");

    }

    
    private pixelBrightness (pixel:PixelFormat):number {
        //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
        return (pixel.r + pixel.g + pixel.b)/3;
    }


    private brightnessToLetter(brightness:number, palette:string):string {
        let pos:number = Math.floor( brightness / (255 / palette.length) );
        if (pos == palette.length) pos --;
        return palette[pos];
    }

}


export class File extends Line {
    
    constructor (input:Input){
        super(input);
        this._data = this.getBmpData();
        this._rawBmp = this.getRaw();
    }

    
    private getBmpData():DataFormat {

        return {
            fSize: this.input.bf.readInt32LE(2),
            dataOffset: this.input.bf.readInt32LE(10),
            width: this.input.bf.readInt32LE(18),
            height: Math.abs(this.input.bf.readInt32LE(22)),
            bitsPerPixel: Math.abs(this.input.bf.readInt32LE(28)),
            bmSize: this.input.bf.readUInt32LE(34)
        } 
    }


    private getRaw ():Buffer {
        return this.input.bf.subarray(this._data.dataOffset);
    }

}
