"use client"
import { Toaster, toast } from 'sonner'
// make the context that the other files will get from
import { useState, createContext, useContext } from 'react'; 
import { Bacasime_Antique } from 'next/font/google';
type message = {
    msg : string,
    timeStamp : number
}
type passDown = {
    notify : (message: string) => void;
}
export const  NotificationContext = createContext<undefined |  passDown>(undefined)

export function ContextWrap({children} : {children : React.ReactNode}) {
    
    const notify = (message : string, type = "success") => {
        switch (type) {
            case "success":
                toast.success(<div style={{background: ""}}>{message}</div>,{
                    style: {
                        textAlign: "center",
                        fontFamily:"Inconsolata, Inconsolata Fallback",
                        fontStyle: "normal",
                        borderColor: "var(--mid)",
                        background: 'white',
                    },
                });
                break;
            case "error":
                toast.error(<div style={{background: ""}}>{message}</div>,{
                    style: {
                        textAlign: "center",
                        fontFamily:"Inconsolata, Inconsolata Fallback",
                        fontStyle: "normal",
                        borderColor: "var(--mid)",
                        background: 'white',
                    },
                });
                break;
            case "none":
                toast(<div style={{background: ""}}>{message}</div>,{
                    style: {
                        textAlign: "center",
                        fontFamily:"Inconsolata, Inconsolata Fallback",
                        fontStyle: "normal",
                        borderColor: "var(--mid)",
                        background: 'white',
                        display: "flex",
                        justifyContent: "center",
                    },
                });
               break;
        
        }

        return;
    }

    return (
        <NotificationContext.Provider value={{notify}}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useAppContext(){
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error("useAppContext must be used inside NotificationProvider");
    }
    return context;
}


