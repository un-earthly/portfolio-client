import { useRouter } from 'next/router';
import React from 'react'
export default function Blog() {
    // const {blog}  
    const { id } = useRouter().query;
    return (
        <div className='text-white'>{id}</div>
    )
}
