import { useState, useEffect } from 'react'

const wss = new WebSocket(`ws://${window.location.hostname}:5000`)


export default function Room() {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const sendMessage = (msg) => {
        console.log([...messages, message])
        if (message.trim() !== '') {
            wss.send(JSON.stringify({ type: 'message',  msg }))
            setMessages([...messages, msg])
            setMessage(' ')
            console.log('sent messages: ' + [...messages, msg])
        }

    }

    useEffect(() => {
        wss.onopen = () => console.log('WebSocket Client Connected')
        wss.onmessage = ({ data }) => {
            console.log('got reply! ', messages, JSON.parse(data))
        }

    }, [messages])


    return (
        <div className="Mainsection">
            <input type="text" value={message} onChange={(event) => setMessage(event.target.value)} />
            <button onClick={() => sendMessage(message)}>Send</button>
            <ul>
                {[...messages]?.map((messageObject, index) => { return (<li key={index}>{messageObject.sender}: {messageObject}</li>) })}
            </ul>
        </div >
    )
} 