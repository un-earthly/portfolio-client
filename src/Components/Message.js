import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { baseURL } from '../utils/urls'

export default function Message() {
    const [messages, setMessages] = useState([])
    useEffect(() => {
        axios.get(`${baseURL}/message`)
            .then(res => setMessages(res.data))
    }, [messages])

    const replied = id => {
        axios
            .patch(`${baseURL}/message/${id}`)
            .then(res => console.log(res.data))

    }
    const deleteMsg = id => {
        axios
            .delete(`${baseURL}/message/${id}`)
            .then(res => console.log(res.data))

    }
    return (
        <div className='container p-5'>
            <h1 className='mb-5'>All Messages</h1>
            {
                messages.map(m => (
                    <div className="card my-5 text-capitalize">
                        <div className="card-header">
                            {m.name}
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{m.msg}</h5>
                            <p className="card-text text-lowercase">{m.email}.</p>
                            <p className={m.status === "replied" ? "text-success" : "text-danger"}>{m.status}</p>

                            <div className="btn-group" role="group" aria-label="Basic mixed styles example">
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
