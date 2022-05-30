import React, { useEffect, useState } from 'react'
import TypeAnimation from 'react-type-animation';
import 'animate.css';
import Modal from './Modal';
import Skill from './Skill';
import Contact from './Contact';
export default function Home() {
  const workData = [

    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 'Flying Wheels',
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://manufacturer-admin.web.app/"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },
    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 100,
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://github.com/un-earthly/flying-wheels-client.git"
    },


  ]

  const [showTopBtn, setShowTopBtn] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    });
  }, []);

  const goToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (


    <div >

      {/* HOME SECTION */}
      <div data-home className="d-flex flex-column justify-content-center align-items-center h-100" >
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
            <div className="card my-3" >
              <div data-card className="position-relative d-flex align-items-center justify-content-center">
                <img src={w.ss} className='w-100' alt="" />
                <div data-card__body className='position-absolute text-white'>
                  <div>
                    <button type="button" className="btn text-white btn-link btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                      Details
                    </button>
                  </div>
                </div>
              </div>
              <Modal client={w.live} live={w.live} modalTech={w.tech} modalDesc={w.desc} server={w.live} />
            </div >
          ))
        }
      </div >


      {/* skills SECTION */}
      < section className='skills' >
        <h1>Skills &amp; Technologies</h1>
        <div data-skills>

          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
          <Skill exp="Over 10 years of experience building web applications." lang="PHP, NodeJS" frameworks="Laravel, CodeIgniter" heading="Backend" />
        </div>
      </section >

      {/* about SECTION */}

      < section className="about" >

      </section >
      {/* contact section */}
      <section className="bg-dark text-white">

        < Contact />
      </section>

      <div className={`top-to-btm  ${showTopBtn ? "d-block" : "d-none"}`} onClick={goToTop}><i class="bi bi-arrow-up-square-fill position-fixed position-btm-rgt text-info h1"></i>
      </div>
    </div >
  )
}
