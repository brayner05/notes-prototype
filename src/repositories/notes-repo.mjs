import { application } from "../index.mjs"
import { Project } from "../models/project.model.mjs"

/**
 * @param {{ limit: number }?} options
 * @returns {Promise<Array<Project>>}
 */
export const getAllProjects = async options => {
    const db = application.database

    return new Promise((resolve, reject) => {
        const queryResponseHandler = (error, rows) => {
            if (error) {
                reject(new Error(`Database error: ${error}`))
            } else {
                const data = rows.map(
                    project => new Project(project.title, project.path)
                )
                resolve(data)
            }
        }

        db.serialize(() => {
            if (!options) {
                db.all("SELECT * FROM project", queryResponseHandler)
            } else {
                db.all(
                    "SELECT * FROM project LIMIT ?",
                    [options.limit],
                    queryResponseHandler
                )
            }
        })
    })
}

/**
 * @param {string} title
 * @returns {Promise<Project>}
 */
export const getProjectByTitle = async title => {
    const db = application.database

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.get(
                "SELECT * FROM project WHERE title = ? LIMIT 1",
                [title],
                (error, row) => {
                    if (error) {
                        reject(new Error(`Database error: ${error}`))
                    } else if (row) {
                        resolve(new Project(row.title, row.path))
                    } else {
                        resolve(null)
                    }
                }
            )
        })
    })
}

/**
 *
 * @param {Project} project
 * @returns {Promise<void>}
 */
export const saveProject = async project => {
    const db = application.database

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(
                "INSERT INTO project (title, path) VALUES (?, ?)",
                [project.title, project.path],
                (_, error) => {
                    if (error) {
                        reject(new Error(`Database error: ${error}`))
                    } else {
                        resolve()
                    }
                }
            )
        })
    })
}

/**
 *
 * @param {Project} project
 * @returns {Promise<void>}
 */
export const updateProject = async project => {
    const db = application.database

    return new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(
                "UPDATE projects SET title = ?, path = ? WHERE title = ?",
                [project.title, project.path, project.title],
                (_, error) => {
                    if (error) {
                        reject(new Error(`Database error: ${error}`))
                    } else {
                        resolve()
                    }
                }
            )
        })
    })
}
