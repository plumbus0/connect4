"use client"
import Image from "next/image";
import ButtonLink from "@/components/button";
import Screen from "./components/landingAnimation";
import { useState } from "react";
import { useAppContext } from "./notifications/Provider";

export default function Home() {
  const {notify} = useAppContext();
  const [value, setValue] = useState("");
  return (
    // center it all :
    <div className="flex flex-wrap justify-center items-center bg-white-300 w-full">
      <Screen></Screen>
      <div className="bg-white absolute z-1 rounded-xl flex flex-col justify-evenly items-center border-2 border-solid border-[var(--mid)] h-50 w-90 mr-10 ml-10 shadow-[4px_4px_0px_var(--mid)]">
        <div className="p-2 m-3 flex border-2 rounded-xl border-[var(--mid)] direction-row justify-center items-center align-centre">
          <p className="min-w-[90px]">Join Game :</p>
          <input id="game-id" placeholder="game-id" type="text" className = " text-[var(--mid)] focus:outline-none h-full text-center"
            onChange={(e) => setValue(e.target.value)}
          >
          </input>
          <ButtonLink action="join" joinURL={value} onclick="./play" colour = "[var(--prim)]"> Join </ButtonLink>          
        </div>
        <div className = {`w-full h-1 bg-[var(--mid)]`}></div>
        <ButtonLink action="new" joinURL="" onclick="./play" colour = "[var(--prim)]"> Create New Game </ButtonLink>
      </div>
    </div>
  );
}
