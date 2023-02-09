import express from "express"
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import * as dotenv from 'dotenv'
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
const clients = {}
let usersids
dotenv.config()

try {
    wss.on('connection', (ws) => {
        ws.on('error', console.error)
        ws.on('message', (message) => {
            clients[JSON.parse(message).userId] = ws
            usersids = JSON.parse(message).userId
            console.log(JSON.parse(message))
            console.log(`Received message from user: ${JSON.parse(message).userId} message: ${JSON.parse(message).message}`)
            for (const client in clients) {
                if (clients[client].readyState === WebSocket.OPEN) {
                    clients[client].send(JSON.stringify({
                        type: JSON.parse(message).type,
                        sender: JSON.parse(message).userId,
                        message: JSON.parse(message).message,
                    }))
                }
            }
        })
        ws.on('close', () => { delete clients[usersids]; console.log(`User ${usersids} disconnected`) })
    })
} catch (error) { console.error(`WebSocket error: ${error}`) }

app.get('/', (req, res) => res.send('Server is up!'))
server.listen(process.env.PORT, '0.0.0.0', () => { console.log(`Listening on port: 5000`); wss.on('error', console.error) })
