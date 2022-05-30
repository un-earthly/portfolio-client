import React from 'react'
import TypeAnimation from 'react-type-animation';
import 'animate.css';
export default function Home() {
  const workData = [

    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 'Flying Wheels',
      techonologies: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      live: "https://manufacturer-admin.web.app/"
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

      {/* HOME SECTION */}
      <div data-home className="d-flex flex-column ps-5 justify-content-center align-items-center h-100" >
        <h1 data-heading>MD.ALAMIN</h1>
        <p style={{ color: 'lightcoral' }} className='h6 my-2'>
          <TypeAnimation
            sequence={['MONOGODB | EXPRESS JS | REACT JS | NODE JS', 1000, '']}
          />
        </p>
        <div className='d-flex' >
          <a className='d-block animate__delay-2s animate__animated animate__bounceInLeft' href="https://github.com/un-earthly" target="_blank" rel="noopener noreferrer"><i className=" pe-4 text-secondary bi bi-github"></i></a>
          <a className='d-block animate__delay-2s animate__animated animate__bounceInDown' href="mailto:vijayalamin@gmail.com"><i className="px-4 text-secondary bi bi-envelope"></i></a>
          <a className='d-block animate__delay-2s animate__animated animate__bounceInRight' href="https://www.linkedin.com/in/alamin-5678b123a/" target="_blank" rel="noopener noreferrer"><i className="px-4 text-secondary bi bi-linkedin"></i></a>
        </div>
      </div>


      {/* WORKS SECTION */}


      <div data-work className="container py-5" >
        {
          workData.map(w => (
            <div class="card my-3" >
              <div data-card class="position-relative d-flex align-items-center justify-content-center">
                <img src={w.ss} className='w-100' alt="" />
                <div data-card__body className='position-absolute text-white'>
                  <div>
                    <a target='_blank' href={w.live} class="card-link">{w.title}</a>
                    <a target='_blank' href={w.client} class="card-link">Client</a>
                    <a target='_blank' href={w.server} class="card-link">Server</a>
                  </div>
                  <p data-tech class="card-text text-capitalize">{w.techonologies} </p>
                </div>
              </div>
            </div>
          ))
        }
      </div>


    </div>
  )
}
