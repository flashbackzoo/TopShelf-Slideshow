#TopShelf - Slideshow
A slideshow plugin for jQuery.

## Features
* Slide and fade transitions.
* Multiple slideshows on one page.
* Optional loop and auto advance.
* Model Control Binding structure for easy customization.

## Setup
###Add Scripts and CSS

    <script src="http://code.jquery.com/jquery-1.7.1.min.js"></script>
    <script src="js/ts-slideshow.js"></script>
    <link rel="stylesheet" href="css/style.css">

###Add some markup.
Elements require the class names shown below. The only exception is the outermost element, which can have any class or id you like. Navigation elements are optional, excluding the entire block, markers, or steps is fine.

    <div class="slideshow">
        <div class="panels">
            <div class="panel">
                <p>First Panel</p>
            </div>
            <div class="panel">
                <p>Second Panel</p>
            </div>
            <div class="panel">
                <p>Third Panel</p>
            </div>
            <div class="panel">
                <p>Fourth Panel</p>
            </div>
            <div class="panel">
                <p>Fifth Panel</p>
            </div>
        </div>
        <div class="nav">
            <a class="step prev" href="">&lsaquo;</a>
            <a class='marker' href=''></a>
            <a class='marker' href=''></a>
            <a class='marker' href=''></a>
            <a class='marker' href=''></a>
            <a class='marker' href=''></a>
            <a class="step next" href="">&rsaquo;</a>
        </div>
    </div>

###Hook it up

    <script>
        $(function(){
            $(".slideshow").tsSlideshow();
        });
    </script>

## Options
You can pass .tsSlideshow() some optional settings. The defaults are...

    $(".slideshow").tsSlideshow({
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