import express from "express"
import { createServer } from 'http'
import { WebSocketServer, WebSocket } from 'ws'
import * as dotenv from 'dotenv'
const app = express()
const server = createServer(app)
const wss = new WebSocketServer({ server })
dotenv.config()
const clients = {}

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
    return s4() + s4() + '-' + s4()
}

wss.on('connection', (ws) => {
    ws.on('error', console.error)
    let userId = getUniqueID()
    clients[userId] = ws

    ws.on('message', (message) => {
        console.log(`Received message from user: ${userId}: ${message}`)
        for (const client in clients) { if (clients[client].readyState === WebSocket.OPEN) { clients[client].send(JSON.stringify({ sender: userId, message: JSON.parse(message).message })) } }
    })

    ws.on('close', () => {
        console.log(`User ${userId} disconnected`)
        delete clients[userId]
    })
})

app.get('/', (req, res) => res.send('Server is up!'))
server.listen(process.env.PORT, '0.0.0.0', () => { console.log(`Lisesning on port: 5000`); wss.on('error', console.error) })