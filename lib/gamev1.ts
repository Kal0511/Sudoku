export class Cell {
    public data: number;
    public validityIndex: Array<boolean>;
    public validIndexList: Set<number>;

    constructor() {
        this.data = 0
        this.validityIndex = new Array<boolean>()
        for (let n = 0; n < 9; n++) {
            this.validityIndex.push(true)
        }
        this.validIndexList = new Set<number>()
        for (let n = 1; n <= 9; n++) {
            this.validIndexList.add(n)
        }
    }
}

export function newBoard(): Cell[] {
    let board = []
    for (let i = 0; i < 81; i++) {
        board.push(new Cell())
    }
    // console.log(board[80].validIndexList.values())
    return board
}


export function placeNumber(board: Cell[], x: number, y: number, num: number): void {
    board[x + y * 9].data = num
    for (let i = 0; i < 9; i++) {
        board[i + y * 9].validityIndex[num - 1] = false
        board[i + y * 9].validIndexList.delete(num)
    }
    for (let j = 0; j < 9; j++) {
        board[x + j * 9].validityIndex[num - 1] = false
        board[x + j * 9].validIndexList.delete(num)
    }
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[(x - x % 3 + i) + (y - y % 3 + j) * 9].validityIndex[num - 1] = false
            board[(x - x % 3 + i) + (y - y % 3 + j) * 9].validIndexList.delete(num)
        }
    }
}

export function removeNumber(board: Cell[], x: number, y: number): void {
    // console.log(board[x + y * 9].data)
    if (board[x + y * 9].data == 0) {
        return
    }
    let old = board[x + y * 9].data
    board[x + y * 9].data = 0
    for (let i = 0; i < 9; i++) {
        if (Math.floor(i / 3) != Math.floor(x / 3) && quadContains(board, Math.floor(i / 3), Math.floor(y / 3), old)) {
            // console.log("rquad", i, y)
            i += 2 - i % 3
            continue
        }
        if (i != x && rowContains(board, i, old)) {
            // console.log("row", i, y)
            continue
        }
        board[i + y * 9].validityIndex[old - 1] = true
        board[i + y * 9].validIndexList.add(old)
    }
    for (let j = 0; j < 9; j++) {
        if (Math.floor(j / 3) != Math.floor(y / 3) && quadContains(board, Math.floor(x / 3), Math.floor(j / 3), old)) {
            // console.log("cquad", x, j)
            j += 2 - j % 3
            continue
        }
        if (j != y && colContains(board, j, old)) {
            // console.log("col", x, j)
            continue
        }
        board[x + j * 9].validityIndex[old - 1] = true
        board[x + j * 9].validIndexList.add(old)
    }
    for (let i = x - x % 3; i < x + 3 - x % 3; i++) {
        if (i == x) {
            // console.log("same x")
            continue
        }
        for (let j = y - y % 3; j < y + 3 - y % 3; j++) {
            if (j == y) {
                // console.log("same y")
                continue
            }
            if ( rowContains(board, i, old)) {
                // console.log("qrow", i, j)
                continue
            }
            if (colContains(board, j, old)) {
                // console.log("qcol", i, j)
                continue
            }
            board[i+j * 9].validityIndex[old - 1] = true
            board[i+j * 9].validIndexList.add(old)
        }
    }
}

function rowContains(board: Cell[], col: number, num: number): boolean {
    for (let j = 0; j < 9; j++) {
        if (board[col + j * 9].data == num) {
            return true
        }
    }
    return false
}

function colContains(board: Cell[], row: number, num: number): boolean {
    for (let i = 0; i < 9; i++) {
        if (board[i + row * 9].data == num) {
            return true
        }
    }
    return false
}

function quadContains(board: Cell[], x: number, y: number, num: number): boolean {
    for (let i = x * 3; i < (x + 1) * 3; i++) {
        for (let j = y * 3; j < (y + 1) * 3; j++) {
            if (board[i + j * 9].data === num) {
                // console.log(i, j, board[i + j * 9].data)
                return true
            }
        }
    }
    return false
}


// function solve(board: Cell[]) {
//     let copy = board
//     solveRecursive(copy)
//     setBoard({...copy})
// }

export function solve(board: Cell[], i = 0, limit = 81): boolean {
    if (limit === 0) {
        return true
    }
    if (i > 80) {
        i = 0
    }
    if (board[i].data !== 0) {
        return solve(board, i + 1, limit - 1);
    }
    // let start = Math.floor(Math.random() * 9);
    if (board[i].validIndexList.size == 0) {
        return false
    }
    // console.log(i)
    // let start = Math.floor(Math.random() * 8 + 1);
    for (let n = 1; n <= 9; n++) {
        // console.log(i, n)
        if (board[i].validIndexList.has(n)) {
            placeNumber(board, i % 9, Math.floor(i / 9), n)
            if (!solve(board, i + 1, limit - 1)) {
                removeNumber(board, i % 9, Math.floor(i / 9))
                // console.log("remove", board[i])
            } else {
                return true
            }
        }
        // start++
        // if (start > 9) {
        //     start = 0
        // }
    }
    return false
}