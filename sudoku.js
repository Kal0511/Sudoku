HTMLboardData = document.querySelectorAll(".board div")
menuOptions = document.querySelectorAll("#menu div")

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class pointData {
    constructor(htmlIndex) {
        this.index = transform(htmlIndex)
        this.x = indexToX(this.index)
        this.y = indexToY(this.index)
    }
}

let numEmpty = 81

let lookupTable = new Array(81)

for (let i = 0; i < 81; i++) {
    lookupTable[i] = new pointData(i)
}

// for (let i = 0; i < 81; i++) {
//     console.log(lookupTable[i])
// }

let menuOptionSelected = null
let selectedHTMLIndex = null
board = new Array(9 * 9)

for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
        board[i + j * 9] = null
    }
}


HTMLboardData.forEach((index, n) => {
    // index.innerHTML = board[n] || null;
    index.innerHTML = "<div></div>"

    // for(let i=0;i<9;i++){
    //     index.innerHTML += "<span class='bg-data " + String.fromCharCode(65+i) + "'>" + (i+1) + "</span>"
    // }

})
let boardData = document.querySelectorAll(".board div div")
console.log(boardData.length)
// for(let i=0;i<81;i++){
//     boardData.push(HTMLboardData[i])
// }

// function isValid(x, y, num) {
//     if (board[x + y * 9] != null) {
//         return false;
//     }
//     let i
//     for (i = 0; i < 9; i++) {
//         if (board[i + y * 9] === num && i !== x) {
//             return false;
//         }
//     }
//     for (i = 0; i < 9; i++) {
//         if (board[x + i * 9] === num && i !== y) {
//             return false;
//         }
//     }
//     let htmlCoord = transform(x + y * 9)
//     let start = htmlCoord - htmlCoord % 9
//     for (i = start; i < start + 9; i++) {
//         if (boardData[i].innerHTML === num.toString() && htmlCoord !== i) {
//             return false;
//         }
//     }
//     return true
// }

function isValid(htmlIndex, num) {
    let x = lookupTable[htmlIndex].x
    let y = lookupTable[htmlIndex].y
    if (board[x + y * 9] != null) {
        return false;
    }
    let i
    for (i = 0; i < 9; i++) {
        if (board[i + y * 9] === num && i !== x) {
            return false;
        }
    }
    for (i = 0; i < 9; i++) {
        if (board[x + i * 9] === num && i !== y) {
            return false;
        }
    }
    let start = htmlIndex - htmlIndex % 9
    for (i = start; i < start + 9; i++) {
        if (board[lookupTable[i].index] === num && i !== htmlIndex) {
            return false;
        }
    }
    return true
}

function generateSolution(i = 0, limit = 81) {
    if (limit === 0) {
        return true
    }
    if (i > 80) {
        i = 0
    }
    if (board[lookupTable[i].index] !== null) {
        return generateSolution(i + 1, limit - 1);
    }
    let start = Math.floor(Math.random() * 9) + 1;
    //let start = 1;
    for (let n = 0; n < 9; n++) {
        if (isValid(i, start)) {
            board[lookupTable[i].index] = start
            // boardData[i].innerHTML = start
            if (!generateSolution(i + 1, limit - 1)) {
                board[lookupTable[i].index] = null
                // boardData[i].innerHTML = null
            } else {
                place(i, start)
                return true
            }
        }
        start++
        if (start > 9) {
            start = 1
        }
    }
    return false
}

function hasMultipleSolutions(i = 0, limit = 81) {
    if (limit === 0) {
        return 1
    }
    if (board[lookupTable[i].index] !== null) {
        return hasMultipleSolutions(i + 1, limit - 1);
    }
    let numOfSolutions = 0
    for (let n = 1; n <= 9; n++) {
        if (isValid(i, n)) {
            board[lookupTable[i].index] = n
            if ((numOfSolutions += hasMultipleSolutions(i + 1, limit - 1)) > 1) {
                board[lookupTable[i].index] = null
                return numOfSolutions
            }
            board[lookupTable[i].index] = null
        }
    }
    return numOfSolutions
}


function generateProblem() {
    generateSolution()
    let limit = 0
    while (limit !== 50) {
        // await sleep(1)
        let randIndex = Math.floor(Math.random() * 81)
        //randIndex = limit
        //let temp = board[lookupTable[start[limit]].index]
        let temp = board[lookupTable[randIndex].index]
        // if(temp==null){
        //     limit++
        //     continue
        // }
        while ((temp = board[lookupTable[randIndex].index]) == null) {
            randIndex = Math.floor(Math.random() * 81)
        }
        remove(randIndex)
        if (hasMultipleSolutions() > 1) {
            place(randIndex, temp)
        } else {
            limit++
        }
    }
}

// generateProblem(1)

function solve() {
    document.getElementById("solve").disabled = true;
    document.getElementById("clearBoard").disabled = true;
    // await fill(Math.floor(Math.random() * 81), 81)
    generateSolution()
    document.getElementById("solve").disabled = false;
    document.getElementById("clearBoard").disabled = false;
}

function clearBoard() {
    document.getElementById("solve").disabled = true;
    document.getElementById("clearBoard").disabled = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            remove(i + j * 9)
        }
    }
    document.getElementById("solve").disabled = false;
    document.getElementById("clearBoard").disabled = false;
}

