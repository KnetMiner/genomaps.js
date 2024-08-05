//Source: https://github.com/gegham-khachatryan/BootstrapModalPopover
//Forked from: https://github.com/scruffles/BootstrapModalPopover

//The MIT License (MIT)
//
//Copyright (c) 2013-2014 Bryan Young
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.
// src/scripts/modalPopover.js

import $ from "jquery";

/**
 * ModalPopover class definition
 */
// class ModalPopover {
//   constructor(element, options) {
//     this.options = options;
//     this.$body = $(document.body);
//     this.$navbar = $(".navbar.navbar-fixed-top");
//     this.$element = $(element).on(
//       "click.dismiss.modal-popup",
//       '[data-dismiss="modal-popup"]',
//       this.hide.bind(this)
//     );
//     this.$dialog = this.$element.find(".modal-dialog");
//     if (this.options.remote) {
//       this.$element.find(".popover-content").load(this.options.remote);
//     }
//     this.$parent = options.$parent;
//   }

//   getDimensions($element) {
//     let width, height;

//     if ("offsetWidth" in $element[0] && $element[0].offsetWidth) {
//       width = $element[0].offsetWidth;
//       height = $element[0].offsetHeight;
//     } else if ("getBBox" in $element[0]) {
//       const bbox = $element[0].getBBox();
//       const ctm = $element[0].getScreenCTM();
//       width = bbox.width * ctm.a;
//       height = bbox.height * ctm.d;
//     }

//     return { width, height };
//   }

//   show() {
//     for (let round = 0; round < 2; round++) {
//       const $dialog = this.$element;
//       $dialog.css({ top: 0, left: 0, display: "block", "z-index": 1050 });

//       const dialogWidth = $dialog[0].offsetWidth;
//       const dialogHeight = $dialog[0].offsetHeight;

//       const parent = this.$parent;

//       let parentPosition;
//       const positionDirective = {
//         my: "left top",
//         at: "left top",
//         of: parent,
//         collision: "none",
//         using: function (hash) {
//           parentPosition = hash;
//         },
//       };

//       const target = document.getElementById("genemap-target");
//       const relativeTop =
//         parent[0].getBoundingClientRect().top -
//         target.getBoundingClientRect().top;
//       const relativeLeft =
//         parent[0].getBoundingClientRect().left -
//         target.getBoundingClientRect().left;

//       parentPosition = {
//         top: relativeTop,
//         left: relativeLeft,
//       };
//       $dialog.position(positionDirective);

//       const parentDimensions = this.getDimensions($(parent));

//       parentPosition = { ...parentPosition, ...parentDimensions };

//       const placement =
//         typeof this.options.placement === "function"
//           ? this.options.placement.call(this, $dialog[0], this.$element[0])
//           : this.options.placement;

//       let boundLeftPos = null;
//       let boundRightPos = null;

//       if (this.options.boundingSize) {
//         const boundingLeftDirective = {
//           my: "left center",
//           at: "right center",
//           of: this.options.boundingSize[0],
//           collision: "none",
//           using: function (hash) {
//             boundLeftPos = hash;
//           },
//         };

//         $dialog.position(boundingLeftDirective);

//         const boundingRightDirective = {
//           my: "right center",
//           at: "left center",
//           of: this.options.boundingSize[0],
//           collision: "none",
//           using: function (hash) {
//             boundRightPos = hash;
//           },
//         };

//         $dialog.position(boundingRightDirective);
//       }

//       const arrowMargin = 10;

