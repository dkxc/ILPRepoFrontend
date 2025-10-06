export type Project = {
    id: number,
    title: string,
    status: "Live" | "In Progress" | "Completed",
    technologies: string[],
    team: {
        number: number,
        members: string[]
    },
    progress: number
}