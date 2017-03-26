
var  MIN_LENGTH     = 16,
     MAX_DEPTH      = 10,
     INITIAL_LENGTH = 250;
     INV_E          = 1/Math.E;
     PHI            = (1 + Math.sqrt(5)) / 2;
     THETA_NAUGHT   = Math.PI * PHI;

var ctx = this;
ctx._canvas  = document.getElementById('canvas');
ctx._context = canvas.getContext('2d');

function Point(x, y) {
    this.X = x;
    this.Y = y;
}

function drawFractal(ratioA, ratioB, alpha, beta, startPoint, size, maxDepth, lineColor) {

    function renderSegment(startPoint, r, theta, depth) {
        if (r < MIN_LENGTH || depth.v >= maxDepth) {
            return;
        }
        var endX = startPoint.X + r*Math.cos(theta),
            endY = startPoint.Y + r*Math.sin(theta);
        var endPoint = new Point(endX, endY);

        drawLineOnCanvas(startPoint, endPoint)

        if ( (r*ratioA >= MIN_LENGTH) && (r*ratioB >= MIN_LENGTH) ) {
            renderSegment(endPoint, r*ratioA, theta+alpha, {v: depth.v+1});
            renderSegment(endPoint, r*ratioB, theta+beta, {v: depth.v+1});
            renderSegment(endPoint, r*ratioB, theta-beta, {v: depth.v+1});
        }
    }

    function drawLineOnCanvas(startPoint, endPoint) {
        ctx._context.beginPath();
        ctx._context.moveTo(startPoint.X, startPoint.Y);
        ctx._context.lineTo(endPoint.X, endPoint.Y);
        ctx._context.lineWidth = 5;
        ctx._context.strokeStyle = lineColor;
        ctx._context.stroke();
    }

    renderSegment(startPoint, size, THETA_NAUGHT, {v: 0});
}

function updateControlValues(master, alpha, beta, ratioA, ratioB) {
    ctx._master  = master || Math.pow(document.getElementById('master_slider').value, INV_E);
    ctx._alpha   = alpha  || ctx._master *  Math.PI * document.getElementById('angle_a_slider').value;
    ctx._beta    = beta   || ctx._master * -Math.PI * document.getElementById('angle_b_slider').value;
    ctx._ratioA  = ratioA || ctx._master * document.getElementById('ratio_a_slider').value;
    ctx._ratioB  = ratioB || ctx._master * document.getElementById('ratio_b_slider').value;
}

function updateFractal() {
    ctx._canvas.height = window.innerHeight;
    ctx._canvas.width = window.innerWidth;
    ctx._context.clearRect(0, 0, ctx._canvas.width, ctx._canvas.height);

    var stemLength = ctx._master * INITIAL_LENGTH;
    var startPoint = new Point(0.20*ctx._canvas.width, 0.80*ctx._canvas.height);

    drawFractal(ctx._ratioA, ctx._ratioB, ctx._alpha, ctx._beta, startPoint, stemLength, MAX_DEPTH, '#222');
    drawFractal(ctx._ratioA, ctx._ratioB, ctx._alpha, ctx._beta, startPoint, stemLength, 2, '#003ca6');

    var demoPoint = new Point(0.75*ctx._canvas.width, 0.50*ctx._canvas.height);
    drawFractal(ctx._ratioA, ctx._ratioB, ctx._alpha, ctx._beta, demoPoint, 0.7*stemLength, 2, 'rgba(0,60,166,0.75)');
}

function onControlChange() {
    updateControlValues();
    updateFractal();
}

function animate(start, finish, duration, steps) {
    var stepDurationMs = Math.round(duration / steps);
    var proportion = start;
    var stepNumber = 0;

    var renderStep = function() {
        proportion = stepNumber * (finish - start) / steps
        document.getElementById('master_slider').value = proportion;
        if (stepNumber < steps) {
            animationHandle = setTimeout(renderStep, stepDurationMs);
        }
        updateControlValues();
        updateFractal();
        stepNumber += 1;
    };

    var animationHandle = setTimeout(renderStep, stepDurationMs);
}