//       let tp;
//       switch (placement) {
//         case "bottom":
//           tp = {
//             top: parentPosition.top + parentPosition.height,
//             left:
//               parentPosition.left + parentPosition.width / 2 - dialogWidth / 2,
//           };
//           break;
//         case "top":
//           tp = {
//             top: parentPosition.top - dialogHeight,
//             left:
//               parentPosition.left + parentPosition.width / 2 - dialogWidth / 2,
//           };
//           break;
//         case "left":
//           let left = parentPosition.left - dialogWidth;
//           if (boundRightPos) {
//             left = Math.max(left, boundRightPos.left) - arrowMargin;
//           }
//           tp = {
//             top:
//               parentPosition.top + parentPosition.height / 2 - dialogHeight / 2,
//             left,
//           };
//           break;
//         case "right":
//           let rightLeft = parentPosition.left + parentPosition.width;
//           if (boundLeftPos) {
//             rightLeft = Math.min(rightLeft, boundLeftPos.left) + arrowMargin;
//           }
//           tp = {
//             top:
//               parentPosition.top +
//               parentPosition.height * 1.6 -
//               dialogHeight / 2,
//             left: rightLeft,
//           };
//           break;
//         case "top left":
//           tp = {
//             top: parentPosition.top - dialogHeight,
//             left: parentPosition.left + parentPosition.width / 2,
//           };
//           break;
//       }

//       $dialog.css(tp).addClass(placement).addClass("in");

//       $dialog.toggleClass("force-redraw");

//       $.fn.modal.Constructor.prototype.show.call(this, arguments); // super
//     }
//   }

//   backdrop(callback) {
//     const animate = this.$element.hasClass("fade") ? "fade" : "";

//     if (this.isShown && this.options.backdrop) {
//       const doAnimate = $.support.transition && animate;

//       this.$backdrop = $(
//         `<div class="modal-backdrop ${animate}" style="background:none" />`
//       ).appendTo(document.body);

//       if (this.options.backdrop !== "static") {
//         this.$backdrop.on("click", this.hide.bind(this));
//       }

//       if (doAnimate) this.$backdrop[0].offsetWidth; // force reflow

//       this.$backdrop.addClass("in");

//       doAnimate
//         ? this.$backdrop.one($.support.transition.end, callback)
//         : callback();

//       if (this.bodyIsOverflowing) {
//         this.$navbar.css({ paddingRight: this.scrollbarWidth });
//       }
//     } else if (!this.isShown && this.$backdrop) {
//       this.$backdrop.removeClass("in");

//       $.support.transition && this.$element.hasClass("fade")
//         ? this.$backdrop.one(
//             $.support.transition.end,
//             this.removeBackdrop.bind(this)
//           )
//         : this.removeBackdrop();

//       this.$body.removeClass("modal-open");

//       this.$navbar.css({ paddingRight: 0 });
//       this.$body.css({ paddingRight: 0 });
//     } else if (callback) {
//       callback();
//     }
//   }
// }

// /**
//  * ModalPopover jQuery plugin definition
//  */
// $.fn.modalPopover = function (option) {
//   return this.each(function () {
//     const $this = $(this);
//     let data =
//       typeof option === "string" ? $this.data("modal-popover") : undefined;
//     const options = $.extend(
//       {},
//       $.fn.modalPopover.defaults,
//       $this.data(),
//       typeof option === "object" && option
//     );
//     options.$parent =
//       options.$parent || (data && data.$parent) || $(options.target);

//     if (!data) {
//       $this.data("modal-popover", (data = new ModalPopover(this, options)));
//     }

//     if (typeof option === "string") data[option]();
//   });
// };

// $.fn.modalPopover.Constructor = ModalPopover;

// $.fn.modalPopover.defaults = $.extend({}, $.fn.modal.defaults, {
//   placement: "right",
//   modalPosition: "body",
//   keyboard: true,
//   backdrop: true,
// });

// $(function () {
//   $("body").on(
//     "click.modal-popover.data-api",
//     '[data-toggle="modal-popover"]',
//     function (e) {
//       const $this = $(this);
//       const href = $this.attr("href");
//       const $dialog = $(
//         $this.attr("data-target") ||
//           (href && href.replace(/.*(?=#[^\s]+$)/, ""))
//       ); // strip for ie7
//       const option = $dialog.data("modal-popover")
//         ? "toggle"
//         : $.extend(
//             { remote: !/#/.test(href) && href },
//             $dialog.data(),
//             $this.data()
//           );
//       option.$parent = $this;

//       e.preventDefault();

//       $dialog
//         .modalPopover(option)
//         .modalPopover("show")
//         .one("hide", function () {
//           $this.focus();
//         });
//     }
//   );
// });

// export default ModalPopover;
