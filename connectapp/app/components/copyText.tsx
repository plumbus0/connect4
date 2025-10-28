"use client";

import { url } from "inspector";
import { useEffect, useState } from "react";
import { useAppContext } from "@/notifications/Provider"

async function CopyText(url : string) {
    navigator.clipboard.writeText(url);
}

function Copy({ID, text} : {ID : string, text : string}) {
    
    let [URL, setUrl] = useState("loading url..");
    const { notify } = useAppContext();
    useEffect(()=>{
        setUrl(`${window.location.origin}/play?ID=${ID}&player=2`);
    }, [])
    return (
        <div className="flex justify-center">
            <div
                className="p-2 m-3 flex border-2 rounded-xl border-[var(--mid)] cursor-pointer shadow-[5px_5px_0px_var(--mid)] duration-70 hover:shadow-[3px_3px_0px_var(--mid)]" 
                onClick={()=>{CopyText(URL); notify("copied !")}}
            >
                {text}
            </div>
        </div>

    );
}

export default Copy