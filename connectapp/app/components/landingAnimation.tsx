'use client';
import { count } from "console";
import React, { useEffect, useRef, useState } from "react";
import { arrayBuffer } from "stream/consumers";

const num_class :Record<number, string> = {
    0 : "var(--coinSlot)",
    1 : "var(--prim)",
    2 : "var(--sec)",
}

const offsets : number[][][] = [
    // \
    [[1,1],
    [-1,-1]],
    // /
    [[-1,1],
    [1,-1]],
    // --
    [[0,1],
    [0,-1]],
    // |
    [[-1,0],
    [1,0]],
]

var bord_que : number[][][] = [];
const updtae_len = 700;

function start_update(update_board : Function) {

    setInterval(()=>{
        if (bord_que.length > 0) {
            update_board(bord_que.shift());
        }
    }, updtae_len)
}

type update_coin_props = {
    i : number,
    j : number,
    update_board : Function,
    coin_board : number[][]
};

type check_props = {
    i : number,
    j : number,
    i_offset : number,
    j_offset : number,
    delay : number,
    len : number,
    coin_board : number[][]   
}

function inbound(i : number, j : number, bord : number[][]) {
    const i_max = bord.length;
    const j_max = bord[0].length;

    return (i > -1 && j > -1  &&
    i < i_max && j < j_max)
}


function clear_slots(
    c_i : number,
    c_j : number,
    coin_board : number[][],
    update_board : Function
) {
    type coor = [number, number];
    let que = new Array<coor>();
    que.push([c_i,c_j]);
    let seen = new Set<coor>();
    while (que.length) {
        const coors : number[] = que.shift()!;
        let [i, j] = coors;
        coin_board[i][j] = 0;
        bord_que.push(JSON.parse(JSON.stringify(coin_board)));
        for (let ind = 0; ind < offsets.length; ind++) {
            for (let dir_i = 0; dir_i < offsets[0].length; dir_i++) {
                const new_i = i + offsets[ind][dir_i][0];
                const new_j = j + offsets[ind][dir_i][1];
                if (inbound(new_i,new_j,coin_board) && coin_board[new_i][new_j] != 0 && !seen.has([new_i,new_j])){
                    que.push([new_i,new_j]);
                }
            }
        }
    }
}

// 0 -> less than 4 
// 1 -> over than 4 
function check_clear(
    i : number, 
    j : number, 
    i_offset : number, 
    j_offset : number, 
    coin_board : number[][], 
) {
    let count = 0;
    i += i_offset;
    j += j_offset;
    while (
        inbound(i, j, coin_board) &&
        coin_board[i][j] == 1
    ) {
        i += i_offset;
        j += j_offset;
        count ++;
        if (count > 4) {
            break;
        }
    }
    return count;
}


function update_coin( {i, j, update_board, coin_board}: update_coin_props,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const new_coin_board = Array.from({ length: coin_board.length }, (_, i) =>
        Array.from({ length: coin_board[0].length }, (_, j) => coin_board[i][j])
    );

    if (new_coin_board[i][j] != 0) {
        return;
    }
    new_coin_board[i][j] = 1;
     
    let cleardirs : number[][][] = [];
    for (let ind = 0; ind < offsets.length; ind++) {
        // for each direction back and forth
        let sum = 1;
        for (let dir_i = 0; dir_i < offsets[0].length; dir_i++) {
            sum += check_clear(i,j, offsets[ind][dir_i][0], offsets[ind][dir_i][1], new_coin_board);    
        }
        if (sum >= 4) {
            cleardirs.push(offsets[ind]);
        }
    }
    // if in animation then add to the end 
    if (bord_que.length > 0) {
        bord_que.push(new_coin_board);
    } else {
        update_board(new_coin_board);
    }
    if (cleardirs.length) {
        clear_slots(i, j, coin_board, update_board);
    }
}

function Screen() {
    // settings :
    const gap = 3;
    let dense = 40;
    const height = 50; // (in rem)

    const [screenWidth, set_screen_w] = useState(0);
    const [displayHeight, set_screen_h] = useState(0);
    const [coin_board, update_board] = useState<number[][]>([]);
    const curr_coin_board = useRef(coin_board);

    useEffect(() => {
        start_update(update_board);
        curr_coin_board.current = coin_board;
    }, [coin_board]);

    useEffect(() => {
        set_screen_w(window.innerWidth);
        // set to 50 rem
        const screen_h = Number((getComputedStyle(document.documentElement).fontSize).slice(0,-2))*(height)
        set_screen_h(screen_h);
        const rerenderFunction = ()=> {
            set_screen_w(window.innerWidth);
            set_screen_h(screen_h);
            let n : number = Math.floor(window.innerWidth/dense) - 1;
            let m : number = Math.floor(screen_h/dense) - 1;

            const arr = Array.from({ length: m }, (_, i) =>
                Array.from({ length: n }, (_, j) => 0)
            )
            update_board(arr);
        }
        window.addEventListener("resize", rerenderFunction);
        rerenderFunction();
        return (()=>{window.removeEventListener("resize", rerenderFunction)})
    }, []);
    /////////////////
    let n : number = Math.floor(screenWidth/dense) - 1;
    let m : number = Math.floor(displayHeight/dense) - 1;

    return (
        <div className={`p-2 w-full top-0 h-[${height}rem] z--1 relative`}>
            {/*  || INSERT THE COIN SLOTS ||  */}
            {Array.from({length : m}).map((thing, i) => 
                <div key={i} className={`flex direction-row justify-between`}> {
                    Array.from({length : n}).map((things, j) => 
                    // coin cover
                    <div 
                        key={`${i}-${j}`} 
                        id={`${i}-${j}`}
                        onClick={(e) => update_coin({i, j, update_board, coin_board},e)}
                    >
                        <div 
                            style={{width :`${dense-gap*2}px`, height:`${dense-gap*2}px`, margin:`${gap}px`, backgroundColor:`${num_class[coin_board[i][j]]}`}} 
                            className={`border-1 border-solid border-[var(--mid)] overflow-hidden duration-150 rounded-full`}>
                        </div>
                    </div>
                    
                )}
                </div>
            )}
            {/* COVER WITH GRADIENT */}
            <div className="pointer-events-none w-full h-[50rem] absolute top-0 left-0 bg-gradient-to-b from-transpent-500 to-white"></div>
        </div>
    )
}

export default Screen;