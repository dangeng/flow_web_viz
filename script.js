////////////////////////
/// HELPER FUNCTIONS ///
////////////////////////

/*
Function to load arrows (flow) from json
Should be of format:
    [
        [dx, dy], [dx, dy], [dx, dy] ...
        [dx, dy], [dx, dy], [dx, dy] ...
        [dx, dy], [dx, dy], [dx, dy] ...
        ...
    ]
    such that data[x][y] gives offsets in x and y dirs
*/
async function loadFlow(path) {
    try {
        console.log('Loading json from: ' + path)
        const response = await fetch(path);
        const flow = await response.json();
        return flow;
    } catch (error) {
        console.error("Error loading flow:", error);
        return [];
    }
}



/////////////////////////
/// DRAWING FUNCTIONS ///
/////////////////////////

// Draws an arrow on the canvas
// From: https://codepen.io/chanthy/pen/WxQoVG
function drawArrow(canvas, fromx, fromy, tox, toy, arrowWidth, color){
    // Get canvas context
    ctx = canvas.getContext("2d");

    //variables to be used when creating the arrow
    var headlen = 10;
    var angle = Math.atan2(toy-fromy,tox-fromx);
 
    ctx.save();
    ctx.strokeStyle = color;
 
    //starting path of the arrow from the start square to the end square
    //and drawing the stroke
    ctx.beginPath();
    ctx.moveTo(fromx, fromy);
    ctx.lineTo(tox, toy);
    ctx.lineWidth = arrowWidth;
    ctx.stroke();
 
    //starting a new path from the head of the arrow to one of the sides of
    //the point
    ctx.beginPath();
    ctx.moveTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //path from the side point of the arrow, to the other side point
    ctx.lineTo(tox-headlen*Math.cos(angle+Math.PI/7),
               toy-headlen*Math.sin(angle+Math.PI/7));
 
    //path from the side point back to the tip of the arrow, and then
    //again to the opposite side point
    ctx.lineTo(tox, toy);
    ctx.lineTo(tox-headlen*Math.cos(angle-Math.PI/7),
               toy-headlen*Math.sin(angle-Math.PI/7));
 
    //draws the paths created above
    ctx.stroke();
    ctx.restore();
}

// Clears the canvas
function clearCanvas(canvas) {
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

/*
Given:
    - a (mouseover) event
    - a canvas
    - an array of displacements (see `loadFlow` function)

Draw:
    - an arrow on the image
*/
function draw(event, canvas, flow) {
    // Get current size of the canvas (just use 'src' canvas)
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Get mouse/touch location
    // Check if it's a touch event
    if (event.touches && event.touches.length > 0) {
        x = event.touches[0].clientX;
        y = event.touches[0].clientY;
    } else {
        // It's a mouse event
        x = event.clientX;
        y = event.clientY;
    }

    // Get mouse location, relative to event canvas
    var rect = canvas.getBoundingClientRect();
    const mouseX = Math.round(
                (x - rect.left) * (canvasWidth / rect.width)
            );
    const mouseY = Math.round(
                (y - rect.top) * (canvasHeight / rect.height)
            );

    // Get size of arrow
    const arrowSize = flow[mouseY][mouseX];

    // Get end point of arrow
    const arrowX = mouseX + arrowSize[0];
    const arrowY = mouseY + arrowSize[1];

    // Clear canvases
    clearCanvas(canvas);

    // Draw arrows canvas only if arrow is non-zero
    if (arrowSize[0] != 0 || arrowSize[1] != 0) {
        drawArrow(
            canvas, 
            mouseX, mouseY, 
            arrowX, arrowY, 
            5, 'black'
        );
    }
}



///////////////////////
/// SETUP FUNCTIONS ///
///////////////////////

/*
Sets up mouseleave and mousemove listeners for a
canvas and a given array of displacements (flow)
*/
function setupEventListeners(canvas, flow) {
    // Bind `canvas` and `direction` to 
    // draw function for mousemove event
    function drawPartial(event) {
        draw(event, canvas, flow);
    }

    // Clear all canvases on mouseleave event
    function handleMouseLeave(event) {
        clearCanvas(canvas);
    }

    // Add listeners
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousemove", drawPartial);

    // Add listeners for touch (mobile)
    canvas.addEventListener('touchmove', function (e) {
        // Prevent default to avoid unwanted behavior like scrolling
        e.preventDefault();
        drawPartial(e);
    });
}


/*
Initializes a given canvas:
    1. Loads the json displacement data
    2. Waits for loading to finish, then adds event listeners to canvases
*/
function initializeExample(canvas) {
    console.log('initializing canvas pair');

    // Get path to json with flow info
    const jsonPath = canvas.dataset.jsonPath;

    // Load json, and then set up event listeners
    loadFlow(jsonPath).then(flow => {
        setupEventListeners(canvas, flow);
    });
}

// Initialize all canvases
function initializeExamples() {
    var canvases = document.querySelectorAll('canvas.viz');
    canvases.forEach(function (canvas) {
        initializeExample(canvas);
    });
}

// Initialize all canvases on DOM loaded
document.addEventListener("DOMContentLoaded", initializeExamples);


