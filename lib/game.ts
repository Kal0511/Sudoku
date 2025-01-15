import {MinHeap} from "./minHeap";

export class Cell {
    public data: number;
    public index: number
    public validityIndex: Array<number>;
    public validIndexList: Set<number>;

    constructor(i: number) {
        this.data = 0
        this.index = i
        this.validityIndex = new Array<number>()
        for (let n = 0; n < 9; n++) {
            this.validityIndex.push(0)
        }
        this.validIndexList = new Set<number>()
        for (let n = 1; n <= 9; n++) {
            this.validIndexList.add(n)
        }
    }

    valueOf() {
        if (this.data != 0) {
            return 0
        }
        return this.validIndexList.size
    }
}

export function newBoard(): Cell[] {
    let board = []
    for (let i = 0; i < 81; i++) {
        board.push(new Cell(i))
    }
    return board
}


export function placeNumber(board: Cell[], x: number, y: number, num: number): void {
    board[x + y * 9].data = num
    board[x + y * 9].validityIndex[num - 1]++
    board[x + y * 9].validIndexList.delete(num)
    for (let i = 0; i < 9; i++) {
        if (i == x) {
            continue
        }
        board[i + y * 9].validityIndex[num - 1]++
        if (board[i + y * 9].validityIndex[num - 1] == 1) {
            board[i + y * 9].validIndexList.delete(num)
        }
    }
    for (let j = 0; j < 9; j++) {
        if (j == y) {
            continue
        }
        board[x + j * 9].validityIndex[num - 1]++
        if (board[x + j * 9].validityIndex[num - 1] == 1) {
            board[x + j * 9].validIndexList.delete(num)
        }
    }
    for (let i = x - x % 3; i < x + 3 - x % 3; i++) {
        if (i == x) {
            continue
        }
        for (let j = y - y % 3; j < y + 3 - y % 3; j++) {
            if (j == y) {
                continue
            }
            board[i + j * 9].validityIndex[num - 1]++
            if (board[i + j * 9].validityIndex[num - 1] == 1) {
                board[i + j * 9].validIndexList.delete(num)
            }
        }
    }
}

export function removeNumber(board: Cell[], x: number, y: number): void {
    if (board[x + y * 9].data == 0) {
        return
    }
    let old = board[x + y * 9].data
    board[x + y * 9].data = 0
    board[x + y * 9].validityIndex[old - 1]--
    board[x + y * 9].validIndexList.add(old)
    for (let i = 0; i < 9; i++) {
        if (i == x) {
            continue
        }
        board[i + y * 9].validityIndex[old - 1]--
        if (board[i + y * 9].validityIndex[old - 1] == 0) {
            board[i + y * 9].validIndexList.add(old)
        }
    }
    for (let j = 0; j < 9; j++) {
        if (j == y) {
            continue
        }
        board[x + j * 9].validityIndex[old - 1]--
        if (board[x + j * 9].validityIndex[old - 1] == 0) {
            board[x + j * 9].validIndexList.add(old)
        }
    }
    for (let i = x - x % 3; i < x + 3 - x % 3; i++) {
        if (i == x) {
            continue
        }
        for (let j = y - y % 3; j < y + 3 - y % 3; j++) {
            if (j == y) {
                continue
            }
            board[i + j * 9].validityIndex[old - 1]--
            if (board[i + j * 9].validityIndex[old - 1] == 0) {
                board[i + j * 9].validIndexList.add(old)
            }
        }
    }
}

// function rowContains(board: Cell[], col: number, num: number): boolean {
//     for (let j = 0; j < 9; j++) {
//         if (board[col + j * 9].data == num) {
//             return true
//         }
//     }
//     return false
// }
//
// function colContains(board: Cell[], row: number, num: number): boolean {
//     for (let i = 0; i < 9; i++) {
//         if (board[i + row * 9].data == num) {
//             return true
//         }
//     }
//     return false
// }
//
// function quadContains(board: Cell[], x: number, y: number, num: number): boolean {
//     for (let i = x * 3; i < (x + 1) * 3; i++) {
//         for (let j = y * 3; j < (y + 1) * 3; j++) {
//             if (board[i + j * 9].data === num) {
//                 // console.log(i, j, board[i + j * 9].data)
//                 return true
//             }
//         }
//     }
//     return false
// }


export function solve(board: Cell[], heap: MinHeap<Cell>, limit: number = 81): boolean {
    if (limit == 0) {
        return true
    }
    // heap.print()
    let curr = heap.pop()
    // console.log(curr)
    if (curr == undefined) {
        return true
    }
    if (curr.data !== 0) {
        return solve(board, heap, limit - 1);
    }
    // if (curr.validIndexList.size == 0) {
    //     heap.push(curr)
    //     return false
    // }
    // for (let n = 1; n <= 9; n++) {
    //     if (curr.validIndexList.has(n)) {
            // console.log(curr.validIndexList.values())
            for (const n of Array.from(curr.validIndexList.values())){
            placeNumber(board, curr.index % 9, Math.floor(curr.index / 9), n)
                heap.sort()
            if (!solve(board, heap, limit - 1)) {
                removeNumber(board, curr.index % 9, Math.floor(curr.index / 9))
                // console.log(curr)
            } else {
                return true
            }
        // }
    }
    heap.push(curr)
    return false
}