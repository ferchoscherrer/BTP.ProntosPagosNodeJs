
export default interface ITask {
    id: string,
    createdAt: Date,
    attributes?: IValues[]
}

interface IValues {
    value: string
}