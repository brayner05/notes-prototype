import express from "express"
import { getAllNotes } from "../repositories/notes-repo.mjs"

export const router = express.Router()

router.get("/", async (req, res) => {
    await getAllNotes()
    res.render("index", {})
})
