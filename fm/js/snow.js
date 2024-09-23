// snowflakes
// only activates during december -> early january


// controls activation
let snowflakes_enabled = false;

var snowflakes = [];

// Global variables to store our browser's window size
var browser_w;
var browser_h;

// Specify the number of snowflakes you want visible
let snowflakes_count = 40;

// Flag to reset the position of the snowflakes
var reset_position = false;

// accessibility
let animations = true;
if (settings.reduced_motion)
    animations = false;

// the beginning
function begin_snowflakes() {
    if (animations) {
        window.addEventListener("DOMContentLoaded", create_snowflakes, false);
        window.addEventListener("resize", call_reset, false);
    }
}


// snowflake object
function Snowflake(element, speed, x, y) {
    this.element = element;
    this.speed = speed;
    this.x = x;
    this.y = y;
    this.scale = 1.2;

    // motion
    this.counter = 0;
    this.sign = Math.random() < 0.5 ? 1 : -1;

    // display
    this.element.style.opacity = (.2 + Math.random()) / 3;
}

// move snowflake
Snowflake.prototype.update = function() {
    // advanced trigonometry (gigachad)
    this.counter += this.speed / 5000;
    this.x += this.sign * this.speed * Math.cos(this.counter) / 40;
    this.y += Math.sin(this.counter) / 40 + this.speed / 30;
    this.scale = .5 + Math.abs(10 * Math.cos(this.counter) / 20);

    // set position
    transform(Math.round(this.x), Math.round(this.y), this.scale, this.element);

    // out of bounds
    if (this.y > browser_h) {
        this.y = -50;
    }
}

// set position
function transform(x, y, scale, el) {
    el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}, ${scale})`;
}


// create snowflakes
function create_snowflakes() {
    var original_snowflake = document.querySelector(".snow");
    var snowflakes_cont = original_snowflake.parentNode;
    snowflakes_cont.style.display = "block";

    // get our browser's size
    browser_w = document.documentElement.clientWidth;
    browser_h = document.documentElement.clientHeight;

    // create each snowflake
    for (var i = 0; i < snowflakes_count; i++) {
        // clone template snowflake
        var clone_snowflake = original_snowflake.cloneNode(true);
        snowflakes_cont.appendChild(clone_snowflake);

        var initialx = get_pos(50, browser_w);
        var initialy = get_pos(50, browser_h);
        var speed = 5 + Math.random() * 40;

        // create object
        var em_snowflake = new Snowflake(clone_snowflake, speed, initialx, initialy);
        snowflakes.push(em_snowflake);
    }

    // remove template
    snowflakes_cont.removeChild(original_snowflake);

    move_snowflakes();
}

//
// Responsible for moving each snowflake by calling its update function
//
function move_snowflakes() {
    if (animations) {
        for (var i = 0; i < snowflakes.length; i++) {
            var snowflake = snowflakes[i];
            snowflake.update();
        }
    }

    // Reset the position of all the snowflakes to a new value
    if (reset_position) {
        browser_w = document.documentElement.clientWidth;
        browser_h = document.documentElement.clientHeight;

        for (var i = 0; i < snowflakes.length; i++) {
            var snowflake = snowflakes[i];

            snowflake.x = get_pos(50, browser_w);
            snowflake.y = get_pos(50, browser_h);
        }

        reset_position = false;
    }

    requestAnimationFrame(move_snowflakes);
}

// get position
function get_pos(offset, size) {
    return Math.round(-1 * offset + Math.random() * (size + 2 * offset));
}

// reset all positions
function call_reset(e) {
    reset_position = true;
}