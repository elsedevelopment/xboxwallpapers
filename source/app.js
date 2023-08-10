messages = []
messages['en'] = []
messages['en'] = [
    {
        "title": "Wallpapers for your <i class=\"fab fa-xbox\"></i>",
        "dev": "Developed by",
        "created": "Created by",
        "instructions": 'Put th cursor over the image and then press the button <i class="fas fa-bars"></i> on your control. Select the option "Set as background" on the context menu.'
    }
]
messages['es'] = []
messages['es'] = [
    {
        "title": "Fondos de pantalla para tu <i class=\"fab fa-xbox\"></i>",
        "dev": "Desarrollado por",
        "created": "Creado por",
        "instructions": 'Coloca el cursor sobre la imagen y luego presiona el botón <i class="fas fa-bars"></i> en tu control. Selecciona la opción "Establecer como fondo" en el menú'
    }
]

let wallpapers = []

// var usrlang = navigator.language
// || navigator.userLanguage;
// console.log(
// "User's preferred language is: "
// + usrlang);

// console.log(navigator.languages)

usrlang = '';

var load_lang = function(lang) {
    if (lang === undefined) {
        lang = 'en'
    }
    console.log('Loading language: ' + lang)
    console.log(messages[lang])
    $('h1').html(messages[lang][0].title)
    $('#dev').html(messages[lang][0].dev)
    $('#created').html(messages[lang][0].created)
    $('.instructions').html(messages[lang][0].instructions)
}


var reload_wallpapers = function() {
    // console.log(wallpapers)
    $('#wl').empty();
    wallpapers.forEach((wallpaper) => {
        let wp = $('<div class="wallpaper">');
        let lnk = $('<a>');
        lnk.attr('href', 'javascript:showwallpaper(\'' + wallpaper.url + '\', \'' + wallpaper.name + '\', \'' + wallpaper.author + '\', \'' + wallpaper.source_url + '\')');
        let img = $('<img>');
        img.attr('src', wallpaper.thumb);
        lnk.append(img);
        let name = $('<span class="name">');
        name.text(wallpaper.name);
        let author = $('<span class="author">');
        author.text(wallpaper.author);
        lnk.append(name);
        lnk.append(author);
        wp.append(lnk);
        $('#wl').append(wp);
    });
}

var showwallpaper = function(url, name, author, source_url) {
    $('.wallpaper_preview').toggleClass('on');
    $('.wallpaper_preview_image > a').attr('href', url);
    $('.wallpaper_preview_image img').attr('src', 'images/bgt.png');    
    $('.wallpaper_preview_image img').attr('alt', name);        
    $('#tt').text(name);
    $('.author_info a').attr('href', source_url);
    $('.author_info a').text(author);
    fetch(url).then((response) => {
        $('.wallpaper_preview_image img').attr('src', url);        
    })
}

$(window).on('load', function(){
    fetch('wallpapers.json')
        .then((response) => response.json())
        .then((json) => { 
            wallpapers = json
            reload_wallpapers()
        });

    $('.wallpaper_preview_close').on('click', function(){
        $('.wallpaper_preview').toggleClass('on');
    });
    navigator.languages.forEach((lang) => {
        lng = lang.substring(0, 2)
        if (messages[lng] !== undefined) {
            if (usrlang == '') {
                console.log('Language: ' + lng)
                usrlang = lng
            }        
        }
    });
    
    if (usrlang == '') {
        usrlang = 'en'
    }
    
    if (usrlang !== '') {
        load_lang(usrlang);
    }    
});