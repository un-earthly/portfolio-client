import React, { useEffect, useState } from 'react'
import Modal from './Modal';
import Skill from './Skill';
import Contact from './Contact';
import ScrollAnimation from 'react-animate-on-scroll';
import axios from 'axios';
import useSkill from '../Hooks/useSkill';
import MySkeleton from './MySkeleton';
import cv from "../assets/cv.pdf"
export default function Home() {

  const [works, setWorks] = useState([])
  const [workDetails, setWorkDetails] = useState({});
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [loader, setLoader] = useState(true);

  const { skills } = useSkill()
  useEffect(() => {
    axios.get("https://portfolio-backend-39.herokuapp.com/project").then(res => {
      setWorks(res.data)
      setLoader(false)
    })
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
  return (


    <div >

      {/* HOME SECTION */}
      <div data-home className="d-flex flex-column justify-content-center align-items-center h-100 text-white" >

        <h1 data-heading data-base__heading>MD.ALAMIN</h1>
        <div className='h6 my-2 d-flex'>
          <p className="animate__animated animate__fadeInLeft">MONOGO DB</p> <span className="mx-1">|</span>
          <p className="animate__animated animate__fadeInDown">EXPRESS JS</p><span className="mx-1">|</span>
          <p className="animate__animated animate__fadeInUp">REACT JS </p> <span className="mx-1">|</span>
          <p className="animate__animated animate__fadeInRight">NODE JS</p>
        </div>
        <div className='d-flex' >
          <a className='d-block animate__animated animate__bounceInLeft' href="https://github.com/un-earthly" target="_blank" rel="noopener noreferrer"><i className=" pe-4 text-white bi bi-github"></i></a>
          <a className='d-block animate__animated animate__bounceInDown' href="mailto:vijayalamin@gmail.com"><i className="px-4 text-white bi bi-envelope"></i></a>
          <a className='d-block animate__animated animate__bounceInUp' href="https://www.linkedin.com/in/alamin-5678b123a/" target="_blank" rel="noopener noreferrer"><i className="px-4 text-white bi bi-linkedin"></i></a>
          <a className='d-block animate__animated animate__bounceInRight' href="https://wa.me/qr/DSCEYYSP3GEIP1" target="_blank" rel="noopener noreferrer"><i className="px-4 text-white bi bi-whatsapp"></i></a>
        </div>
        <a class="btn btn-outline-light mt-3 animate__animated animate__fadeInUp" href={cv} title="" download>Download Resume</a>

      </div>


      {/* WORKS SECTION */}



      <div className="container py-5" >
        <div className='my-5'>
          <ScrollAnimation animateIn="animate__fadeInLeft" duration={2} >
            <small className='text-center d-block'>The Projects Im Working On</small>

          </ScrollAnimation>
          <ScrollAnimation animateIn="animate__fadeInRight" duration={2} >
            <h1 data-heading className='text-center'>My Project</h1>
          </ScrollAnimation>
        </div>
        <div data-work>

          {
            loader ?
              <>
                <MySkeleton />
                <MySkeleton />
                <MySkeleton />
                <MySkeleton />
              </>
              :
              works.map(w => (

                <ScrollAnimation animateIn="animate__fadeInUp" duration={2} key={w._id}>
                  <div className="my-3" >
                    <div data-card style={{ backgroundImage: `url(${w.img})` }} className="position-relative d-flex align-items-center justify-content-center">
                      <div data-card__body className='position-absolute text-white'>
                        <div>
                          <button onClick={() => setWorkDetails(w)} type="button" className="btn text-white btn-link btn-sm" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </div >

                </ScrollAnimation >
              ))
          }
        </div >
      </div>

      {workDetails && <Modal workDetails={workDetails} />}

      {/* skills SECTION */}
      < section className='skills' >
        <ScrollAnimation animateIn="animate__fadeInDown" animateOut='animate__fadeOutUp' duration={2} >

          <h1 data-heading>Skills &amp; Experience</h1>
        </ScrollAnimation >
        <div data-skills>
          {
            skills.map(skill => (
              <ScrollAnimation animateIn="animate__fadeInUp" duration={2} key={skill._id}>
                <Skill skill={skill} />
              </ScrollAnimation>
            ))

          }
        </div>
      </section >

      {/* about SECTION */}

      < section className="about" >

      </section >
      {/* contact section */}
      <section className="bg-dark text-white">

        < Contact />
      </section>
      <div className={`top-to-btm  ${showTopBtn ? "d-block" : "d-none"}`} onClick={goToTop}><i className="bi bi-arrow-up-square-fill position-fixed position-btm-rgt text-info h1"></i>
      </div>
    </div >
  )
}
