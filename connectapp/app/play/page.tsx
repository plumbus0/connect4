import { stringify } from "querystring";
import GameBoard from "./gameBoard_";
import { Flamenco } from "next/font/google";
import CopyBtn from "@/components/copyText";

async function Page(
    {searchParams}: {searchParams: { [key: string]: string | string[] | undefined };
}) {
    // called to cause re render 
    let ID = "-1";
    let player = true;
    const params = await searchParams;
    ID = (params.ID)?.toString() || "NOID";
    player = Number(params.player) == 1 ? true : false;
    console.log(params.player)
    if (ID == "-1") {
        return (
            <div> loading... </div>
        )
    }

    return (
        <>
        <div className="w-full h-full flex justify-center items-center bg-white-200">
            <GameBoard ID={ID} player={player}></GameBoard>
        </div>
        <div>
            {
                player ? 
                <CopyBtn ID={ID} text="Copy Player 2 URL!"></CopyBtn>
                : <div></div>
            }
            
        </div>
        </>
        
        
    )
}


export default Page;