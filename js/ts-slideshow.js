(function ($) {
	$.fn.tsSlideshow = function (options) {
		// default settings
		var settings = $.extend({
			"transition": "horizontal"
			, "transitionSpeed": 250
			, "autoAdvance": false
			, "autoAdvanceSpeed": 1000
			, "loop": true
			, "scroll": false
		}, options);

		return this.each(function () {
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

			// horizontal slide transitions
			var horizontal = function () {
				var fx = {};
				var paddingRight = parseInt($(slideshow.container).css("padding-right"), 10)
					, paddingLeft = parseInt($(slideshow.container).css("padding-left"), 10);

				(function () {
					fx.tranOut = function (o) {
						var borderOffset = parseInt(o.outgoing.css("border-left-width"), 10) + parseInt(o.outgoing.css("border-right-width"), 10)
							, incomingHeight = $(o.incoming).outerHeight(true);

						if (incomingHeight > $(o.outgoing).height()) { // set wrapper height
							$(slideshow.panelsWrapper).css("height", incomingHeight);
						}

						o.outgoing.removeClass("current");

						if (o.direction === "forward") {
							$(o.outgoing).animate({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							}, slideshow.settings.transitionSpeed, function () {
								$(o.outgoing).hide();
							});
						} else {
							$(o.outgoing).animate({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							}, slideshow.settings.transitionSpeed, function () {
								$(o.outgoing).hide();
							});
						}
					};

					fx.tranIn = function (o) {
						var borderOffset = parseInt(o.incoming.css("border-left-width"), 10) + parseInt(o.incoming.css("border-right-width"), 10)
						, incomingHeight = $(o.incoming).outerHeight(true);

						$(o.incoming).show();

						$(o.incoming).animate({
							left: "50%"
							, marginLeft: "-" + ($(slideshow.panelsWrapper).width() / 2)
						}, slideshow.settings.transitionSpeed, function () { // position all previous and next panels
							$(o.incoming).prevAll().css({
								left: "-100%"
								, marginLeft: (paddingLeft + borderOffset) * -1
							});

							$(o.incoming).nextAll().css({
								left: "100%"
								, marginLeft: paddingRight + borderOffset
							});

							if (incomingHeight < $(o.outgoing).height()) { // set wrapper height
								$(slideshow.panelsWrapper).css("height", incomingHeight);
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

					fx.init = function () {
						var paddingRight = parseInt($(slideshow.container).css("padding-left"), 10)
							, borderOffset = parseInt($(slideshow.panels[0]).css("border-left-width"), 10) + parseInt($(slideshow.panels[0]).css("border-right-width"), 10);
						l = slideshow.panels.length;
						for (i = 1; i < l; i += 1) {
							$(slideshow.panels[i]).css({
								left: "100%"
								, marginLeft: paddingRight
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
						o.outgoing.removeClass("current");

						if (o.direction === "forward") { // up
							o.outgoing.animate({
								top: "-100%"
								, "margin-top": "-" + (o.incoming.outerHeight() / 2) + "px"
							}
								, slideshow.settings.transitionSpeed
								, function () {
									o.outgoing.hide();
								}
							);
						} else { // down
							o.outgoing.animate(
								{
									top: "100%"
									, "margin-top": (o.incoming.outerHeight() / 2) + "px"
								}
								, slideshow.settings.transitionSpeed
								, function () {
									o.outgoing.hide();
								}
							);
						}
					};

					fx.tranIn = function (o) {
						o.incoming.show();
						o.incoming.animate({
							top: "50%"
								, "margin-top": "-" + (o.incoming.outerHeight() / 2) + "px"
						}
							, slideshow.settings.transitionSpeed
							, function () {
								// position all previous panels
								o.incoming.prevAll().css({
									top: "-100%"
									, "margin-top": "-" + (o.incoming.outerHeight() / 2) + "px"
								});
								// position all next panels
								o.incoming.nextAll().css({
									top: "100%"
									, "margin-top": (o.incoming.outerHeight() / 2) + "px"
								});
								// set panels wrapper height
								if (o.incoming.outerHeight() < $(o.outgoing).height()) {
									$(slideshow.panelsWrapper).css("height", o.incoming.outerHeight());
								}
								o.incoming.addClass("current");
							}
						);
					};

					fx.restart = function (o) {
						if (o.direction === "forward") {
							$(o.incoming).css({
								top: "100%"
								, "margin-top": (o.incoming.outerHeight() / 2) + "px"
							});
						} else {
							$(o.incoming).css({
								top: "-100%"
								, "margin-top": "-" + (o.incoming.outerHeight() / 2) + "px"
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
				$(slideshow.panels).hide();
				$(slideshow.panels[0]).addClass("current").show();
				$(slideshow.markers[0]).addClass("current");
				$(slideshow.panelsWrapper).css("height", initHeight);
			})();
		});
	};
})(jQuery);