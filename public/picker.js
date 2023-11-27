/*
============
color picker
============
*/

const pickr = Pickr.create({
    el: '.color-picker',
    theme: 'classic',
    default: '#000',

    swatches: [
        '#000',
        '#fff'
    ],

    components: {
        preview: true,
        opacity: true,
        hue: true,
        interaction: {
            hex: true,
            rgba: true,
            input: true,
        }
    }
});


pickr.on('change', (color, instance) => {
    let cur_color = color.toRGBA().toString();
    console.log("COLOR", cur_color);
    pickColor(localCTX, cur_color)
    pickr.setColor(cur_color)
    io.emit('pickColor', {cur_color})
})