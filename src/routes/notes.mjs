import express from "express"
import * as zod from "zod"

import {
    getAllProjects,
    getProjectByTitle,
    saveProject,
} from "../repositories/notes-repo.mjs"
import { Project } from "../models/project.model.mjs"

const schema = zod.object({
    title: zod.string(),
    path: zod.string(),
})

export const router = express.Router()

router.get("/", async (req, res) => {
    const projects = await getAllProjects()
    res.render("index", { projects: projects })
})

router.get("/:title", async (req, res) => {
    const projectTitle = req.params.title
    try {
        const project = await getProjectByTitle(projectTitle)
        res.render("project", { project: project })
    } catch (error) {
        res.status(404).send(error)
    }
})

router.post("/", async (req, res) => {
    const parsedBody = await schema.parseAsync(req.body)
    const project = new Project(parsedBody.title, parsedBody.path)
    try {
        const existingProject = getProjectByTitle(project.title)
        if (existingProject === null) {
            res.status(500).send(`Project '${project.title} already exists.`)
        }
        saveProject(project)
        res.status(200).json(existingProject)
    } catch (error) {
        res.status(500).send(error)
    }
})
