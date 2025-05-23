import { application } from "../index.mjs"

export const getAllNotes = async () => {
    const db = application.database
    db.serialize(() => {
        db.run("SELECT * FROM notes", (res, error) => {
            console.log(res)
        })
    })
}
