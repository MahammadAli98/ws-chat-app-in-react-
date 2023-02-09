import { useState } from 'react'

const ws = new WebSocket(`ws://${window.location.hostname}:5000`)

export default function Mainsection() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const active = JSON.parse(localStorage.getItem('active'))
    const room = localStorage.getItem('roomNum')
    const [typedefault, setTypedefault] = useState('')
    const [userId, setUserId] = useState([])


    const getUniqueID = () => {
        const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)
        return s4() + s4() + '-' + s4()
    }

    const send = (msg) => {
        if (message.trim() !== '') {
            ws.send(JSON.stringify({ userId, type: 'message', message: msg, params: { room } }))
            setMessage('')
            console.log('sent messages: ' + [...messages, msg])
        }
    }

    ws.onopen = () => {
        const İD = getUniqueID()
        setUserId([...userId, İD])
        ws.send(JSON.stringify({ userId }))
    }
    ws.onmessage = ({ data }) => {
        const incomingData = JSON.parse(data)
        if (incomingData.type === 'message') setMessages([...messages, incomingData.message])
        setTypedefault(incomingData.type)
    }

    return (
        <div className="Mainsection">
            <input type="text" placeholder="Enter your message" name="message" value={message} 
            onChange={(e) => {
                 setMessage(e.target.value); 
                 if (message.trim() !== '') ws.send(JSON.stringify({ userId, type: 'typing', message: "typing", params: { room } })) }} />
            <br></br>
            <button disabled={(message === ' ')
                ? active
                : !active}
                onClick={() => send(message)}>sent message</button>
            <div>
                {(typedefault === 'typing') ? <ul>typing ...</ul> : null}
                <ul>   {[...messages]?.map((item, i) => { return (<li key={i}>{item}</li>) })}    </ul>
            </div>
        </div>
    )
}
