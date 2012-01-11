#TopShelf - Slideshow
The Slideshow plugin for jQuery.

## Setup
###Add the dependencies

    <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script src="js/ts-slideshow.js"></script>
    <link rel="stylesheet" href="css/style.css">

###Add some markup.
We use custom data attributes for JavaScript hooks. CSS classes are used purely for skinning.

This seperation makes your CSS more manageable and creating new skins easy.

    <div class="slideshow" data-ui="slideshow">
        <div class="panels" data-ui="panelsWrapper">
            <div class="panel" data-ui="slideshow-panel">
                <p>
                    First Panel
                </p>
            </div>
            
            <div class="panel" data-ui="slideshow-panel">
                <p>
                    Second Panel
                </p>
            </div>

            <div class="panel" data-ui="slideshow-panel">
                <p>
                    Third Panel
                </p>
            </div>

            <div class="panel" data-ui="slideshow-panel">
                <p>
                    Fourth Panel
                </p>
            </div>

            <div class="panel" data-ui="slideshow-panel">
                <p>
                    Fifth Panel
                </p>
            </div>
        </div>

        <!--
        	Optional navigation.
        	Include / exclude these elements as you like.
        -->

        <div class="nav">
            <a class="step back" href="" data-ui="slideshow-back">&lsaquo;</a>
            <a class="marker" href="" data-ui="slideshow-marker"></a>
            <a class="marker" href="" data-ui="slideshow-marker"></a>
            <a class="marker" href="" data-ui="slideshow-marker"></a>
            <a class="marker" href="" data-ui="slideshow-marker"></a>
            <a class="marker" href="" data-ui="slideshow-marker"></a>
            <a class="step forward" href="" data-ui="slideshow-forward">&rsaquo;</a>
        </div>
    </div>

###Hook it up
Turn your markup into a Slideshow. Add this script directly before your closing body tag.

    <script>
        $(function(){
            $("[data-ui='slideshow']").tsSlideshow();
        });
    </script>

## Options
You can pass .tsSlideshow() some optional settings. Here are the defaults...

    $("[data-ui='slideshow']").tsSlideshow({
        "transition": "slide"
        , "transitionSpeed": 250
        , "autoAdvance": false
        , "autoAdvanceSpeed": 1000
        , "loop": true
    });

### transition
The type of transition to use. Values can be "slide" or "fade".

### transitionSpeed
The speed of the transition animation.

### autoAdvance
If set to true, the Slideshow will automatically cycle through all panels.

### autoAdvanceSpeed
How long to stay on each panel before advancing.

### loop
Make the last panel connect up with the first one.

## Demo
[http://flashbackzoo.github.com/TopShelf-Slideshow/](http://flashbackzoo.github.com/TopShelf-Slideshow/)