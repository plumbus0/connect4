"use client"

import {w,h} from "@/play/props"
import { ConnectionStates } from "mongoose";
import { tree } from "next/dist/build/templates/app-page";
import { useEffect, useState } from "react";
import { useAppContext } from "@/notifications/Provider";
import * as motion from "motion/react-client";

interface game {
    _id: string,
    date_made: Date;
    turn: boolean;
    board: number[][];
}

async function getGame(ID : string) {
    const res = await fetch(`http://localhost:3000/api/getBoard?ID=${ID}`);
    return res.json();
}

var hasMoved = true;

async function makeMove(game : game, player : boolean, i : number, j : number, notify : (msg : string, type? : string) => void): Promise<boolean> {
    // look at turn to see if its valid 
    // console.log(game["turn"], localTurn, player);
    if (game["turn"] != player || hasMoved === true) {
        notify("not your turn nigga", "none");
        return false;
    }

    hasMoved = true;
    notify("coin Placed")
    const coin = player ? 1 : 2;
    // aply
    await fetch("/api/updateBoard",
        {
            method: 'PUT',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                game : game, 
                move:{
                    player : coin,                    
                    row : i,
                    col : j,
                }
            }),
        }
    );
    return true;
}

function GameBoard( {player, ID} : {
    player : boolean,
    ID : string,
}) {
    const [selectCol, setSelectCol] = useState(0);
    const [val, renderFunc] = useState(false);
    const [game, setGame] = useState<game | null>(null);
    const { notify } = useAppContext();

    useEffect( ()=>{
        async function loadGame()  {
            setGame((await getGame(ID)).Game[0]);
            hasMoved = false;
        }
        loadGame();
    }, [val]);

    if (game == null) {
        return (
            <div>fuck you</div>
        );
    }

    let Board = game["board"];
    let coin_w = 100/w + '%';
    let coin_h = 100/h + '%';
    let circle_dim = "80%";

    let selectRow = h - 1;
    while (selectRow > 0 && Board[selectRow][selectCol] != 0 ) { selectRow --;};
    return (
        <div 
        className={`
        bg-white
        p-4
        pb-2
        rounded-tl-[6%]
        rounded-tr-[6%]
        relative
        m-[10px]
        aspect-[7/6]
        w-full
        max-w-200
        min-w-70
        border-4 border-solid border-[var(--mid)]
        `
        } 
        style={{
            boxShadow: "9px 9px 0px 0px var(--mid)",
            filter: "brightness(1.1)"
        }}
        onClick = { async () => {
            if (await makeMove(game, player, selectRow, selectCol, notify)) {
                renderFunc(!val);
            }
        } }
        >
            {Array.from({length : h}).map((_,i)=>
                <div key={`row-${i}`} className="w-full flex" style={{height:coin_h}}>
                {Array.from({length : w}).map((_,j)=>
                    <div key={`${i}-${j}`} 
                    onMouseMove={ () => { setSelectCol(j) }}

                    className="flex justify-center items-center"    
                    style={{
                        width: coin_w,
                        height: "100%",
                    }}>
                        <div 
                        style={{
                            width:circle_dim,
                            height:circle_dim,
                            boxShadow: "inset 4px 4px var(--mid)",
                            background : 
                            Board[i][j] == 1 ? "var(--prim)" : 
                            Board[i][j] == 2 ? "var(--sec)" : 
                            // hover
                            j == selectCol && i == selectRow ? "var(--coinHover)":
                            // normal coin 
                            "var(--coinSlot)"
                        }}
                        className="border-4 border-solid border-[var(--mid)] w-full h-full rounded-full">
                        </div>
                    </div>
                )}
                </div>
            )}
        </div>
    )
}

export default GameBoard;