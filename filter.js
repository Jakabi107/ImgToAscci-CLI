function ascciArtFromFile (bf, PALATTE, LETTERS_PER_PIXEL){

    let data = getBmpData(bf);
    console.log("Bit-Format: " + data.bitsPerPixel + "-bit");
    let bitmap = getBitmap(bf, data);
    let bitmapRGBA = getBitmapSorted(bitmap, data);
    console.log(data);
    return bitmapRGBAToText(bitmapRGBA, PALATTE, LETTERS_PER_PIXEL);
}


function ascciArtFromLine (bf, PALATTE, LETTERS_PER_PIXEL){
    let data = {
        width:Number.POSITIVE_INFINITY,
        height:1
    };

    let bitmapRGBA = getBitmapSorted(bf, data);
    return bitmapRGBAToText(bitmapRGBA, PALATTE, LETTERS_PER_PIXEL);
}



function getBmpData (bf) {
    return {
        fSize:bf.readInt32LE(2),
        dataOffset:bf.readInt32LE(10),
        width:bf.readInt32LE(18),
        height:Math.abs(bf.readInt32LE(22)),
        bitsPerPixel:Math.abs(bf.readInt32LE(28)),
        bmSize:bf.readUInt32LE(34)
    }
}


function getBitmap (bf, data) {
    return bf.subarray(data.dataOffset);
}


function getBitmapSorted(bitmap, data){
    let bitmapRGBA = [];

    for(let i = 0; i < bitmap.length/4; i++) {
        //sorting every time new arr when new line
        //(eg. width = 12; i = 24 (25. zeichen) -> i mod 12 == 0 -> neue Zeile!!)
        if (i % data.width == 0) bitmapRGBA.push([]);

        let pixel = bitmap.subarray(i*4, (i+1)*4);

        bitmapRGBA[bitmapRGBA.length - 1].push(
            {
                b:pixel.readUInt8(0),
                g:pixel.readUInt8(1),
                r:pixel.readUInt8(2),
                alpha:pixel.readUInt8(3)
            }
        )
    };

    return bitmapRGBA;
}


function bitmapRGBAToText(bitmapRGBA, LETTER_PALETTE, LETTERS_PER_PIXEL){

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

    let range = (highest - lowest)/LETTER_PALETTE.length;


    //remove for fit range
    range = 255/LETTER_PALETTE.length;
    lowest = 0;

    return brightMap.map(row =>{
        return row.map(pixelBr => {
            let letter = brightToLetter(pixelBr, range, lowest, LETTER_PALETTE);
            return Array(LETTERS_PER_PIXEL).fill(letter).join("");
        }).join("");
    });
}


function pixelBrightness (pixel) {
    //return (pixel.r * 0.2126 + pixel.g * 0.7152 + pixel.b * 0.0722);
    return (pixel.r + pixel.g + pixel.b)/3;
}


function brightToLetter(brightness, range, base, LETTER_PALETTE){
    let pos = Math.floor((brightness - base) / range);
    if (pos == LETTER_PALETTE.length) pos = LETTER_PALETTE.length -1;
    return LETTER_PALETTE[pos]
}



module.exports = {
    "ascciArtFromFile":ascciArtFromFile,
    "ascciArtFromLine":ascciArtFromLine,
    "ascciArtFromData":()=>{}
}
