const mongoose = require('mongoose');
const boards = require("../schema/games");

// connect to Data Base !
mongoose.connect("mongodb://127.0.0.1:27017");

export async function GET(
  request: Request,
) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("ID");
    const game = (await boards.find({"_id" : id}));
    return Response.json({
      Game : game
    })
}
