import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { GET_MASSAGE_LIST_URL } from '../utilities/urls';

export default function Users() {
    const [data, setData] = useState<any[]>([])
    useEffect(() => {
        axios.get(GET_MASSAGE_LIST_URL)
            .then(res => { setData(res.data.data) })
            .catch(err => console.log(err))
    }, [])
    return (
        <div className='text-black'>
            <h1 className="text-2xl font-bold mb-4 ">users messages</h1>
            {
                data.map(d => <div key={d._id} className='capitalize'>
                    <p>{d.name}</p>
                    <p>{d.email}</p>
                    <p>{d.message}</p>
                </div>)
            }
        </div>
    )
}
