// TopShelf Web UI - Slideshow v1.0
// Author: David Craig
// Email: davidcraignz@gmail.com

(function ($) {
	$.fn.tsSlideshow = function(options) {
		// default settings
		var settings = $.extend({
			"transition": "slide"
			, "transitionSpeed": 250
			, "autoAdvance": false
			, "autoAdvanceSpeed": 1000
			, "loop": true
		}, options);
		
		return this.each(function() {
			var slideshow = {
				container: this
				, settings: settings
				, slideshowWidth: $(this).outerWidth()
				, panelsWrapper: $(this).find(".panels")
				, panels: $(this).find(".panel")
				, navWrapper: $(this).find(".nav")
				, markers: $(this).find(".marker")
				, steps: $(this).find(".step")
			};
			
			////////////
			// MODELS //
			////////////
			
			// slide transitions
			var slide = function () {
				var fx = {};
				var paddingRight = parseInt($(slideshow.container).css("padding-right"), 10)
					, paddingLeft = parseInt($(slideshow.container).css("padding-left"), 10);
					
				(function() {
					fx.tranOut = function (o) {
						var borderOffset = parseInt(o.outgoing.css("border-left-width"), 10) + parseInt(o.outgoing.css("border-right-width"), 10);
						
						o.outgoing.removeClass("current");
						
						if (o.direction === "forward") {
							$(o.outgoing).animate({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							}, slideshow.settings.transitionSpeed);
						} else {
							$(o.outgoing).animate({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							}, slideshow.settings.transitionSpeed);
						}
					};
					
					fx.tranIn = function(o) {
						var borderOffset = parseInt(o.incoming.css("border-left-width"), 10) + parseInt(o.incoming.css("border-right-width"), 10);
						
						$(o.incoming).animate({
							left: "50%"
							, marginLeft: "-" + ($(slideshow.container).width() / 2)
						}, slideshow.settings.transitionSpeed, function () {
							$(o.incoming).prevAll().css({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							});
							
							$(o.incoming).nextAll().css({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							});
							
							o.incoming.addClass("current");
						});
					};
					
					fx.restart = function (o) {
						var borderOffset = parseInt(o.outgoing.css("border-left-width"), 10) + parseInt(o.outgoing.css("border-right-width"), 10);
						
						if (o.direction === "forward") {
							$(o.incoming).css({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							});
						} else {
							$(o.incoming).css({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							});
						}
					};
					
					fx.init = function() {
						var paddingRight = parseInt($(slideshow.container).css("padding-left"), 10)
							, borderOffset = parseInt($(slideshow.panels[0]).css("border-left-width"), 10) + parseInt($(slideshow.panels[0]).css("border-right-width"), 10);
						l = slideshow.panels.length;
						for (i = 1; i < l; i += 1) {
							$(slideshow.panels[i]).css({
								left: "100%"
								, marginLeft: paddingRight
							});
						}
					}
				})();
				return fx;
			};
			
			// fade transitions
			var fade = function () {
				var fx = {};
				(function() {
					fx.tranIn = function(o) {
						$(o.incoming).fadeIn(slideshow.settings.transitionSpeed, function () {
							$(o.incoming).addClass("current");
						});
					};
					
					fx.tranOut = function (o) {
						$(o.outgoing).removeClass("current");
						$(o.outgoing).fadeOut(slideshow.settings.transitionSpeed);
					};
					
					fx.init = function () {
						for (i = 1; i < slideshow.panels.length; i += 1) {
							$(slideshow.panels[i]).hide();
						}
					};
				})();
				return fx;
			};
			
			//////////////
			// CONTROLS //
			//////////////
			
			var controls = function(fx) {
				var ctr = {};
				(function() {
					ctr.back = function () {
						var o = {};
						var prevMarker = "";
						o.outgoing = slideshow.panelsWrapper.children(".current");
						
						if (o.outgoing.length) { // make sure transition has finished before starting another one
							o.incoming = slideshow.panelsWrapper.children(".current").prev()
							, o.direction = "back";
							
							if (o.incoming.length) {
								prevMarker = slideshow.navWrapper.children(".current").prev();
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								$(prevMarker).addClass("current");
							} else if (slideshow.settings.loop === true) {
								prevMarker = $(slideshow.markers[slideshow.markers.length - 1]);
								o.incoming = $(slideshow.panels[slideshow.panels.length - 1]);
								try { // transition may require a restart method when looping
									fx.restart(o);
								} catch (err) {}
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								$(prevMarker).addClass("current");
							}
						}
					};
					
					ctr.forward = function () {
						var o = {};
						var pos = "";
						o.outgoing = slideshow.panelsWrapper.children(".current");
						
						if (o.outgoing.length) { // make sure transition has finished before starting another one
							o.incoming = slideshow.panelsWrapper.children(".current").next()
							, o.direction = "forward";
							
							if (o.incoming.length) {
								pos = $(slideshow.panelsWrapper.children(".panel")).index(o.incoming);
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								$(slideshow.markers[pos]).addClass("current");
							} else if (slideshow.settings.loop === true) {
								nextMarker = $(slideshow.markers[0]);
								o.incoming = $(slideshow.panels[0]);
								try { // transition may require a restart method when looping
									fx.restart(o);
								} catch (err) {}
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								$(slideshow.markers[0]).addClass("current");
							}
						}
					};
					
					ctr.jumpTo = function (p) {
						var o = {}
						o.outgoing = slideshow.panelsWrapper.children(".current")
						, o.incoming = $(p)
						, o.direction = "back";
						
						var i = 0
							, nextPanels = o.outgoing.nextAll()
							, l = nextPanels.length
							, pos = $(slideshow.panelsWrapper.children(".panel")).index(o.incoming);
							
						if (o.outgoing.length) { // make sure transition has finished before starting another one
							for (i = 0; i < l; i += 1) {
								if (nextPanels[i] === o.incoming[0]) {
									o.direction = "forward"
								}
							}
							
							fx.tranOut(o);
							fx.tranIn(o);
							
							$(slideshow.markers).removeClass("current");
							$(slideshow.markers[pos]).addClass("current");
						}
					};
				})();
				return ctr;
			}
			
			////////////
			// EVENTS //
			////////////
			
			var events = function(ctr) {
				var evt = {};
				(function () {
					evt.markers = function () {
						var l = slideshow.markers.length;
						if (l > 0) {
							for (i = 0; i < l; i += 1) {
								(function (ii) {
									$(slideshow.markers[ii]).bind("click", function (e) {
										e.preventDefault();
										if (!$(this).hasClass("current")) {
											ctr.jumpTo(slideshow.panels[ii]);
										}
									});
								} (i));
							}
						}
					};
					
					evt.steps = function () {
						// previous and next
						if (slideshow.steps.length > 0) {
							$(slideshow.steps[0]).bind("click", function (e) {
								e.preventDefault();
								ctr.back();
							});
							$(slideshow.steps[1]).bind("click", function (e) {
								e.preventDefault();
								ctr.forward();
							});
						}
					};
				})();
				return evt;
			};
			
			//////////////
			// LIFT OFF //
			//////////////
			
			(function() {
				switch (slideshow.settings.transition) {
					case "fade":
						var fx = fade(slideshow);
						break;
					default:
						var fx = slide(slideshow);
						break;
				}
				
				var ctr = controls(fx);
				var evt = events(ctr);
				
				evt.steps();
				evt.markers();
				
				fx.init();
				
				$(slideshow.panels[0]).addClass("current");
				$(slideshow.markers[0]).addClass("current");
				
				// auto advance
				if (slideshow.settings.autoAdvance === true) {
					(function () {
						var auto = function () {
							ctr.forward();
						}
						setInterval(auto, slideshow.settings.autoAdvanceSpeed);
					})();
				}
			})();
		});
	};
})(jQuery);