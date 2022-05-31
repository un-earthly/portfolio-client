import React, { useEffect, useState } from 'react'
import TypeAnimation from 'react-type-animation';
import Modal from './Modal';
import Skill from './Skill';
import Contact from './Contact';
import ScrollAnimation from 'react-animate-on-scroll';
import { db, auth } from "../firebase.init"
export default function Home() {
  const workData = [

    {
      ss: "https://i.ibb.co/99dfcWW/image.png",
      title: 'Flying Wheels',
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Flying Wheels is a cycle wheels Manufacturers application that they use to track edit showcase their products and delivery.',
      live: "https://manufacturer-admin.web.app/",
      server: "https://github.com/un-earthly/flying-wheels-server",
      client: "https://github.com/un-earthly/flying-wheels-client",
    },
    {
      ss: "https://i.ibb.co/M27Xvvt/image.png",
      title: "Gagets Heaven",
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'gadgets heaven is a warehouse that imports and distributes electronics. this site is created for making their data visible to their admins. and they showcase their inventory.',
      live: "https://gadgets-heaven-97bc2.web.app/",
      server: "https://github.com/un-earthly/gadgets-heaven-server",
      client: "https://github.com/un-earthly/gadgets-heaven-client",
    },
    {
      ss: "https://i.ibb.co/KWbX65M/image.png",
      title: "Jarins Parlour",
      tech: 'stripe,react,Daisy ui,nodejs,Mongodb,Firebase,react-hooks-form,tailwindcss,',
      desc: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis eligendi asperiores excepturi dolor autem modi animi. Explicabo quae perferendis est!',
      live: "https://jerins-parlour-f046c.web.app/",
      client: "https://github.com/un-earthly/jerins-parlour-client",
    },
    {
      ss: "https://i.ibb.co/bX4Fw19/image.png",
      title: "MERN Todo",
      tech: 'Axios, bootstrap, firebase, react,react-hook-form react-router-dom, Node js, express js, Mongo Db.',
      desc: 'An essential CRUD operation drove the application using the MERN stack.Where users can keep track their tasks.easy to login ,register,update and delete.',
      live: "https://todo-d793a.web.app/",
      client: "https://github.com/un-earthly/client-todo",
      server: "https://github.com/un-earthly/server-todo"
    },
    {
      ss: "https://i.ibb.co/XkTwBw9/image.png",
      title: "GPU Reviews",
      tech: 'react, react router, bootstrap icons, google fonts, recharts, tailwind css.',
      desc: 'A basic react client side, Where Users has reviewd about a gpu, and practice of recharts, which is used for different charts shown in the dashboard section.',
      live: "https://gpu-reviews.netlify.app/",
      client: "https://github.com/un-earthly/gpu-review",
    },


  ]

  const [workDetails, setWorkDetails] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    window.addEventListener('load', () => {
      setLoader(false)
    });
  }, []);
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
  if (loader) {
    return <div style={{ height: "100vh", width: "100vw" }} className="d-flex align-items-center justify-content-center">Loading ...</div>
  }
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
          <a className='d-block animate__delay-2s animate__animated animate__bounceInUp' href="https://www.linkedin.com/in/alamin-5678b123a/" target="_blank" rel="noopener noreferrer"><i className="px-4 text-secondary bi bi-linkedin"></i></a>
          <a className='d-block animate__delay-2s animate__animated animate__bounceInRight' href="https://wa.me/qr/DSCEYYSP3GEIP1" target="_blank" rel="noopener noreferrer"><i className="px-4 text-secondary bi bi-whatsapp"></i></a>
        </div>
      </div>


      {/* WORKS SECTION */}


      <ScrollAnimation animateIn="animate__fadeInLeft" animateOut='animate__fadeOutRight' duration={2} >

        <div data-work className="container py-5" >
          {
            workData.map(w => (
              <div className="card my-3" >
                <div data-card className="position-relative d-flex align-items-center justify-content-center">
                  <img src={w.ss} className='w-100' alt="" />
                  <div data-card__body className='position-absolute text-white'>
                    <div>
                      <button onClick={() => setWorkDetails(w)} type="button" className="btn text-white btn-link btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </div >
            ))
          }
        </div >
      </ScrollAnimation >

      {workDetails && <Modal workDetails={workDetails} />}

      {/* skills SECTION */}
      < section className='skills' >
        <ScrollAnimation animateIn="animate__fadeInUp" animateOut='animate__fadeOutUp' duration={2} >

          <h1>Skills &amp; Technologies</h1>
        </ScrollAnimation >
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
