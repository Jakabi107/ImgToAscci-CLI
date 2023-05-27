#! usr/bin/env node
const commandLineArgs = require("command-line-args");
const commandLineUsage = require('command-line-usage')
const fs = require("fs");

const filter = require("./filter.js")


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
    name: "letters_per_pixel",
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
const banner = String.raw`
    ___  ________  ___  __    ________  ________  ___     
   |\  \|\   __  \|\  \|\  \ |\   __  \|\   __  \|\  \    
   \ \  \ \  \|\  \ \  \/  /|\ \  \|\  \ \  \|\ /\ \  \   
 __ \ \  \ \   __  \ \   ___  \ \   __  \ \   __  \ \  \  
|\  \\_\  \ \  \ \  \ \  \\ \  \ \  \ \  \ \  \|\  \ \  \ 
\ \________\ \__\ \__\ \__\\ \__\ \__\ \__\ \_______\ \__\
 \|________|\|__|\|__|\|__| \|__|\|__|\|__|\|_______|\|__|                                             

`.replaceAll("\\", "\\\\")

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
    ]),

    logo: String.raw`

     ___  ________  ___  __    ________  ________  ___     
    |\  \|\   __  \|\  \|\  \ |\   __  \|\   __  \|\  \    
    \ \  \ \  \|\  \ \  \/  /|\ \  \|\  \ \  \|\ /\ \  \   
 __  \ \  \ \   __  \ \   ___  \ \   __  \ \   __  \ \  \  
 |\  \\_\  \ \  \ \  \ \  \\ \  \ \  \ \  \ \  \|\  \ \  \ 
 \ \________\ \__\ \__\ \__\\ \__\ \__\ \__\ \_______\ \__\
  \|________|\|__|\|__|\|__| \|__|\|__|\|__|\|_______|\|__|                                             

`
  }
)

if (options.help) {
  let description = createDescription();
  console.log(description.usage)
  return 0
}




function main(options){

  let data = readData(options);
  let output = processData(options, data);

  //stdout
  if (options.out) fs.writeFile(options.out, output.result, "ascii", (err) => {
    if (err) throw err;
    process.stdout.write(options.out);
  })
  else process.stdout.write(output.result);
}


class dataOutput {
  buffer;
  isFile = false;
  isBmp = false;
}

function readData(options){
  let output = new dataOutput();
  
  if (fs.existsSync(options.file)) {
    output.buffer = fs.readFileSync(options.file);
    output.isFile = true;
  } 
  else if (options.file){
    //pure data from -f
    output.buffer = new Buffer.from(options.file);
  } 
  else if (options.data){
    //pure data from -d
    output.buffer = new Buffer.from(options.data);
  }
  else{
    throw new Error("\x1b[4m\x1b[31mInputed data is not valid\x1b[0m");
  }

  //check if BMP
  output.isBmp = (output.buffer.toString("ascii", 0, 2) == "BM")


  return output;
}


class processedOutput {
  result;
}

function processData(options, data){

  let output = new processedOutput();

  if (data.isBmp){
    output.result = filter.ascciArtFromFile(data.buffer, options.pallete, options.letters_per_pixel, options.log).join("\n");
  }
  else if (data.isFile){
    //Note: convert
    throw new Error("\x1b[4m\x1b[31mPlease input a proper bmp file\x1b[0m")
  }
  else {
    output.result = filter.ascciArtFromLine(data.buffer, options.pallete, options.letters_per_pixel);
  }

  return output
}


if (!options.file && !options.data) process.stdin.on("data", data => {
  options.file = data.toString();
  console.log(fs.existsSync(options.file))
  main(options)
})
else main(options);
