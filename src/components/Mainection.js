import { useState } from 'react'

const ws = new WebSocket(`ws://${window.location.hostname}:5000`)

export default function Mainsection() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const active = JSON.parse(localStorage.getItem('active'))
    const room = localStorage.getItem('roomNum')

    const send = (msg) => {
        console.log('worked ' + room)
        if (message.trim() !== '') {
            ws.send(JSON.stringify({ message: msg, params: { room } }))
            // setMessages([...messages, msg])
            setMessage('')
            console.log('sent messages: ' + [...messages, msg])
        }
    }

    ws.onopen = () => console.log('WebSocket Client Connected' + ws.readyState)
    ws.onmessage = ({ data }) => {
        console.log('got reply! ', JSON.parse(data).message)
        console.log({ messages })
        setMessages([...messages, JSON.parse(data).message])
    }

    return (
        <div className="Mainsection">
            <input type="text" placeholder="Enter your message" name="message" value={message} onChange={(e) => { setMessage(e.target.value) }} />
            <br></br>
            <button disabled={(message === ' ') ? active : !active} onClick={() => send(message)}>sent message</button>
            <ul>
                {[...messages]?.map((item, i) => { return (<li key={i}>{item}</li>) })}
            </ul>
        </div>
    )
}