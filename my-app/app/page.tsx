'use client'

import {useGameStore} from "@/gameStore";

function ValidOptions({x, y}: { x: number, y: number }) {
    const rows = useGameStore((state) => state.rows)
    const columns = useGameStore((state) => state.columns)
    const quadrants = useGameStore((state) => state.quadrants)
    const isSafe = useGameStore((state) => state.isSafe)
    return <div
        className={'absolute bg-gray-500 flex flex-col flex-1 text-xs leading-none w-full h-full'}>{[0, 1, 2].map(c => {
        return <div
            key={"q" + x + c}
            className={'flex flex-row flex-1'}
        >
            {[0, 1, 2].map(r => {
                return <div
                    key={"i" + x + y + c + r}
                    className={'bg-gray-200 text-black flex flex-1 justify-center items-center'}
                >
                    {isSafe(x,y,r + c * 3) ? r + c * 3 + 1 : ''}
                </div>
            })}
        </div>
    })}</div>
}

function Quadrant(x: number, y: number) {
    const board = useGameStore((state) => state.board)
    const setCell = useGameStore((state) => state.setCell)
    const selectedValue = useGameStore((state) => state.selectedValue)
    return <div className={'bg-gray-500 flex flex-col gap-0.5 flex-1'}>{[0, 1, 2].map(c => {
        const j = c + y * 3
        return <div
            key={"q" + j}
            className={'flex flex-row gap-0.5 flex-1'}
        >
            {[0, 1, 2].map(r => {
                const i = r + x * 3
                return <div
                    key={"i" + i + j}
                    className={'bg-gray-200 text-black flex flex-1 justify-center items-center relative'}
                    onClick={() => setCell(i, j, selectedValue)}
                >
                    {board[i + j * 9] == -1 ? <ValidOptions x={i} y={j}/> : board[i + j * 9] + 1}
                </div>
            })}
        </div>
    })}</div>
}


function Board() {
    return (
        <div className={'m-auto bg-blue-400 flex flex-col gap-1 w-full max-w-md aspect-square p-1'}>
            <div className={'flex flex-row gap-1 flex-1'}>
                {Quadrant(0, 0)}
                {Quadrant(1, 0)}
                {Quadrant(2, 0)}
            </div>
            <div className={'flex flex-row gap-1 flex-1'}>
                {Quadrant(0, 1)}
                {Quadrant(1, 1)}
                {Quadrant(2, 1)}
            </div>
            <div className={'flex flex-row gap-1 flex-1'}>
                {Quadrant(0, 2)}
                {Quadrant(1, 2)}
                {Quadrant(2, 2)}
            </div>
        </div>
    )
}

export default function Home() {
    const setSelectedValue = useGameStore((state) => state.setSelectedValue)
    const selectedValue = useGameStore((state) => state.selectedValue)
    const solve = useGameStore((state) => state.solve)
    const setCell = useGameStore((state) => state.setCell)
    const clearCell = useGameStore((state) => state.clearCell)
    const clearBoard = useGameStore((state) => state.clearBoard)
    return (
        <div className={'h-dvh'}>
            <header></header>
            <main className={'h-full flex flex-col'}>
                <Board/>
                <div className={'m-auto bg-blue-400 flex flex-col w-full max-w-md p-0.5'}>
                    <div className={'bg-gray-500 flex flex-row gap-0.5 flex-1'}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(value =>
                            <div
                                key={value}
                                onClick={() => setSelectedValue(value)}
                                data-active={selectedValue === value || null}
                                className={`bg-gray-200 text-black flex flex-1 justify-center items-center aspect-square data-[active]:bg-gray-500`}
                            >
                                {value + 1}
                            </div>
                        )}
                    </div>
                </div>
                <div className={'m-auto bg-blue-400 flex flex-col w-full max-w-md p-0.5'}>
                    <div className={'bg-gray-500 flex flex-row gap-0.5 flex-1'}>
                        <div className={'bg-gray-200 text-black flex flex-1 justify-center items-center'} onClick={()=>{
                            solve()
                        }}>Solve</div>
                        <div className={'bg-gray-200 text-black flex flex-1 justify-center items-center'} onClick={()=>{
                            setCell(1,1,5)
                            setCell(7,7,5)
                            clearCell(7,7,5)
                        }}>Generate</div>
                        <div className={'bg-gray-200 text-black flex flex-1 justify-center items-center'} onClick={()=>clearBoard()}>Clear</div>
                    </div>
                </div>
            </main>
            <footer></footer>
        </div>
    )
}
