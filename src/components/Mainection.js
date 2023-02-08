import { useState } from 'react'

const ws = new WebSocket(`ws://${window.location.hostname}:5000`)

export default function Mainsection() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const active = JSON.parse(localStorage.getItem('active'))
    const room = localStorage.getItem('roomNum')
    const [typedefault, setTypedefault] = useState('')

    const send = (msg) => {
        console.log('worked ' + room)
        if (message.trim() !== '') {
            ws.send(JSON.stringify({ type: 'message', message: msg, params: { room } }))
            setMessage('')
            console.log('sent messages: ' + [...messages, msg])
        }
    }

    ws.onopen = () => console.log('WebSocket Client Connected' + ws.readyState)
    ws.onmessage = ({ data }) => {
        const incomingData = JSON.parse(data)
        if (incomingData.type == 'message') setMessages([...messages, incomingData.message])
        setTypedefault(incomingData.type)
    }

    return (
        <div className="Mainsection">
            <input type="text" placeholder="Enter your message" name="message" value={message} onChange={(e) => { setMessage(e.target.value); if (message.trim() !== '') ws.send(JSON.stringify({ type: 'typing', message: "typing", params: { room } })) }} />
            <br></br>
            <button disabled={(message === ' ') ? active : !active} onClick={() => send(message)}>sent message</button>
            <div>
                {(typedefault == 'typing') ? <ul>typing ...</ul> : <ul> </ul>}
                <ul>   {[...messages]?.map((item, i) => { return (<li key={i}>{item}</li>) })}    </ul>
            </div>
        </div>
    )
}
