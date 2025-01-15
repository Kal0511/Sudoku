import {create} from 'zustand'

interface State {
    board: number[]

    rows: number[]
    columns: number[]
    quadrants: number[]

    selectedValue: number

    clearBoard: () => void
    isSafe: (x: number, y: number, value: number) => boolean
    setCell: (x: number, y: number, value: number) => boolean
    clearCell: (x: number, y: number, value: number) => void
    setSelectedValue: (value: number) => void

    solve: () => void
}

export function getBox(i: number, j: number) {
    return Math.floor(i / 3) + Math.floor(j / 3) * 3;
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function isSafe(state: State, i: number, j: number, number: number) {
    return !((state.rows[j] >> number) & 1) && !((state.columns[i] >> number) & 1) && !((state.quadrants[getBox(i, j)] >> number) & 1);
}

function setCell(state: State, x: number, y: number, value: number) {
    if (isSafe(state, x, y, value)) {
        state.board[x + y * 9] = value
        state.rows[y] |= 1 << value
        state.columns[x] |= 1 << value
        state.quadrants[getBox(x, y)] |= 1 << value
        return true
    } else {
        return false
    }
}

function clearCell(state: State, x: number, y: number, value: number) {
    state.board[x + y * 9] = -1
    state.rows[y] &= ~(1 << value)
    state.columns[x] &= ~(1 << value)
    state.quadrants[getBox(x, y)] &= ~(1 << value)
}

export const useGameStore = create<State>()((set, get) => ({
    board: Array(81).fill(-1),
    rows: Array(9).fill(0),
    columns: Array(9).fill(0),
    quadrants: Array(9).fill(0),
    selectedValue: -1,
    clearBoard: () => set(state => {
        state.board = Array(81).fill(-1)
        state.rows = Array(9).fill(0)
        state.columns = Array(9).fill(0)
        state.quadrants = Array(9).fill(0)
        state.selectedValue = -1
        return {...state}
    }),
    isSafe: (i, j, number) => {
        return isSafe(get(), i, j, number)
    },
    setCell: (x, y, value) => {
        const state = get()
        if (setCell(state, x, y, value)) {
            state.board = [...state.board]
            state.rows = [...state.rows]
            state.columns = [...state.columns]
            state.quadrants = [...state.quadrants]
            set({...state})
            return true
        } else {
            return false
        }
    },
    clearCell: (x, y, value) => {
        const state = get()
        clearCell(state, x, y, value)
        state.board = [...state.board]
        state.rows = [...state.rows]
        state.columns = [...state.columns]
        state.quadrants = [...state.quadrants]
        set({...state})
    },
    setSelectedValue: (value: number) => set(state => {
        state.selectedValue = value
        return {...state}
    }),
    solve: () => {
        const state = get()

        function solveHelper(i = Math.floor(Math.random() * 81), limit = 81): boolean {
            if (limit === 0) {
                return true
            }
            if (i > 80) {
                i = 0
            }
            if (state.board[i] != -1) {
                return solveHelper(i + 1, limit - 1);
            }
            let start = Math.floor(Math.random() * 9);
            for (let n = 0; n < 9; n++) {
                if (setCell(state, i % 9, Math.floor(i / 9), start)) {
                    if (!solveHelper(i + 1, limit - 1)) {
                        clearCell(state, i % 9, Math.floor(i / 9), start)
                    } else {
                        return true
                    }
                }
                start++
                if (start > 9) {
                    start = 0
                }
            }
            return false
        }

        const t1 = performance.now()
        solveHelper(0)
        const t2 = performance.now()
        console.log(t1)
        console.log(t2)
        console.log("count: ", t2 - t1)

        state.board = [...state.board]
        set({...state})
    }
}))
