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
				, panelsWrapper: $(this).find("[data-ui='slideshow-panelsWrapper']")
				, panels: $(this).find("[data-ui='slideshow-panel']")
				, markers: $(this).find("[data-ui='slideshow-marker']")
				, backButtons: $(this).find("[data-ui='slideshow-back']")
				, forwardButtons: $(this).find("[data-ui='slideshow-forward']")
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
						var borderOffset = parseInt(o.outgoing.css("border-left-width"), 10) + parseInt(o.outgoing.css("border-right-width"), 10)
							, incomingHeight = $(o.incoming).outerHeight();
						
						if (incomingHeight > $(o.outgoing).height()) { // set wrapper height
							$(slideshow.container).css("height", incomingHeight);
							$(slideshow.panelsWrapper).css("height", incomingHeight);
						}
						
						o.outgoing.removeClass("current");
						
						if (o.direction === "forward") {
							$(o.outgoing).animate({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							}, slideshow.settings.transitionSpeed, function() {
								$(o.outgoing).hide();
							});
						} else {
							$(o.outgoing).animate({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							}, slideshow.settings.transitionSpeed, function() {
								$(o.outgoing).hide();
							});
						}
					};
					
					fx.tranIn = function(o) {
						var borderOffset = parseInt(o.incoming.css("border-left-width"), 10) + parseInt(o.incoming.css("border-right-width"), 10)
						, incomingHeight = $(o.incoming).outerHeight();
						
						$(o.incoming).show();
						
						$(o.incoming).animate({
							left: "50%"
							, marginLeft: "-" + ($(slideshow.panelsWrapper).width() / 2)
						}, slideshow.settings.transitionSpeed, function () {
							$(o.incoming).prevAll().css({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							});
							
							$(o.incoming).nextAll().css({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							});
							
							if (incomingHeight < $(o.outgoing).height()) { // set wrapper height
								$(slideshow.container).css("height", incomingHeight);
								$(slideshow.panelsWrapper).css("height", incomingHeight);
								console.dir(slideshow.container);
							}
							
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
					ctr.step = function (direction) {
						var o = {};
						var pos = "";
						o.outgoing = $(slideshow.container).find("[data-ui='slideshow-panel'].current");
						
						if (o.outgoing.length) { // make sure transition has finished before starting another one
							if (direction === "back") {
								o.incoming = $(slideshow.container).find("[data-ui='slideshow-panel'].current").prev()
								, o.direction = "back";
							} else {
								o.incoming = $(slideshow.container).find("[data-ui='slideshow-panel'].current").next()
								, o.direction = "forward";
							}
							
							if (o.incoming.length) { // make sure there is a panel to transition in
								pos = $(slideshow.panels).index(o.incoming);
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								$(slideshow.markers[pos]).addClass("current");
							} else if (slideshow.settings.loop === true) { // if there is no incoming panel but 'loop' in enabled
								if (direction === "back") {
									prevMarker = $(slideshow.markers[slideshow.markers.length - 1]);
									o.incoming = $(slideshow.panels[slideshow.panels.length - 1]);
								} else {
									nextMarker = $(slideshow.markers[0]);
									o.incoming = $(slideshow.panels[0]);
								}
								
								try { // transition model may require a restart method when looping
									fx.restart(o);
								} catch (err) {}
								
								fx.tranOut(o);
								fx.tranIn(o);
								$(slideshow.markers).removeClass("current");
								
								if (direction === "back") {
									$(prevMarker).addClass("current");
								} else {
									$(slideshow.markers[0]).addClass("current");
								}
							}
						}
					}
					
					ctr.jumpTo = function (p) {
						var o = {}
						o.outgoing = $(slideshow.container).find("[data-ui='slideshow-panel'].current")
						, o.incoming = $(p)
						, o.direction = "back";
						
						var i = 0
							, nextPanels = o.outgoing.nextAll()
							, l = nextPanels.length
							, pos = $(slideshow.panels).index(o.incoming);
							
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
					
					evt.steps = function () { // previous and next
						$(slideshow.backButtons).bind("click", function (e) {
							e.preventDefault();
							ctr.step("back");
						});
						$(slideshow.forwardButtons).bind("click", function (e) {
							e.preventDefault();
							ctr.step("forward");
						});
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
				
				$(slideshow.panels).hide();
				$(slideshow.panels[0]).addClass("current").show();
				$(slideshow.markers[0]).addClass("current");
				
				$(slideshow.container).css("height", $(slideshow.panels[0]).outerHeight());
				$(slideshow.panelsWrapper).css("height", $(slideshow.panels[0]).outerHeight());
				
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