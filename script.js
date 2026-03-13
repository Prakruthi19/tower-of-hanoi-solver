const rods = [
    document.getElementById('rod-0'),
    document.getElementById('rod-1'),
    document.getElementById('rod-2')
];
const solveBtn = document.getElementById('solve-btn');
const resetBtn = document.getElementById('reset-btn');
const diskSlider = document.getElementById('disk-slider'); // <-- DEFINE FIRST
const diskDisplay = document.getElementById('disk-count-display');
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
const undoBtn = document.getElementById('undo-btn');
// 2. GLOBAL STATE
let moveCount = 0;
let delayTime = 400; 
let isSolving = false;
let gameHistory = []; 
let virtualRods = [[], [], []]; 

// 3. UTILITY FUNCTIONS
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 4. THE INITIALIZE FUNCTION (Must be defined before being called)
function initializeGame() {
    const diskCount = parseInt(diskSlider.value); // Now diskSlider is defined!
    diskDisplay.innerText = diskCount;
    
    const minMoves = Math.pow(2, diskCount) - 1;
    document.getElementById('min-moves').innerText = minMoves;

    moveCount = 0;
    gameHistory = []; 
    isSolving = false; 
    virtualRods = [[], [], []]; 
    document.getElementById('move-count').innerText = "0";

    const undoBtn = document.getElementById('undo-btn');
    if (undoBtn) {
        undoBtn.disabled = true;
        undoBtn.style.opacity = "0.5";
    }
    rods.forEach(rod => rod.innerHTML = '');

    for (let i = diskCount; i > 0; i--) {
        const disk = document.createElement('div');
        disk.classList.add('disk');
        disk.setAttribute('data-size', i);
        disk.setAttribute('draggable', 'true');
        disk.style.width = `${i * 20 + 40}px`;
        disk.style.backgroundColor = `hsl(${i * 45}, 70%, 50%)`;
        rods[0].appendChild(disk);
    }
    setupDraggableDisks(); 
}


// 5. EVENT LISTENERS
diskSlider.addEventListener('input', initializeGame);

speedSlider.addEventListener('input', (e) => {
    delayTime = 1050 - e.target.value; // Invert logic for "Fast/Slow"
});


async function moveDiskUI(fromRodIndex, toRodIndex) {
    const fromRod = rods[fromRodIndex];
    const toRod = rods[toRodIndex];
 
    
    const disk = fromRod.lastElementChild;
    
    if (disk) {
        moveCount++;
        document.getElementById('move-count').textContent = moveCount;
        toRod.appendChild(disk);
        disk.style.opacity = "0.5";
        await sleep(delayTime); 
        disk.style.opacity = "1";
    }
}


async function solveHanoi(n, from, to, aux) {
    if (n === 0 || !isSolving) return;
    
    await solveHanoi(n - 1, from, aux, to);
    if (!isSolving) return;
    await moveDiskUI(from, to);
    await sleep(delayTime / 2); 
    if (!isSolving) return;
    await solveHanoi(n - 1, aux, to, from);
}

solveBtn.addEventListener('click', async () => {
    isSolving = true; 
    undoBtn.disabled = true;
    undoBtn.style.opacity = "0.5";
    undoBtn.style.cursor = "not-allowed";
    solveBtn.disabled = true;
    
    const numberOfDisks = rods[0].childElementCount;
    moveCount = 0;
    document.getElementById('move-count').innerText = "0";
    
    await solveHanoi(numberOfDisks, 0, 2, 1);
    
    if (isSolving) {
        alert("Algorithm Complete!");
    }
    
    isSolving = false;
    solveBtn.disabled = false;
    if (gameHistory.length > 0) {
        undoBtn.disabled = false;
        undoBtn.style.opacity = "1";
        undoBtn.style.cursor = "pointer";
    }
});


let draggedDisk = null;
initializeGame();


