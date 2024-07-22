// var GENEMAP = GENEMAP || {};
//
// function rgbToHex(rgb) {
//     // Extract the individual RGB components using regular expressions
//     const match = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
//
//     if (!match) {
//         // Return the original value if it doesn't match the expected format
//         return rgb;
//     }
//
//     // Convert the RGB components to hexadecimal and format them with '#'
//     const hexR = Number(match[1]).toString(16).padStart(2, '0');
//     const hexG = Number(match[2]).toString(16).padStart(2, '0');
//     const hexB = Number(match[3]).toString(16).padStart(2, '0');
//
//     // Combine the components to form the hexadecimal color
//     return `#${hexR}${hexG}${hexB}`;
// }
//
// GENEMAP.ColorPicker = function (userConfig) {
//     var defaultConfig = {
//         onSubmitColorClick: $.noop()
//     };
//     var target;
//
//     var config = _.merge({}, defaultConfig, userConfig);
//
//     function drawColorPicker() {
//         const colorPickerWrapper = d3.select(target).append('div').attr({
//             class: 'color-picker-container',
//         });
//
//         colorPickerWrapper.append('button').attr({
//             class: 'color-picker-btn',
//         }).on("click", function () {
//             $(".color-picker-modal").modalPopover("toggle");
//         });
//         const btnBgColor = d3.select('.color-picker-btn').style('background-color');
//         const colorPickerModal = colorPickerWrapper.append('div').attr({
//             class: 'color-picker-modal popover',
//         })
//         const colorPickerContainer = colorPickerModal.append('div').attr({
//             class: 'color-picker-container',
//         })
//         const colorPickerContent = colorPickerContainer.append('div').attr({
//             class: 'color-picker-modal__content'
//         })
//         const colorPickerActions = colorPickerContainer.append('div').attr({
//             class: 'color-picker-modal__actions'
//         })
//         colorPickerActions.append('button').attr({class: 'color-picker-modal__close-btn color-picker-modal__btn'})
//         colorPickerActions.append('button').attr({class: 'color-picker-modal__apply-btn color-picker-modal__btn'}).on("click", config.onSubmitColorClick)
//         colorPickerContent.append('div').attr({
//             class: 'color-picker-modal__selected'
//         }).style('background-color', btnBgColor).text(rgbToHex(btnBgColor))
//         const colorList = colorPickerContent.append('div').attr({
//             class: 'color-picker-modal__color-list'
//         })
//
//         const hexColorsArray = Array.from({length: 20}, () => {
//             const letters = '0123456789ABCDEF';
//             let color = '#';
//             for (let i = 0; i < 6; i++) {
//                 color += letters[Math.floor(Math.random() * 16)];
//             }
//             return color;
//         });
//
//         const colorButtons = colorList.selectAll('button')
//             .data(
//                 hexColorsArray
//             )
//             .enter()
//             .append("button")
//             .style("background-color", function (d) {
//                 return d;
//             })
//             .attr({
//                 class: 'color-picker-modal__color'
//             })
//             .on('click', function (d) {
//                 colorButtons.classed('selected', false);
//                 d3.select(this).classed('selected', true);
//                 d3.select('.color-picker-modal__selected').style('background-color', d).text(d.toLowerCase())
//             })
//
//         $(".color-picker-modal").modalPopover({
//             target: $(".color-picker-btn"),
//             parent: $(".color-picker-btn"),
//             "modal-position": "relative",
//             placement: "top left",
//             boundingSize: config.drawing,
//         });
//
//         console.log('chromosomes from picker', config.chromosomes)
//     }
//
//     function my(selection) {
//         selection.each(function (d) {
//             target = this;
//             drawColorPicker();
//         });
//     }
//
//     my.chromosomes = function (value) {
//         if (!arguments.length) {
//             return config.chromosomes;
//         }
//
//         config.chromosomes = value;
//         return my;
//     };
//
//     my.onSubmitColorClick = function (value) {
//         console.log('onSubmitColorClick', value)
//         d3.select('.color-picker-modal__apply-btn').on("click", value)
//         return my;
//     };
//
//     return my;
// };
