import React from 'react'
import Navbar from './Navbar'

export default function Home() {
  return (
    <div >
      <Navbar />

      {/* HOME SECTION */}
      <div data-home className="d-flex flex-column ps-5 justify-content-center align-items-center h-100" >
        <h1 data-heading>MD.ALAMIN</h1>
        <p style={{ color: 'lightcoral' }} className='h6 my-4'>REACT JS | NODE JS | MONOGODB | JAVASCRIPT </p>
        <div >
          <a href="https://github.com/un-earthly" target="_blank" rel="noopener noreferrer"><i className="pe-4 text-secondary bi bi-github"></i></a>
          <a href="mailto:vijayalamin@gmail.com"><i className="px-4 text-secondary bi bi-envelope"></i></a>
          <a href="https://www.linkedin.com/in/alamin-5678b123a/" target="_blank" rel="noopener noreferrer"><i className="px-4 text-secondary bi bi-linkedin"></i></a>
        </div>
      </div>


      {/* SKILLS SECTION */}

      

    </div>
  )
}
