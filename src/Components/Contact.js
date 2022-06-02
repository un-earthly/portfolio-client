import React from 'react'
import { useForm } from 'react-hook-form';
import ScrollAnimation from 'react-animate-on-scroll';
import axiosPrivate from "../axiosPrivate"
export default function Contact() {
  const { formState: { errors }, register, reset, handleSubmit } = useForm()
  const onSubmit = data => {
    const { name, msg, email } = data
    axiosPrivate.post("https://portfolio-backend-39.herokuapp.com/message", { name, email, msg, status: "not replied" })

    reset()
  }
  return (
    <form data-contact className='mx-auto px-2 py-5' onSubmit={handleSubmit(onSubmit)}>
      <div className='my-5 d-flex align-items-center justify-content-center flex-column'>
        <ScrollAnimation animateIn="animate__fadeInRight" animateOut='animate__fadeOutLeft' duration={2} >

          <small className='text-secondary'>Have Any Plan?</small>
        </ScrollAnimation>
        <ScrollAnimation animateIn="animate__fadeInLeft" animateOut='animate__fadeOutRight' duration={2} >

          <h1 className='text-center'>Let's Talk</h1>
        </ScrollAnimation>

      </div>
      <div className="form-floating mb-3">
        <input type="text" className="form-control bg-transparent text-white" {...register("name", { required: { value: true, message: "Name Is Required" } })} id="flotingName" placeholder=' ' />
        <label htmlFor="flotingName">Your Name</label>

        {errors.name && <span className="text-danger">{errors.name.message}</span>}
      </div >
      <div className="form-floating mb-3">
        <input type="email" className="form-control bg-transparent text-white" {...register("email", { required: { value: true, message: "Email Is Required" } })} id="floatingEmail" placeholder=' ' />
        <label htmlFor="floatingEmail">Email address</label>

        {errors.email && <span className="text-danger">{errors.email.message}</span>}
      </div >
      <div className="form-floating" >
        <div className="form-floating" >
          <textarea className="form-control bg-transparent text-white" id="floatingMessage" {...register("msg", { required: { value: true, message: "Please Enter Your Message" } })} placeholder=' '></textarea >
          <label htmlFor="floatingMessage">Your Message</label>
        </div >
        {errors.msg && <span className="text-danger"> {errors.msg.message}</span>}
      </div >
      <button className="btn btn-outline-light my-4 w-100"  >Submit</button>
    </form >
  )
}
