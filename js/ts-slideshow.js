// TopShelf - Slideshow ~ Copyright (c) 2011 - 2012 David Craig, http://flashbackzoo.net
// Released under MIT license, http://www.opensource.org/licenses/mit-license.php
(function ($) {
	$.fn.tsSlideshow = function (options) {
		// default settings
		var settings = $.extend({
			"transition": "horizontal"
			, "transitionSpeed": 250
			, "autoAdvance": false
			, "autoAdvanceSpeed": 1000
			, "loop": false
			, "scroll": false
		}, options);

		return this.each(function () {
			var slideshow = {
				container: this
				, settings: settings
				, panelsWrapper: getParts($(this).find("[data-ui='slideshow-panelsWrapper']"), this)
				, panels: getParts($(this).find("[data-ui='slideshow-panel']"), this)
				, markers: getParts($(this).find("[data-ui='slideshow-marker']"), this)
				, backButtons: getParts($(this).find("[data-ui='slideshow-back']"), this)
				, forwardButtons: getParts($(this).find("[data-ui='slideshow-forward']"), this)
			};
			
			function getParts (els, context) {
				var i = 0
					, l = els.length
					, parts = [];
				
				for (i = 0; i < l; i += 1 ) {
					if ($(els[i]).closest("[data-ui='slideshow']")[0] === context) {
						parts[parts.length] = els[i];
					}
				}
				
				return parts;
			}

			////////////
			// MODELS //
			////////////

			// horizontal slide transitions
			var horizontal = function () {
				var fx = {};

				(function () {
					fx.tranOut = function (o) {
						// set wrapper height
						if ($(o.incoming).outerHeight() > $(o.outgoing).outerHeight()) {
							$(slideshow.panelsWrapper).css("height", $(o.incoming).outerHeight());
						}

						$(o.outgoing).removeClass("current");

						if (o.direction === "forward") {
							$(o.outgoing).animate({
									left: "-100%"
									, "margin-left": 0
								}, slideshow.settings.transitionSpeed
							);
						} else {
							$(o.outgoing).animate({
									left: "100%"
									, "margin-left": 0
								}, slideshow.settings.transitionSpeed
							);
						}
					};

					fx.tranIn = function (o) {
						$(o.incoming).animate({
							left: "50%"
							, "margin-left": "-" + ($(o.incoming).outerWidth() / 2) + "px"
						}, slideshow.settings.transitionSpeed, function () {
							// position all previous and next panels
							$(o.incoming).prevAll().css({
								left: "-100%"
							});
							$(o.incoming).nextAll().css({
								left: "100%"
							});
							// set wrapper height
							if ($(o.incoming).outerHeight() < $(o.outgoing).outerHeight()) {
								$(slideshow.panelsWrapper).css("height", $(o.incoming).outerHeight());
							}

							$(o.incoming).addClass("current");
						});
					};

					fx.restart = function (o) {
						if (o.direction === "forward") {
							$(o.incoming).css({
								left: "100%"
							});
						} else {
							$(o.incoming).css({
								left: "-100%"
							});
						}
					};

					fx.init = function () {
						var i = 0
							, l = slideshow.panels.length;
						
						$(slideshow.panels[0]).css({
							left: "50%"
							, "margin-left": "-" + ($(slideshow.panels[0]).outerWidth() / 2) + "px"
						});

						for (i = 1; i < l; i += 1) {
							$(slideshow.panels[i]).css({
								left: "100%"
							});
						}
					};
				})();
				return fx;
			};

			// vertical slide transitions
			var vertical = function () {
				var fx = {};

				(function () {
					fx.tranOut = function (o) {
						$(o.outgoing).removeClass("current");

						if (o.direction === "forward") { // up
							$(o.outgoing).animate({
									top: "-100%"
									, "margin-top": 0
								}
								, slideshow.settings.transitionSpeed
							);
						} else { // down
							$(o.outgoing).animate({
									top: "100%"
									, "margin-top": 0
								}
								, slideshow.settings.transitionSpeed
							);
						}
					};

					fx.tranIn = function (o) {
						$(o.incoming).animate({
								top: "50%"
								, "margin-top": "-" + ($(o.incoming).outerHeight() / 2) + "px"
							}
							, slideshow.settings.transitionSpeed
							, function () {
								// position all previous panels
								$(o.incoming).prevAll().css({
									top: "-100%"
								});
								// position all next panels
								$(o.incoming).nextAll().css({
									top: "100%"
								});
								// set panels wrapper height
								if ($(o.incoming).outerHeight() < $(o.outgoing).outerHeight()) {
									$(slideshow.panelsWrapper).css("height", $(o.incoming).outerHeight());
								}
								$(o.incoming).addClass("current");
							}
						);
					};

					fx.restart = function (o) {
						if (o.direction === "forward") {
							$(o.incoming).css({
								top: "100%"
								, "margin-top": ($(o.incoming).outerHeight() / 2) + "px"
							});
						} else {
							$(o.incoming).css({
								top: "-100%"
								, "margin-top": "-" + ($(o.incoming).outerHeight() / 2) + "px"
							});
						}
					};

					fx.init = function () {
						var i = 0
							, l = slideshow.panels.length;

						for (i = 1; i < l; i += 1) {
							$(slideshow.panels[i]).css({
								top: "100%"
							});
						}
					};
				})();
				return fx;
			};

			// fade transitions
			var fade = function () {
				var fx = {};
				(function () {
					fx.tranIn = function (o) {
						var incomingHeight = $(o.incoming).outerHeight(true);

						$(o.incoming).fadeIn(slideshow.settings.transitionSpeed, function () {
							$(o.incoming).addClass("current");
						});

						if (incomingHeight < $(o.outgoing).height()) { // set wrapper height
							$(slideshow.panelsWrapper).css("height", incomingHeight);
						}
					};

					fx.tranOut = function (o) {
						var incomingHeight = $(o.incoming).outerHeight(true);

						if (incomingHeight > $(o.outgoing).height()) { // set wrapper height
							$(slideshow.panelsWrapper).css("height", incomingHeight);
						}

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

			var controls = function (fx) {
				var ctr = {};
				(function () {
					ctr.step = function (direction) {
						var o = {};
						var pos = "";
						o.outgoing = getParts($(slideshow.container).find("[data-ui='slideshow-panel'].current"), slideshow.container);

						if (o.outgoing.length) { // make sure transition has finished before starting another one
							if (direction === "back") {
								o.incoming = getParts($(slideshow.container).find("[data-ui='slideshow-panel'].current").prev(), slideshow.container)
								, o.direction = "back";
							} else {
								o.incoming = getParts($(slideshow.container).find("[data-ui='slideshow-panel'].current").next(), slideshow.container)
								, o.direction = "forward";
							}
							if (o.incoming.length) { // make sure there is a panel to transition in
								pos = $(slideshow.panels).index(o.incoming[0]);
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
								} catch (err) { }

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
					};

					ctr.jumpTo = function (p) {
						var o = {};
						o.outgoing = getParts($(slideshow.container).find("[data-ui='slideshow-panel'].current"), slideshow.container)
								, o.incoming = $(p)
								, o.direction = "back";

						var i = 0
							, nextPanels = $(o.outgoing).nextAll()
							, l = nextPanels.length
							, pos = $(slideshow.panels).index(o.incoming);

						if (o.outgoing.length) { // make sure transition has finished before starting another one
							for (i = 0; i < l; i += 1) {
								if (nextPanels[i] === o.incoming[0]) {
									o.direction = "forward";
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
			};

			////////////
			// EVENTS //
			////////////

			var events = function (ctr) {
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

					evt.scroll = function () {
						$(slideshow.container).bind("mousewheel", function (e) {
							if (e.originalEvent.wheelDelta < 0) {
								e.preventDefault();
								ctr.step("forward");
							} else {
								e.preventDefault();
								ctr.step("back");
							}
						});
					};
				})();
				return evt;
			};

			//////////////
			// LIFT OFF //
			//////////////

			(function () {
				switch (slideshow.settings.transition) {
					case "fade":
						var fx = fade(slideshow);
						break;
					case "vertical":
						var fx = vertical(slideshow);
						break;
					default:
						var fx = horizontal(slideshow);
						break;
				}

				var ctr = controls(fx);
				var evt = events(ctr);

				var initHeight = $(slideshow.panels[0]).outerHeight(true);

				// bind events
				evt.steps();
				evt.markers();
				if (slideshow.settings.scroll === true) {
					evt.scroll();
				}

				fx.init();

				// auto advance
				if (slideshow.settings.autoAdvance === true) {
					(function () {
						var auto = function () {
							ctr.step("forward");
						};
						setInterval(auto, slideshow.settings.autoAdvanceSpeed);
					})();
				}

				// set initial state
				$(slideshow.panels[0]).addClass("current");
				$(slideshow.markers[0]).addClass("current");
				$(slideshow.panelsWrapper).css("height", initHeight);
			})();
		});
	};
})(jQuery);