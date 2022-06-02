import React from 'react'
import { Link } from 'react-router-dom'

export default function FloatingNav() {
    return (
        <div data-nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/blogs">Blogs</Link>
        </div>
    )
}
