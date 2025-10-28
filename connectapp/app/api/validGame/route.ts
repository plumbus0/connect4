import { channel } from "diagnostics_channel";

let mongoose = require('mongoose');

const isValidMongoId = (id : string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const objectID = new mongoose.Types.ObjectId(id);
    return objectID.toString() === id;
  } catch (e) {
    return false;
  }
};

const boards = require("../schema/games");

export async function GET(
  request: Request,
) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("ID") || "67hehe";
    let valid = false;
    let reason = "opening game";
    if (isValidMongoId(id)) {
      let game = [];
      try {
        game = (await boards.find({"_id" : id}));
      } catch (e) {
        reason = "failed to connect to DB"; 
        return Response.json({
          isValid: valid,
          reason: reason
        },{status: 404});
      }
      if (game.length != 0) {
        valid = true;
      } else {
        reason = "can not find game";
      }
    } else {
      reason = "not a valid ID";
    }
    
  if (!valid) {
    return Response.json({
      isValid: valid,
      reason: reason
    },{status: 404});
  }

  return Response.json({
    isValid: valid,
    reason: reason
  },{status: 200});
}
