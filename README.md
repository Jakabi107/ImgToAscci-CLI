# ImgToAscci-CLI
> Version 1.0.0 

A CL tool wich allows you to convert an image (by the time only a bmp) to a string of ascii characters, seen in a Monospace font, looks like the img. 

---
## Installation:
> **Note:** I will update it to access it via command.

> You need to have installed [node.js](https://nodejs.org/en/download) and [npm](https://docs.npmjs.com/about-npm) which normally is preinstalled with node.

 + Open the terminal. First you have to navigate via `cd <path>` into the *dir* or open it in a **code editor** like VS-Code-2 and use the build in *Terminal implementation*. Usally that should direct you directly in the opened dir.  
You can check if it's the right path with `pwd`.

 + Now install all used packages and libraries via `npm install`.
 
 + From now on you can just write `node main.js <args>` and run the programm
 > When your not in the *dir* - write `node <path of main.js> <args>`
 
 + Write `node main.js -h`to see all arguments and meanings


---

## Documentation:

  > **Note:** Under construction

---
### Example:

Example convertation:
> with the included preview file

**Input**:

<img src="https://user-images.githubusercontent.com/117978218/236807155-635e73eb-2588-49d9-8f7f-7416b10859fb.jpg" height="280">

> File [preview.bmp](https://github.com/Jakabi107/ImgToAscci-CLI/blob/main/preview.bmp)

```
 % node main.js -f preview.bmp -o preview.txt
```

**Output**

Should stout data of *bmp* and write the output into *preview.txt*.
> Could be you see no change because *preview.text* is already processed included in the *Zip*, just write another output path (`-o <new path>`) to see a difference.

<details><summary>Result-Preview:</summary>
<p>
 <img src="https://user-images.githubusercontent.com/117978218/236812141-331dfbe3-239b-499a-af3c-5c912d5f1843.png" height="280">
</p>
</details> 

>Hidden cause flickering while scrolling


>File [preview.text](https://github.com/Jakabi107/ImgToAscci-CLI/blob/main/preview.text)



---

## Tasks:

- [ ] Add example 
- [ ] Reverse Brightness Feature 
- [ ] Scale
- [ ] Implementation Converter eg. jpg -> bmp
- [ ] Docs
- [ ] Proper *rdin/rdout*
- [ ] Pipeline Interface
- [ ] Warning to high size
- [ ] Acceppt Buffer Data/file data



---
```
    ___  ________  ___  __    ________  ________  ___     
   |\  \|\   __  \|\  \|\  \ |\   __  \|\   __  \|\  \            Authors: Jakabi107
   \ \  \ \  \|\  \ \  \/  /|\ \  \|\  \ \  \|\ /\ \  \           
 __ \ \  \ \   __  \ \   ___  \ \   __  \ \   __  \ \  \          Version: 1.0.0
|\  \\_\  \ \  \ \  \ \  \\ \  \ \  \ \  \ \  \|\  \ \  \ 
\ \________\ \__\ \__\ \__\\ \__\ \__\ \__\ \_______\ \__\        Thank you for reading!!
 \|________|\|__|\|__|\|__| \|__|\|__|\|__|\|_______|\|__| 
```
 
*Goodbye World.*
