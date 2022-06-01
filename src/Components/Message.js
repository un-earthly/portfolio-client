import axios from 'axios'
import React, { useEffect, useState } from 'react'

export default function Message() {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        axios.get('http://localhost/message').then(res => setMessages(res.data))
    }, [messages])

    const replied = id => {
        axios.patch(`http://localhost/message/${id}`)
            .then(res => console.log(res.data))

    }
    const deleteMsg = id => {
        axios.delete(`http://localhost/message/${id}`)
            .then(res => console.log(res.data))

    }
    return (
        <div className='container p-5'>
            <h1 className='mb-5'>All Messages</h1>
            {
                messages.map(m => (
                    <div class="card my-5 text-capitalize">
                        <div class="card-header">
                            {m.name}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{m.msg}</h5>
                            <p class="card-text text-lowercase">{m.email}.</p>
                            <p className={m.status === "replied" ? "text-success" : "text-danger"}>{m.status}</p>

                            <div class="btn-group" role="group" aria-label="Basic mixed styles example">
                                <button onClick={() => replied(m._id)} className="btn btn-sm btn-dark">Replied</button>
                                <button onClick={() => deleteMsg(m._id)} className="btn btn-sm btn-danger">Delete</button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}
