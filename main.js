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
    description: "How many {green letters} used {green per Pixel} \n Recommended to set it greater than 1 when higher than wide"
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


// in


// processing
let output;

let fData;

if (fs.existsSync(options.file)) {
  fData = fs.readFileSync(options.file);

  if (fData.toString("ascii", 0, 2) == "BM") {
    output = filter.ascciArtFromFile(fData, options.pallete, options.letters_per_pixel).join("\n");
  }
  else {
    //isn't a bmp
  }

}
else {
  //no file
}


// output
if (output) {
  if (options.out) fs.writeFile(options.out, output, "ascii", (err) => {
    if (err) throw err;
    console.log("Successfully written:", options.out);
  })

  else console.log(output, "\n");

  return 0
}
else {
  throw new Error("\x1b[4m\x1b[31mNo data received - write -h flag or go to -link- to see args \x1b[0m");
}

