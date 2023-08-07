const htmlMinifier = require('@node-minify/html-minifier');
const cleanCSS = require('@node-minify/clean-css');
const minify = require('@node-minify/core');

const fs = require('fs');
const path = require('path');
const webp = require('webp-converter');
const sharp = require('sharp');

let wallpapers = require('./wallpapers.json');

console.log('Generating website...')

var ensureDirectoryExistence = function(filePath) {
    var _dirname = path.dirname(filePath);
    if (fs.existsSync(_dirname)) {
      // console.log('exists' + _dirname);
      return true;
    }
    ensureDirectoryExistence(_dirname);
    fs.mkdirSync(_dirname);
};

// const inputPath = path.join(__dirname, 'input');
// console.log(__dirname)
// 
console.log('Copying base files...')
let files = fs.readdirSync(`./source`);
for (const file of files) {
    // console.log(file)    
    let ext = path.extname(file);
    if ((ext == '.htm') || (ext == '.html')) {
        minify( {
            compressor: htmlMinifier,
            input: `./source/${file}`,
            output: 'dist/' + `${file}`,
            callback: function(err, min) {
                if (err) {
                    console.log(chalk.red('ERROR!'));
                    console.log(err);
                    exit;
                } else {
                    // console.log(min);
                    // fs.writeFileSync('.' + _fs + _file.replaceAll(config.source, config.output), min);
                }
            }
        });         
        console.log('Compressed: ' + 'dist/' + `${file}`);
        copied = true;           
    } else {
        if (ext == '.css') {
            minify( {
                compressor: cleanCSS,
                input: `./source/${file}`,
                output: 'dist/' + `${file}`,
                callback: function(err, min) {
                    if (err) {
                        console.log(chalk.red('ERROR!'));
                        console.log(err);
                        exit;
                    } else {
                        // console.log(min);
                        // fs.writeFileSync('.' + _fs + _file.replaceAll(config.source, config.output), min);
                    }                        
                }
            });     
            console.log('Compressed: ' + 'dist/' + `${file}`);
            copied = true;               
        } else {
            console.log('Copied: ' + 'dist/' + `${file}`);
            if (fs.lstatSync(`./source/${file}`).isDirectory() == false) {
                ensureDirectoryExistence('dist/' + `${file}`)
                fs.copyFileSync(`./source/${file}`, 'dist/' + `${file}`);
            }
        }

    }

}


let _walpapers = [];

console.log('Generating wallpaper list...')
wallpapers.wallpapers.forEach((wallpaper) => {
    if (fs.existsSync(path.join(__dirname, wallpaper.url))) {
        // Copy original file
        ensureDirectoryExistence(path.join(__dirname, 'dist/' + wallpaper.url));
        fs.copyFileSync(path.join(__dirname, wallpaper.url), path.join(__dirname, 'dist/' + wallpaper.url));
        // Create thumbnail
        //350x197
        sharp(path.join(__dirname, wallpaper.url))
        .resize(350, 197)
        .toFile(path.join(__dirname, 'dist/' + wallpaper.url.replaceAll('.jpg', '.thumb.webp')), (err, info) => {  });        

        _walp = {}
        _walp['name'] = wallpaper.name;
        _walp['url'] = wallpaper.url;
        _walp['thumb'] = wallpaper.url.replaceAll('.jpg', '.thumb.webp');
        _walp['author'] = wallpaper.author;
        _walp['source_url'] = wallpaper.source_url;
        _walpapers.push(_walp);        
    }
});

fs.writeFileSync(path.join(__dirname, 'dist/wallpapers.json'), JSON.stringify(_walpapers, null, 2));


console.log('Complete!')
