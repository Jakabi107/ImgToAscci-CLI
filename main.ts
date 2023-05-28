#! usr/bin/env node
import * as commandLineArgs from "command-line-args";
import * as commandLineUsage from 'command-line-usage';
import * as fs from 'fs';
import { Buffer } from 'buffer';

import * as filter from './filter';

//options
const optionDefinitions = [
  {
    name: "help",
    alias: "h",
    type: Boolean,
    description: "Usage guide"
  },
  {
    name: "file",
    alias: "f",
    description: "The path of the {green input file}"
  },
  {
    name: "data",
    alias: "d",
    type:String,
    description: "Reads pure data (Bits) - file is prioritized"
  },
  {
    name: "out",
    alias: "o",
    description: "The path of the {green output file} - else in stdout\n"
  },
  {
    name: "pallete",
    defaultValue: " .'^<?(tuQ0mdp*#MB@",
    type: String,
    description: "{green Pallette} of {italic ascci} charakters - lite to dark  \nUse {green {underline \\\\ }} to insert {green spaces} \n",
    typeLabel: "\"{underline .'^<?(tuQ0mdp*#MB@}\""
  },
  {
    name: "lettersPerPixel",
    alias: "w",
    defaultValue: 1,
    type: Number,
    typeLabel: "{underline int}",
    description: "How many {green letters} used {green per Pixel} \n Recommended to set it greater than 1 when higher than wide \n"
  },
  {
    name: "log",
    alias: "l",
    type: Boolean,
    description: "Logs some {green data} of the bitmap"
  }
];

const options = commandLineArgs(optionDefinitions);


// -h
var banner = String.raw`
    ___  ________  ___  __    ________  ________  ___     
   |\  \|\   __  \|\  \|\  \ |\   __  \|\   __  \|\  \    
   \ \  \ \  \|\  \ \  \/  /|\ \  \|\  \ \  \|\ /\ \  \   
 __ \ \  \ \   __  \ \   ___  \ \   __  \ \   __  \ \  \  
|\  \\_\  \ \  \ \  \ \  \\ \  \ \  \ \  \ \  \|\  \ \  \ 
\ \________\ \__\ \__\ \__\\ \__\ \__\ \__\ \_______\ \__\
 \|________|\|__|\|__|\|__| \|__|\|__|\|__|\|_______|\|__|                                             

`.split("\\").join("\\\\");


//the usage guide when flag -h/--help
const createDescription = () => (
  {
    usage: commandLineUsage([
      {
        header: "Ascii_Art",
        content: [
          "Generates an img out of ascci characters (-text file) from a {green bmp file}.",
          "Do use a {green MONOSPACE text font} to make sure the characters width is alway's the same.",
          "",
          "Try to keep the image size {red under 500:500 px (recommendet 100 - 200 px)}."
        ]
      },
      {
        header: "Options",
        optionList: optionDefinitions
      },
      {
        content: banner,
        raw: true
      },
      {
        content: "Project home: {blue {underline https://github.com/Jakabi107/ImgToAscci-CLI}} \nAuthors: Jakabi",
      }
    ])
  }
)

if (options.help) {
  let description = createDescription();
  console.log(description.usage)
  process.exit(0);
}


interface RawFormat {
  buffer:Buffer;
  isFile:Boolean;
  isBmp:Boolean;
}


class Data {

  private _raw:RawFormat = this.readData();

  get raw () {
    return this._raw;
  } 

  private _out:{result:string} = this.toString();

  get out () {
    return this._out;
  }


  public printOut ():void {

    if (options.out) fs.writeFile(options.out, this._out.result.toString(), "ascii", (err) => {
      if (err) throw err;
      process.stdout.write(options.out);
    })
    else process.stdout.write(this._out.result.toString());

  }


  constructor(private options:commandLineArgs.CommandLineOptions){
  }
  
  

  public readData():RawFormat {

    let output:RawFormat = {
      buffer: Buffer.prototype,
      isFile:false,
      isBmp:false
    };

    if (fs.existsSync(this.options.file)) {
      output.buffer = fs.readFileSync(this.options.file);
      output.isFile = true;
    }
    else if (this.options.data){
      //pure data from -d
      output.buffer = Buffer.from(this.options.data);
    }
    else{
      throw new Error("\x1b[4m\x1b[31mInputed data is not valid\x1b[0m");
    }
  
    //check if BMP
    output.isBmp = (output.buffer.toString("ascii", 0, 2) == "BM")
    
    return output;

  }


  public toString():{result:string}{

    let input:filter.Input = {
      bf: this._raw.buffer,
      palette: this.options.pallete,
      lettersPerPixel: this.options.lettersPerPixel
    }

    let output = {result:""};

    if (this._raw.isBmp){
      let file:filter.File = new filter.File(input);
      if (this.options.log) console.log(file.data);
      output.result = file.string;
    }
    else if (this._raw.isFile){
      //Note: convert
      throw new Error("\x1b[4m\x1b[31mPlease input a proper bmp file\x1b[0m")
    }
    else {
      let line:filter.Line = new filter.Line(input);
      output.result = line.string;
    }
  
    return output
  }


}


var mainD = new Data(options);

mainD.printOut();


// if (!options.file && !options.data) process.stdin.on("data", data => {
//   options.file = data.toString();
//   console.log(fs.existsSync(options.file))
//   main(options)
// })
// else main(options);