// function place(x, y, num) {
//     if (isValid(x, y, num)) {
//         board[x + y * 9] = num
//         boardData[transform(x + y * 9)].innerHTML = num
//         return true
//     } else {
//         return false;
//     }
// }

function place(htmlIndex, num) {
    board[lookupTable[htmlIndex].index] = num
    boardData[htmlIndex].innerHTML = num
}

function validPlace(htmlIndex, num) {
    if (isValid(htmlIndex, num)) {
        board[lookupTable[htmlIndex].index] = num
        boardData[htmlIndex].innerHTML = num
        return true
    } else {
        return false;
    }
}

// function remove(x, y) {
//     board[x + y * 9] = null
//     boardData[transform(x + y * 9)].innerHTML = null
// }

function remove(htmlIndex) {
    board[lookupTable[htmlIndex].index] = null
    boardData[htmlIndex].innerHTML = null
}

function transform(n) {
    let index = Math.floor(n / 9) % 3
    let sub = Math.floor((n % 9) / 3)
    if (index === 0) {
        if (sub === 1) {
            return n + 6
        } else if (sub === 2) {
            return n + 12
        } else {
            return n
        }
    } else if (index === 1) {
        if (sub === 0) {
            return n - 6
        } else if (sub === 2) {
            return n + 6
        } else {
            return n
        }
    } else if (index === 2) {
        if (sub === 0) {
            return n - 12
        } else if (sub === 1) {
            return n - 6
        } else {
            return n
        }
    }
}

function codeCoordsToHtmlIndex(x, y) {
    return transform(x + y * 9)
}

function indexToX(n) {
    return n % 9
}

function indexToY(n) {
    return Math.floor(n / 9)
}

function toIndex(x, y) {
    return x + y * 9
}

function getNumberFromKeyEvent(event) {
    if (event.keyCode >= 96 && event.keyCode <= 105) {
        return event.keyCode - 96;
    } else if (event.keyCode >= 48 && event.keyCode <= 57) {
        return event.keyCode - 48;
    }
    return null;
}

function toggleCross(htmlIndex, type, center = true) {
    if (center) {
        boardData[htmlIndex].classList=type
    }
    for (let i = 0; i < 9; i++) {
        if (lookupTable[htmlIndex].x !== i) {
            boardData[codeCoordsToHtmlIndex(i, lookupTable[htmlIndex].y)].classList='sub-' + type
        }
    }
    for (let j = 0; j < 9; j++) {
        if (lookupTable[htmlIndex].y !== j) {
            boardData[codeCoordsToHtmlIndex(lookupTable[htmlIndex].x, j)].classList  = 'sub-' + type
        }
    }
}

// function emptyCross(htmlIndex) {
//     boardData[htmlIndex].classList = ""
//     for (let i = 0; i < 9; i++) {
//         if (lookupTable[htmlIndex].x !== i) {
//             boardData[codeCoordsToHtmlIndex(i, lookupTable[htmlIndex].y)].classList = ""
//         }
//     }
//     for (let j = 0; j < 9; j++) {
//         if (lookupTable[htmlIndex].y !== j) {
//             boardData[codeCoordsToHtmlIndex(lookupTable[htmlIndex].x, j)].classList = ""
//         }
//     }
// }

boardData.forEach((index, htmlIndex) => {
    index.addEventListener("keyup", (e) => {
        console.log(e.keyCode, htmlIndex, index.innerHTML)
        e.preventDefault();
        e.stopPropagation()
        if (e.keyCode === 8 || e.keyCode === 46) {
            remove(htmlIndex)
            return
        }
        let num;
        if ((num = getNumberFromKeyEvent(e)) !== null) {
            if (isValid(htmlIndex, num)) {
                if (index.innerHTML !== null) {
                    remove(htmlIndex)
                    place(htmlIndex, num)
                } else {
                    place(htmlIndex, num)
                }
            }
            // console.log("t")
        } else {
            // console.log("not num")
        }
    })
    index.addEventListener("click", (e) => {
        e.stopPropagation()
        if (selectedHTMLIndex != null) {
            toggleCross(selectedHTMLIndex, "")
        }
        selectedHTMLIndex = htmlIndex
        toggleCross(htmlIndex, "selected", false)
        index.classList.toggle("selected")
        if (menuOptionSelected != null) {
            if (isValid(htmlIndex, parseInt(menuOptions[menuOptionSelected - 1].innerHTML))) {
                place(htmlIndex, parseInt(menuOptions[menuOptionSelected - 1].innerHTML))
                console.log(board)
            } else {
                toggleCross(htmlIndex, "red", false)
                index.classList.toggle("red")
                remove(htmlIndex)
            }
        }
    })
})

window.addEventListener("click", () => {
    if (selectedHTMLIndex != null) {
        toggleCross(selectedHTMLIndex, "")
        selectedHTMLIndex = null
    }
    if (menuOptionSelected != null) {
        menuOptions[menuOptionSelected - 1].classList.toggle("selected")
        menuOptionSelected = null
    }
})

menuOptions.forEach((index, n) => {
    index.addEventListener("click", (e) => {
        e.stopPropagation()
        if (menuOptionSelected != null) {
            menuOptions[menuOptionSelected - 1].classList.toggle("selected")
        }
        menuOptionSelected = n + 1
        index.classList.toggle("selected")
    })
})