function setupDraggableDisks() {
    const disks = document.querySelectorAll('.disk');
    const rodsElements = document.querySelectorAll('.rod');

    disks.forEach(disk => {
        disk.addEventListener('dragstart', (e) => {
                if (isSolving) {
                    e.preventDefault();
                    return false;
                }
            if (e.target !== e.target.parentElement.lastElementChild) {
                e.preventDefault();
                return;
            }
            draggedDisk = e.target;
            e.target.style.opacity = "0.5";
            e.target.classList.add('dragging');
        });

        disk.addEventListener('dragend', (e) => {
            e.target.style.opacity = "1";
            e.target.classList.remove('dragging');
            draggedDisk = null;
        });
    });

    rodsElements.forEach(rod => {
        rod.addEventListener('dragover', (e) => {
            e.preventDefault(); // Necessary to allow a drop
        });

        rod.addEventListener('drop', (e) => {
            e.preventDefault();
            if (!draggedDisk || isSolving) return;
            const fromRod = draggedDisk.parentElement;
            const targetRod = e.currentTarget;
            const fromIdx = parseInt(fromRod.id.split('-')[1]);
            const toIdx = parseInt(targetRod.id.split('-')[1]);
            const topDisk = targetRod.lastElementChild;
            const draggedSize = parseInt(draggedDisk.getAttribute('data-size'));
            const topDiskSize = topDisk ? parseInt(topDisk.getAttribute('data-size')) : Infinity;

            if (draggedSize < topDiskSize) {
                gameHistory.push({ from: fromIdx, to: toIdx });
                undoBtn.disabled = false;
                undoBtn.style.opacity = "1";

                virtualRods[fromIdx].pop();
                virtualRods[toIdx].push(draggedSize);

                targetRod.appendChild(draggedDisk);
  
                moveCount++;
                document.getElementById('move-count').innerText = moveCount;
                checkWin();
            } else {
             
                draggedDisk.style.animation = "shake 0.2s ease-in-out";
                setTimeout(() => draggedDisk.style.animation = "", 200);
            }
        });
    });
}

undoBtn.addEventListener('click', () => {
    if (isSolving || gameHistory.length === 0) return;

    const lastMove = gameHistory.pop();
    const disk = rods[lastMove.to].lastElementChild;

    rods[lastMove.from].appendChild(disk);

    const size = virtualRods[lastMove.to].pop();
    virtualRods[lastMove.from].push(size);

    moveCount--;
    document.getElementById('move-count').innerText = moveCount;
});
function checkWin() {
    const diskCount = parseInt(diskSlider.value);
    const targetRodIndex = 2; 
    console.log("Virtual Rods State:", diskCount, virtualRods);
    if (virtualRods[targetRodIndex].length === diskCount) {

        setTimeout(() => {
            const minMoves = Math.pow(2, diskCount) - 1;
            
            if (moveCount === minMoves) {
                alert(`Perfect! You solved it in the minimum ${moveCount} moves!`);
            } else {
                alert(`Congratulations! Solved in ${moveCount} moves. (Perfect score is ${minMoves})`);
            }
            gameHistory = []; 
        }, 300);
    }
}
speedSlider.addEventListener('input', (e) => {
    delayTime = 1050 - e.target.value; 
    if (delayTime < 200) speedDisplay.innerText = "Lightning";
    else if (delayTime < 400) speedDisplay.innerText = "Fast";
    else if (delayTime < 700) speedDisplay.innerText = "Normal";
    else speedDisplay.innerText = "Slow";
});
resetBtn.addEventListener('click', () => {
    isSolving = false; 
    gameHistory = []; 
    moveCount = 0;
    setTimeout(() => {
        initializeGame();
        solveBtn.disabled = false;
        const diskCount = parseInt(diskSlider.value);
        const minMoves = Math.pow(2, diskCount) - 1;
        document.getElementById('move-count').innerText = "0";
        document.getElementById('min-moves').innerText = minMoves;
    }, 50); 
});


