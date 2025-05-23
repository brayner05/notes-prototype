import express from "express"
import dotenv from "dotenv"
import * as notes from "./routes/notes.mjs"
import sqlite3 from "sqlite3"
import path from "path"

// Load environment variables
dotenv.config()

// Application configuration
export const application = {
    port: process.env.PORT,
    database: new sqlite3.Database(process.env.DATABASE_URL, error => {
        if (error) {
            console.log(`Failed to connect to database: ${error}`)
            process.exit(-1)
        } else {
            console.log("Connected to database.")
        }
    }),
}

// Initialize express
const app = express()

app.set("view engine", "pug")
app.set("views", path.join("templates"))

// Configure middleware
app.use(async (req, _, next) => {
    console.log(`${req.method} - ${req.url}`)
    next()
})

// Add routes
app.use("/notes", notes.router)

// Listen on the defined port.
app.listen(application.port, error => {
    if (error) {
        console.log(`Failed to start application: ${error}`)
    } else {
        console.log(`Listening on port ${application.port}`)
    }
})

// When the application exits, close the database connection.
process.on("exit", _ => {
    application.database.close()
})
