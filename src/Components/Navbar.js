import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav class="navbar navbar-expand-lg navbar-light justify-content-between sticky-top container">
            <div class="container-fluid">
                <Link class="navbar-brand" to='/' ><span className="text-info fw-bold">ALAMIN</span></Link>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" style={{ flexGrow: 0 }} id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <Link to='/home' class="nav-link fw-bold" aria-current="page" >HOME</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='/about' class="nav-link fw-bold" >ABOUT</Link>
                        </li>
                        <li class="nav-item">
                            <Link to='/contact' class="nav-link fw-bold">CONTACT</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}
