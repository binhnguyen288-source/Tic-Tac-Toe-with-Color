

function checkWin(x) {
    return [448, 56, 7, 292, 146, 73, 273, 84].some(val => (x & val) == val);
}

function negamax(x, o) {
    let best = -1;
    const empty = 511 & ~(x | o);
    if (checkWin(o)) return -1;
    if (empty == 0) return 0;
    for (let i = 0; i < 9; ++i) {
        if ((empty >> i) & 1) {
            best = Math.max(best, -negamax(o, x ^ (1 << i)));
        }
    }
    return best;
}

function getBestMove(x, o) {

    let best_move = 9;
    let best = -2;

    const empty = 511 & ~(x | o);

    

    if (empty == 0) {
        return [-2, 0];
    }

    for (let i = 0; i < 9; ++i) {
        if ((empty >> i) & 1) {
            const score = -negamax(o, x ^ (1 << i));
            if (score > best) {
                best = score;
                best_move = i;
            }
        }
    }

    if (checkWin(x ^ (1 << best_move))) return [2, best_move];


    return [best, best_move];
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const n_cell = 3;
const size = Math.min(window.innerWidth, window.innerHeight) * 0.75 / n_cell;
canvas.width = size * n_cell + 1;
canvas.height = size * n_cell + 1;

var marked = [];
var O = 0, X = 0;
var endgame = false;

function drawO(i, j)
{
    ctx.beginPath();
    ctx.strokeStyle = "#0000FF";
    ctx.lineWidth = 5;
    ctx.arc(j * size + size / 2, i * size + size / 2, size / 3, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawX(i, j)
{
    ctx.beginPath();
    ctx.strokeStyle = "#FF0000";
    ctx.lineWidth = 4;
    ctx.moveTo(j * size + size / 6, i * size + size / 6);
    ctx.lineTo(j * size + 5 * size / 6, i * size + 5 * size / 6);
    ctx.moveTo(j * size + 5 * size / 6, i * size + size / 6);
    ctx.lineTo(j * size + size / 6, i * size + 5 * size / 6);
    ctx.stroke();
}


function drawBoard()
{
    endgame = false;
    
    marked = [];
    for (let i = 0; i < n_cell * n_cell; ++i)
        marked.push(false);
    
    X = O = 0;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.strokeStyle = "#add8e6";
    
    ctx.lineWidth = 4;

    for (let i = 0; i <= n_cell; ++i)
    {
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, n_cell * size);
        ctx.moveTo(0, i * size);
        ctx.lineTo(n_cell * size, i * size);
    }
    
    ctx.stroke();
    
}

document.getElementById('reset').addEventListener('click', () => drawBoard());

canvas.addEventListener('click', (ev) => 
{
    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var p =  {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
        return p;
    }
    const p = getMousePos(ev);
    const i = Math.floor(p.y / size);
    const j = Math.floor(p.x / size);
    const idx = i * n_cell + j;
    if (!endgame && i >= 0 && j >= 0 && i < n_cell && j < n_cell && !marked[idx]) {
        marked[idx] = true;
        drawX(i, j);
        X |= 1 << idx;
        setTimeout(() => {
            //const output = Module.ccall('getMove', 'string', ['number'], [idx]);
            // if (output === "") {
            //     endgame = true;
            //     alert('You win :(');
            //     return;
            // }
            const [v, move] = getBestMove(O, X);
            
            if (v === -2) {
                endgame = true;
                alert('Draw');
                return;
            }
            
            O |= 1 << move;
            marked[move] = true;
            drawO(Math.floor(move / n_cell), move % n_cell);
            if (v === 2) {
                endgame = true;
                alert('You lose :)');
            }
        });
    }
    else alert('invalid move');
});



drawBoard();
