// Function to draw shapes in selection canvases
function drawShapeSelection() {
    // Draw line in lineCanvas
    var lineCanvas = document.getElementById('lineCanvas');
    var lineContext = lineCanvas.getContext('2d');
    lineContext.beginPath();
    lineContext.moveTo(5, 15);
    lineContext.lineTo(25, 15);
    lineContext.stroke();

    // Draw rectangle in rectCanvas
    var rectCanvas = document.getElementById('rectCanvas');
    var rectContext = rectCanvas.getContext('2d');
    rectContext.beginPath();
    rectContext.rect(5, 5, 20, 20);
    rectContext.stroke();

    // Draw circle in circleCanvas
    var circleCanvas = document.getElementById('circleCanvas');
    var circleContext = circleCanvas.getContext('2d');
    circleContext.beginPath();
    circleContext.arc(15, 15, 10, 0, 2 * Math.PI);
    circleContext.stroke();

    // Draw pencil in pencilCanvas
    var pencilCanvas = document.getElementById('pencilCanvas');
    var pencilContext = pencilCanvas.getContext('2d');
    pencilContext.beginPath();
    pencilContext.moveTo(5, 25);
    pencilContext.lineTo(25, 5);
    pencilContext.stroke();
}

// Function to draw the shape preview
function drawShapePreview() {
    var previewCanvas = document.getElementById('shapePreviewCanvas');
    var previewContext = previewCanvas.getContext('2d');
    previewContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    previewContext.strokeStyle = document.getElementById('color').value;
    previewContext.lineWidth = 5;
    previewContext.lineCap = 'round';
    
    previewContext.beginPath();
    if (shape === 'line') {
        previewContext.moveTo(10, 25);
        previewContext.lineTo(40, 25);
    } else if (shape === 'rectangle') {
        previewContext.rect(10, 10, 30, 30);
    } else if (shape === 'circle') {
        previewContext.arc(25, 25, 15, 0, 2 * Math.PI);
    } else if (shape === 'pencil') {
        previewContext.moveTo(10, 40);
        previewContext.lineTo(40, 10);
    }
    previewContext.stroke();
}

// Call the function to draw shapes in the selection canvases
drawShapeSelection();

// Initial call to draw the shape preview
drawShapePreview();

var canvas = document.getElementById('paintCanvas');
var context = canvas.getContext('2d');
var shapes = [];

var isDrawing = false;
var currentX = 0;
var currentY = 0;
var shape = 'line';

function draw(e) {
    if (!isDrawing) return;
    if (shape !== 'pencil') redraw(); // Відображення всіх фігур тільки якщо не малюється олівець
    context.beginPath();
    context.lineWidth = 5;
    context.lineCap = 'round';
    context.strokeStyle = document.getElementById('color').value;

    if (shape === 'line') {
        context.moveTo(currentX, currentY);
        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    } else if (shape === 'rectangle') {
        var width = e.clientX - canvas.offsetLeft - currentX;
        var height = e.clientY - canvas.offsetTop - currentY;
        context.rect(currentX, currentY, width, height);
    } else if (shape === 'circle') {
        var radius = Math.sqrt(Math.pow(e.clientX - canvas.offsetLeft - currentX, 2) + Math.pow(e.clientY - canvas.offsetTop - currentY, 2));
        context.arc(currentX, currentY, radius, 0, 2 * Math.PI);
    } else if (shape === 'pencil') {
        context.moveTo(currentX, currentY);
        context.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        currentX = e.clientX - canvas.offsetLeft;
        currentY = e.clientY - canvas.offsetTop;
        shapes[shapes.length - 1].points.push({x: currentX, y: currentY}); // Add points for pencil
    }
    
    context.stroke();
}

function redraw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(function(shape) {
        context.beginPath();
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.strokeStyle = shape.color;
        
        if (shape.type === 'line') {
            context.moveTo(shape.startX, shape.startY);
            context.lineTo(shape.endX, shape.endY);
        } else if (shape.type === 'rectangle') {
            context.rect(shape.startX, shape.startY, shape.width, shape.height);
        } else if (shape.type === 'circle') {
            context.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
        } else if (shape.type === 'pencil') {
            context.moveTo(shape.startX, shape.startY);
            for (var i = 0; i < shape.points.length; i++) {
                context.lineTo(shape.points[i].x, shape.points[i].y);
            }
            context.lineTo(shape.endX, shape.endY);
        }
        
        context.stroke();
    });
}

// Обробник руху миші
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('mousedown', function(e) {
    isDrawing = true;
    currentX = e.offsetX ;
    currentY = e.offsetY ;

    if (shape === 'pencil') {
        shapes.push({
            type: shape,
            startX: currentX,
            startY: currentY,
            points: [],
            color: document.getElementById('color').value
        });
    }
});

canvas.addEventListener('mouseup', function(e) {
    isDrawing = false;
    if (shape !== 'pencil') {
        shapes.push({
            type: shape,
            startX: currentX,
            startY: currentY,
            endX: e.clientX - canvas.offsetLeft,
            endY: e.clientY - canvas.offsetTop,
            width: e.clientX - canvas.offsetLeft - currentX,
            height: e.clientY - canvas.offsetTop - currentY,
            radius: Math.sqrt(Math.pow(e.clientX - canvas.offsetLeft - currentX, 2) + Math.pow(e.clientY - canvas.offsetTop - currentY, 2)),
            centerX: currentX,
            centerY: currentY,
            color: document.getElementById('color').value
        });
    } else {
        shapes[shapes.length - 1].endX = e.clientX - canvas.offsetLeft;
        shapes[shapes.length - 1].endY = e.clientY - canvas.offsetTop;
    }
    drawShapePreview(); // Update the shape preview after drawing
});

function clearCanvas() {
    shapes = [];
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// Обробник події для вибору фігури з панелі вибору фігур
document.getElementById('shapes').addEventListener('change', function() {
    shape = this.value;
    document.querySelectorAll('.figure').forEach(f => f.classList.remove('selected'));
    document.querySelector(`.figure[data-shape="${shape}"]`).classList.add('selected');
    drawShapePreview(); // Update the shape preview when shape changes
});

document.querySelectorAll('.figure').forEach(function(figure) {
    figure.addEventListener('click', function() {
        shape = this.getAttribute('data-shape');
        document.querySelectorAll('.figure').forEach(f => f.classList.remove('selected'));
        this.classList.add('selected');
        drawShapePreview(); // Update the shape preview when shape changes

        // Display the selected shape name
        var shapeNameContainer = document.getElementById('selectedShapeName');
        shapeNameContainer.textContent = shape.charAt(0).toUpperCase() + shape.slice(1); // Capitalize first letter
    });
});

document.getElementById('color').addEventListener('input', drawShapePreview); // Update the shape preview when color changes