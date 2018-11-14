/* Collective London, info@collectivelondon.com */

(function(a) {
    "use strict";
    a.ThreeSixty = function(b, c) {
        var d = this,
            e, f = [],
            g = "2.0.5";
        d.$el = a(b);
        d.el = b;
        d.$el.data("ThreeSixty", d);
        d.init = function() {
            e = a.extend({}, a.ThreeSixty.defaultOptions, c);
            if (e.disableSpin) {
                e.currentFrame = 1;
                e.endFrame = 1
            }
            d.initProgress();
            d.loadImages()
        };
        d.resize = function() {};
        d.initProgress = function() {
            d.$el.css({
                width: e.width + "px",
                height: e.height + "px",
                "background-image": "none !important"
            });
            if (e.styles) {
                d.$el.css(e.styles)
            }
            d.responsive();
            d.$el.find(e.progress).css({
                marginTop: e.height / 2 - 15 + "px"
            });
            d.$el.find(e.progress).fadeIn("slow");
            d.$el.find(e.imgList).hide()
        };
        d.loadImages = function() {
            var b, c, g, h, i;
            b = document.createElement("li");
            i = e.zeroBased ? 0 : 1;
            c = !e.imgArray ? e.domain + e.imagePath + e.filePrefix + d.zeroPad(e.loadedImages + i) + e.ext + (d.browser.isIE() ? "?" + (new Date).getTime() : "") : e.imgArray[e.loadedImages];
            g = a("<img>").attr("src", c).addClass("previous-image").appendTo(b);
            f.push(g);
            d.$el.find(e.imgList).append(b);
            a(g).load(function() {
                d.imageLoaded()
            })
        };
        d.imageLoaded = function() {
            e.loadedImages += 1;
            a(e.progress + " em").text(Math.floor(e.loadedImages / e.totalFrames * 100) + "%");
            if (e.loadedImages >= e.totalFrames) {
                if (e.disableSpin) {
                    f[0].removeClass("previous-image").addClass("current-image")
                }
                a(e.progress).fadeOut("slow", function() {
                    a(this).hide();
                    a(e.progress + " em").text("0%");
                    d.showImages();
                    d.showNavigation()
                })
            } else {
                d.loadImages()
            }
        };
        d.showImages = function() {
            d.$el.find(".txtC").fadeIn();
            d.$el.find(e.imgList).fadeIn();
            d.ready = true;
            e.ready = true;
            if (e.drag) {
                d.initEvents()
            }
            d.refresh();
            d.initPlugins();
            e.onReady();
            setTimeout(function() {
                d.responsive()
            }, 50)
        };
        d.initPlugins = function() {
            a.each(e.plugins, function(b, c) {
                if (typeof a[c] === "function") {
                    a[c].call(d, d.$el, e)
                } else {
                    throw new Error(c + " not available.")
                }
            })
        };
        d.showNavigation = function() {
            if (e.navigation && !e.navigation_init) {
                var b, c, f, g;
                b = a("<div/>").attr("class", "nav_bar");
                c = a("<a/>").attr({
                    href: "#",
                    class: "nav_bar_next"
                }).html("next");
                f = a("<a/>").attr({
                    href: "#",
                    class: "nav_bar_previous"
                }).html("previous");
                g = a("<a/>").attr({
                    href: "#",
                    class: "nav_bar_play"
                }).html("play");
                b.append(f);
                b.append(g);
                b.append(c);
                d.$el.prepend(b);
                c.bind("mousedown touchstart", d.next);
                f.bind("mousedown touchstart", d.previous);
                g.bind("mousedown touchstart", d.play_stop);
                e.navigation_init = true
            }
        };
        d.play_stop = function(b) {
            b.preventDefault();
            if (!e.autoplay) {
                e.autoplay = true;
                e.play = setInterval(d.moveToNextFrame, e.playSpeed);
                a(b.currentTarget).removeClass("nav_bar_play").addClass("nav_bar_stop")
            } else {
                e.autoplay = false;
                a(b.currentTarget).removeClass("nav_bar_stop").addClass("nav_bar_play");
                clearInterval(e.play);
                e.play = null
            }
        };
        d.next = function(a) {
            if (a) {
                a.preventDefault()
            }
            e.endFrame -= 5;
            d.refresh()
        };
        d.previous = function(a) {
            if (a) {
                a.preventDefault()
            }
            e.endFrame += 5;
            d.refresh()
        };
        d.play = function(a, b) {
            var c = a || e.playSpeed;
            var f = b || e.autoplayDirection;
            e.autoplayDirection = f;
            if (!e.autoplay) {
                e.autoplay = true;
                e.play = setInterval(d.moveToNextFrame, c)
            }
        };
        d.stop = function() {
            if (e.autoplay) {
                e.autoplay = false;
                clearInterval(e.play);
                e.play = null
            }
        };
        d.moveToNextFrame = function() {
            if (e.autoplayDirection === 1) {
                e.endFrame -= 1
            } else {
                e.endFrame += 1
            }
            d.refresh()
        };
        d.gotoAndPlay = function(a) {
            if (e.disableWrap) {
                e.endFrame = a;
                d.refresh()
            } else {
                var b = Math.ceil(e.endFrame / e.totalFrames);
                if (b === 0) {
                    b = 1
                }
                var c = b > 1 ? e.endFrame - (b - 1) * e.totalFrames : e.endFrame;
                var f = e.totalFrames - c;
                var g = 0;
                if (a - c > 0) {
                    if (a - c < c + (e.totalFrames - a)) {
                        g = e.endFrame + (a - c)
                    } else {
                        g = e.endFrame - (c + (e.totalFrames - a))
                    }
                } else {
                    if (c - a < f + a) {
                        g = e.endFrame - (c - a)
                    } else {
                        g = e.endFrame + (f + a)
                    }
                }
                if (c !== a) {
                    e.endFrame = g;
                    d.refresh()
                }
            }
        };
        d.initEvents = function() {
            d.$el.bind("mousedown touchstart touchmove touchend mousemove click", function(a) {
                a.preventDefault();
                if (a.type === "mousedown" && a.which === 1 || a.type === "touchstart") {
                    e.pointerStartPosX = d.getPointerEvent(a).pageX;
                    e.dragging = true;
                    e.onDragStart(e.currentFrame)
                } else if (a.type === "touchmove") {
                    d.trackPointer(a)
                } else if (a.type === "touchend") {
                    e.dragging = false;
                    e.onDragStop(e.endFrame)
                }
            });
            a(document).bind("mouseup", function(b) {
                e.dragging = false;
                e.onDragStop(e.endFrame);
                a(this).css("cursor", "none")
            });
            a(window).bind("resize", function(a) {
                d.responsive()
            });
            a(document).bind("mousemove", function(a) {
                if (e.dragging) {
                    a.preventDefault();
                    if (!d.browser.isIE && e.showCursor) {
                        d.$el.css("cursor", "url(assets/images/hand_closed.png), auto")
                    }
                } else {
                    if (!d.browser.isIE && e.showCursor) {
                        d.$el.css("cursor", "url(assets/images/hand_open.png), auto")
                    }
                }
                d.trackPointer(a)
            });
            a(window).resize(function() {
                d.resize()
            })
        };
        d.getPointerEvent = function(a) {
            return a.originalEvent.targetTouches ? a.originalEvent.targetTouches[0] : a
        };
        d.trackPointer = function(a) {
            if (e.ready && e.dragging) {
                e.pointerEndPosX = d.getPointerEvent(a).pageX;
                if (e.monitorStartTime < (new Date).getTime() - e.monitorInt) {
                    e.pointerDistance = e.pointerEndPosX - e.pointerStartPosX;
                    if (e.pointerDistance > 0) {
                        e.endFrame = e.currentFrame + Math.ceil((e.totalFrames - 1) * e.speedMultiplier * (e.pointerDistance / d.$el.width()))
                    } else {
                        e.endFrame = e.currentFrame + Math.floor((e.totalFrames - 1) * e.speedMultiplier * (e.pointerDistance / d.$el.width()))
                    }
                    if (e.disableWrap) {
                        e.endFrame = Math.min(e.totalFrames - (e.zeroBased ? 1 : 0), e.endFrame);
                        e.endFrame = Math.max(e.zeroBased ? 0 : 1, e.endFrame)
                    }
                    d.refresh();
                    e.monitorStartTime = (new Date).getTime();
                    e.pointerStartPosX = d.getPointerEvent(a).pageX
                }
            }
        };
        d.refresh = function() {
            if (e.ticker === 0) {
                e.ticker = setInterval(d.render, Math.round(1e3 / e.framerate))
            }
        };
        d.render = function() {
            var a;
            if (e.currentFrame !== e.endFrame) {
                a = e.endFrame < e.currentFrame ? Math.floor((e.endFrame - e.currentFrame) * .1) : Math.ceil((e.endFrame - e.currentFrame) * .1);
                d.hidePreviousFrame();
                e.currentFrame += a;
                d.showCurrentFrame();
                d.$el.trigger("frameIndexChanged", [d.getNormalizedCurrentFrame(), e.totalFrames])
            } else {
                window.clearInterval(e.ticker);
                e.ticker = 0
            }
        };
        d.hidePreviousFrame = function() {
            f[d.getNormalizedCurrentFrame()].removeClass("current-image").addClass("previous-image")
        };
        d.showCurrentFrame = function() {
            f[d.getNormalizedCurrentFrame()].removeClass("previous-image").addClass("current-image")
        };
        d.getNormalizedCurrentFrame = function() {
            var a, b;
            if (!e.disableWrap) {
                a = Math.ceil(e.currentFrame % e.totalFrames);
                if (a < 0) {
                    a += e.totalFrames - (e.zeroBased ? 1 : 0)
                }
            } else {
                a = Math.min(e.currentFrame, e.totalFrames - (e.zeroBased ? 1 : 0));
                b = Math.min(e.endFrame, e.totalFrames - (e.zeroBased ? 1 : 0));
                a = Math.max(a, e.zeroBased ? 0 : 1);
                b = Math.max(b, e.zeroBased ? 0 : 1);
                e.currentFrame = a;
                e.endFrame = b
            }
            return a
        };
        d.getCurrentFrame = function() {
            return e.currentFrame
        };
        d.responsive = function() {
            if (e.responsive) {
                d.$el.css({
                    height: d.$el.find(".current-image").first().css("height"),
                    width: "100%"
                })
            }
        };
        d.zeroPad = function(a) {
            function b(a, b) {
                var c = a.toString();
                if (e.zeroPadding) {
                    while (c.length < b) {
                        c = "0" + c
                    }
                }
                return c
            }
            var c = Math.log(e.totalFrames) / Math.LN10;
            var d = 1e3;
            var f = Math.round(c * d) / d;
            var g = Math.floor(f) + 1;
            return b(a, g)
        };
        d.browser = {};
        d.browser.isIE = function() {
            var a = -1;
            if (navigator.appName === "Microsoft Internet Explorer") {
                var b = navigator.userAgent;
                var c = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
                if (c.exec(b) !== null) {
                    a = parseFloat(RegExp.$1)
                }
            }
            return a !== -1
        };
        d.getConfig = function() {
            return e
        };
        a.ThreeSixty.defaultOptions = {
            dragging: false,
            ready: false,
            pointerStartPosX: 0,
            pointerEndPosX: 0,
            pointerDistance: 0,
            monitorStartTime: 0,
            monitorInt: 10,
            ticker: 0,
            speedMultiplier: 7,
            totalFrames: 180,
            currentFrame: 0,
            endFrame: 0,
            loadedImages: 0,
            framerate: 60,
            domains: null,
            domain: "",
            parallel: false,
            queueAmount: 8,
            idle: 0,
            filePrefix: "",
            ext: "png",
            height: 300,
            width: 300,
            styles: {},
            navigation: false,
            autoplay: false,
            autoplayDirection: 1,
            disableSpin: false,
            disableWrap: false,
            responsive: false,
            zeroPadding: false,
            zeroBased: false,
            plugins: [],
            showCursor: false,
            drag: true,
            onReady: function() {},
            onDragStart: function() {},
            onDragStop: function() {},
            imgList: ".threesixty_images",
            imgArray: null,
            playSpeed: 100
        };
        d.init()
    };
    a.fn.ThreeSixty = function(b) {
        return Object.create(new a.ThreeSixty(this, b))
    }
})(jQuery);
if (typeof Object.create !== "function") {
    Object.create = function(a) {
        "use strict";

        function b() {}
        b.prototype = a;
        return new b
    }
}(function(a) {
    var b = "UNKNOWN",
        c = "UNKNOWN";
		c = 'Acid-Yellow';
    if (a("body").data("model")) {
        b = a("body").data("model")
    }
    if (a(".colour-tab-list__item").data("default-swatch") == 1) {
        c = a(".colour-tab-list__item").data("swatch-name")
    }
     
    a(".car").ThreeSixty({
        totalFrames: 35,
        endFrame: 35,
        currentFrame: 5,
        imgList: ".threesixty_images",
        progress: ".spinner",
        imagePath: "/home/img/assets/360-spin/models/" + b + "/ext/" + c + "/",
        filePrefix: "threesixty_",
        ext: ".png",
        width: "100%",
        height: "auto",
        zeroBased: true,
        navigation: false
    });
	
	
    a(".colour-tab-list__item").on("click", function(d) {
		
        if (a(d.target).data("swatch-name") != c) {
            a(".threesixty_images li").remove();
            c = a(d.target).data("swatch-name");
            a(".car").ThreeSixty({
                totalFrames: 35,
                endFrame: 35,
                currentFrame: 5,
                imgList: ".threesixty_images",
                progress: ".spinner",
                imagePath: "/home/img/assets/360-spin/models/" + b + "/ext/" + c + "/",
                filePrefix: "threesixty_",
                ext: ".png",
                width: "100%",
                height: "auto",
                zeroBased: true,
                navigation: false
            });
            if (a("#colour-choice")) {
                a("#colour-choice").text(c.replace("-", " "))
            }
        }
    })
})(jQuery);









//# sourceMappingURL=script-i30N-2017.min.js.map