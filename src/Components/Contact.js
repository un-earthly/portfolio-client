import React from 'react'
import { useForm } from 'react-hook-form';

export default function Contact() {
  const { formState: { errors }, register, reset, handleSubmit } = useForm()
  const onSubmit = data => {

    console.log(data)

    reset()
  }
  return (
    <form className='w-50 mx-auto' onSubmit={handleSubmit(onSubmit)}>

      <div className="form-floating mb-3">
        <input type="email" className="form-control" {...register("email", { required: { value: true, message: "Email Is Required" } })} id="floatingInput" placeholder="name@example.com" />
        <label for="floatingInput">Email address</label>

        {errors.email && <span className="text-danger">{errors.email.message}</span>}
      </div >
      <div className="form-floating" >
        <div className="form-floating" >
          <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea2" {...register("msg", { required: { value: true, message: "Please Enter Your Message" } })}></textarea >
          <label for="floatingTextarea2">Comments</label>
        </div >
        {errors.msg && <span className="text-danger"> {errors.msg.message}</span>}
      </div >
      <button className="btn btn-outline-dark">Submit</button>
    </form >
  )
}
