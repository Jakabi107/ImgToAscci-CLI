#! usr/bin/env node
"use strict";
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
Object.defineProperty(exports, "__esModule", { value: true });
var commandLineArgs = require("command-line-args");
var commandLineUsage = require("command-line-usage");
var fs = require("fs");
var buffer_1 = require("buffer");
var filter = require("./filter");
//options
var optionDefinitions = [
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
        type: String,
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
var options = commandLineArgs(optionDefinitions);
// -h
var banner = String.raw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n    ___  ________  ___  __    ________  ________  ___     \n   |  |   __  |  |   |   __  |   __  |      \n         |     /  /|   |     | /      \n __        __      ___      __      __       \n|  \\_           \\            |      \n ________ __ __ __\\ __ __ __ _______ __ |________||__||__||__| |__||__||__||_______||__|                                             \n\n"], ["\n    ___  ________  ___  __    ________  ________  ___     \n   |\\  \\|\\   __  \\|\\  \\|\\  \\ |\\   __  \\|\\   __  \\|\\  \\    \n   \\ \\  \\ \\  \\|\\  \\ \\  \\/  /|\\ \\  \\|\\  \\ \\  \\|\\ /\\ \\  \\   \n __ \\ \\  \\ \\   __  \\ \\   ___  \\ \\   __  \\ \\   __  \\ \\  \\  \n|\\  \\\\_\\  \\ \\  \\ \\  \\ \\  \\\\ \\  \\ \\  \\ \\  \\ \\  \\|\\  \\ \\  \\ \n\\ \\________\\ \\__\\ \\__\\ \\__\\\\ \\__\\ \\__\\ \\__\\ \\_______\\ \\__\\\n \\|________|\\|__|\\|__|\\|__| \\|__|\\|__|\\|__|\\|_______|\\|__|                                             \n\n"]))).split("\\").join("\\\\");
//the usage guide when flag -h/--help
var createDescription = function () { return ({
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
}); };
if (options.help) {
    var description = createDescription();
    console.log(description.usage);
    process.exit(0);
}
var Data = /** @class */ (function () {
    function Data(options) {
        this.options = options;
        this._rawData = this.readData();
        this._out = this.toString();
    }
    Object.defineProperty(Data.prototype, "rawData", {
        get: function () {
            return this._rawData;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Data.prototype, "out", {
        get: function () {
            return this._out;
        },
        enumerable: false,
        configurable: true
    });
    Data.prototype.printOut = function () {
        if (options.out)
            fs.writeFile(options.out, this._out.result.toString(), "ascii", function (err) {
                if (err)
                    throw err;
                process.stdout.write(options.out);
            });
        else
            process.stdout.write(this._out.result.toString());
    };
    Data.prototype.readData = function () {
        var output = {
            buffer: buffer_1.Buffer.prototype,
            isFile: false,
            isBmp: false
        };
        if (fs.existsSync(this.options.file)) {
            output.buffer = fs.readFileSync(this.options.file);
            output.isFile = true;
        }
        else if (this.options.data) {
            //pure data from -d
            output.buffer = buffer_1.Buffer.from(this.options.data);
        }
        else {
            throw new Error("\x1b[4m\x1b[31mInputed data is not valid\x1b[0m");
        }
        //check if BMP
        output.isBmp = (output.buffer.toString("ascii", 0, 2) == "BM");
        return output;
    };
    Data.prototype.toString = function (palette, lettersPerPixel) {
        var input = {
            bf: this._rawData.buffer,
            palette: palette ? palette : this.options.pallete,
            lettersPerPixel: lettersPerPixel ? lettersPerPixel : this.options.lettersPerPixel
        };
        var output = { result: "" };
        if (this._rawData.isBmp) {
            var file = new filter.File(input);
            if (this.options.log)
                console.log(file.data);
            output.result = file.string;
        }
        else if (this._rawData.isFile) {
            //Note: convert
            throw new Error("\x1b[4m\x1b[31mPlease input a proper bmp file\x1b[0m");
        }
        else {
            var line = new filter.Line(input);
            output.result = line.string;
        }
        return output;
    };
    return Data;
}());
var mainData = new Data(options);
mainData.printOut();
var templateObject_1;
// if (!options.file && !options.data) process.stdin.on("data", data => {
//   options.file = data.toString();
//   console.log(fs.existsSync(options.file))
//   main(options)
// })
// else main(options);
