#TopShelf - Slideshow
A slideshow plugin for jQuery.

## Setup
###Add Scripts and CSS

    <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script src="js/ts-slideshow.js"></script>
    <link rel="stylesheet" href="css/style.css">

###Add some markup.
All required JavaScript hooks are data-ui attributes. You can override hte default styles by adding your own CSS classes to elements.

All navigation elements are optional.

    <div data-ui="slideshow">
        <div class="panels">
            <div data-ui="slideshow-panel">
                <p>
                    First Panel
                </p>
            </div>
            
            <div data-ui="slideshow-panel">
                <p>
                    Second Panel
                </p>
            </div>

            <div data-ui="slideshow-panel">
                <p>
                    Third Panel
                </p>
            </div>

            <div data-ui="slideshow-panel">
                <p>
                    Fourth Panel
                </p>
            </div>

            <div data-ui="slideshow-panel">
                <p>
                    Fifth Panel
                </p>
            </div>
        </div>

        <div class="nav">
            <a href="" data-ui="slideshow-back">&lsaquo;</a>
            <a href="" data-ui="slideshow-marker"></a>
            <a href="" data-ui="slideshow-marker"></a>
            <a href="" data-ui="slideshow-marker"></a>
            <a href="" data-ui="slideshow-marker"></a>
            <a href="" data-ui="slideshow-marker"></a>
            <a href="" data-ui="slideshow-forward">&rsaquo;</a>
        </div>
    </div>

###Hook it up

    <script>
        $(function(){
            $("[data-ui='slideshow']").tsSlideshow();
        });
    </script>

## Options
You can pass .tsSlideshow() some optional settings. The defaults are...

    $("[data-ui='slideshow']").tsSlideshow({
        "transition": "slide"
        , "transitionSpeed": 250
        , "autoAdvance": false
        , "autoAdvanceSpeed": 1000
        , "loop": true
    });

### transition
The type of transition to use. Values can be "slide" or "fade". I recommend having a look at the code, it's really easy to slot in custom transitions...

### transitionSpeed
The speed of the animation.

### autoAdvance
If set to true, the slideshow will automatically cycle through all panels.

### autoAdvanceSpeed
How long to stick around on each panel for if autoAdvance is set to true.

### loop
Make the last panel connect up with the first one.