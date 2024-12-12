import * as xsenv from '@sap/xsenv'; 
xsenv.loadEnv()

import express, { Request, Response } from "express"; 
import cors from "cors"
import dotenv from "dotenv"
import router from "./infraestructure/routes/router"
import { authPassport, initializePassport } from './middlewares/xsuaa';

import swaggerUi from 'swagger-ui-express'
import swaggerSetup from './doc/swagger'

dotenv.config()
const app = express()
const port = process.env.PORT ?? 5000

app.use(cors())

initializePassport(app)
authPassport(app)

app.use(express.json())

app.use("/api", router)
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerSetup))

app.get("/ping", (_req: Request, res: Response) => {
    res.status(200).send(`<h1>Pong 🏓</h1>`)
})

app.listen(port, () => console.log(`>>> Server is listening on port ${port}`))