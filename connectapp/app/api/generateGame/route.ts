import {w,h} from "@/play/props";
const mongoose = require('mongoose');
const boards = require("../schema/games");

// connect to Data Base !
mongoose.connect("mongodb://127.0.0.1:27017").then( ()=>{
    console.log("connect");
});
 
// make a new empyu board
async function makeBoard() {
    const  new_board_arr =
    Array.from({length : h}).map( ()=>
        Array.from({length : w}).map(()=> 0) 
    )

    const new_board = await boards.create({
        date_made : Date.now(),
        turn : true,
        board : new_board_arr,
        expireAfterSeconds: 1000
    });
    console.log(new_board);
    return new_board;
}

// returns a new ID and creates an empty board in mongo DB
export async function GET(request: Request) {

    return Response.json({ID : (await makeBoard())["_id"]})
}