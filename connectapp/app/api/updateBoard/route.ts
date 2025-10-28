// got a game now update it

import mongoose from 'mongoose';
const boards = require("../schema/games");

// connect to Data Base !
mongoose.connect("mongodb://127.0.0.1:27017");

export async function PUT(request : Request) {
    const play = await request.json();
    // play["game"]["board"]

    const game = await boards.findById(play["game"]["_id"]);
    game.board[play["move"]["row"]][play["move"]["col"]] = play["move"]["player"];
    game.turn = !game.turn;
    await game.save()
    console.log("Updated game:", game);

    // console.log(play["game"].board, "<|", "set to",play["move"]["player"],
    //     ret
    // );
    return Response.json({}, { status: 201 });
}






