import React from 'react'
import Navbar from './Navbar'
export default function Home() {
  const workData = [

    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },


  ]
  return (
    <div >
      <Navbar />

      {/* HOME SECTION */}
      <div data-home className="d-flex flex-column ps-5 justify-content-center align-items-center h-100" >
        <h1 data-heading>MD.ALAMIN</h1>
        <p style={{ color: 'lightcoral' }} className='h6 my-4'> MONOGODB | EXPRESS JS | REACT JS | NODE JS  </p>
        <div >
          <a href="https://github.com/un-earthly" target="_blank" rel="noopener noreferrer"><i className="pe-4 text-secondary bi bi-github"></i></a>
          <a href="mailto:vijayalamin@gmail.com"><i className="px-4 text-secondary bi bi-envelope"></i></a>
          <a href="https://www.linkedin.com/in/alamin-5678b123a/" target="_blank" rel="noopener noreferrer"><i className="px-4 text-secondary bi bi-linkedin"></i></a>
        </div>
      </div>


      {/* WORKS SECTION */}


      <div data-work className="container py-5" >
        {
          workData.map(w => (
            <div class="card my-3" >
              <div class="card-body d-flex align-items-center justify-content-center" style={{ backgroundSize: 'cover', minHeight: '500px', backgroundPosition: 'center center', backgroundImage: `url(${w.ss})` }}>
                <p class="card-text">{w.techonologies}.</p>
                <a href={w.live} class="card-link">{w.title}</a>
              </div>
            </div>
          ))
        }
      </div>


    </div>
  )
}
