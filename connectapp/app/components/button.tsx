"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/notifications/Provider"
import { Faster_One } from "next/font/google";
import { toast } from "sonner"
import { Interface } from "readline";
import { promises } from "dns";
import { tree } from "next/dist/build/templates/app-page";
type button_props = {
    onclick  : string,
    colour : string,
    children : React.ReactNode
    action : string
    joinURL : string
}

interface isValid{
    isValid: boolean,
    reason: string
} 

async function validGame(ID : string, notify : (msg : string, type? : string) => void) {
    if (!ID) {
        notify("gave me nothin", "error");
        return {
            isValid: false,
            reason: "gave me nothin"
        } as isValid;
    }
    const res = fetch(`http://localhost:3000/api/validGame?ID=${ID}`)

    .then( async (res)=> {
        const data = await res.json();
        if (!res.ok) {
            return Promise.reject({ reason: data.reason });
        }
        return data;
    });
    
    toast.promise(res, {
        loading: 'looking for game...',
        success: (data) => {
            return `${data.reason}`;
        },
        error: (data)=> {return `${data.reason}`},
        
        style: {
            fontFamily:"Inconsolata, Inconsolata Fallback",
            fontStyle: "normal",
            borderColor: "var(--mid)",
            background: 'white',
        },
    });
    
    return (await res) as isValid;
}

async function getNewGameID() {
    const res = await fetch("/api/generateGame");
    console.log(res);
    return res.json();
}

function Button({children, joinURL, colour = "red", action} : button_props) {
    const router = useRouter();    
    const { notify } = useAppContext();
    
    async function openGame(action : string) {
        let ID = joinURL;
        let player = 0;
        switch (action) {
            case "new":
                // MAKE NEW ONE
                ID = (await getNewGameID())["ID"];
                player = 1;
                break;
            case "join":
                // VALIDATE THE GIVEN ONE
                const validObj : isValid = await validGame(ID, notify);
                if (!validObj.isValid) {
                    return;
                }
                player = 2;
                break;
            default:
                ID = "NOID";
        }

        router.push(`./play?ID=${ID}&player=${player}`);
    }

    return (
        <div onClick={() => openGame(action)}>
            <button className={`font-bold flex align-center rounded-xl bg-${colour} cursor-pointer p-2 hover:text-[2px_2px_5px_#4d94e2a8]`}>
                {children}
            </button>
        </div>
    );
}

export default Button;