import * as roomRepository from "../repositories/roomRepositories.js";

export async function getAllRooms() {
  return await roomRepository.getAllRooms();
}