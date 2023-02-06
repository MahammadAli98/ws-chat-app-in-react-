import { useState } from 'react'
import Mainsection from './Mainection.js'

export default function Room() {
    const [room, setRoom] = useState(JSON.parse(localStorage.getItem('roomNum')) || ' ')
    const [active, setActive] = useState(JSON.parse(localStorage.getItem('active')) || false)

    const bjoin = () => {
        if (room.trim() !== '') {
            localStorage.setItem('active', JSON.stringify(!active))
            setActive(!active)
            localStorage.setItem('roomNum', room)
        }
    }

    return (
        <div className="Room">
            <button disabled={active} onClick={() => bjoin()}>join group</button><br></br>
            < input disabled={active} type="number" placeholder="Enter room number" name="room Num" value={room} onChange={(e) => setRoom(e.target.value)} /><br></br>
            <>
                {(active) ? <Mainsection /> : null}
            </>
        </div>
    )
}