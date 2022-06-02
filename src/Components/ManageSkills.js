import React from 'react'
import { useForm } from 'react-hook-form'

export default function ManageSkills() {
    const { formState: { errors }, register, handleSubmit } = useForm()
    const onSubmit = data => console.log(data)
    return (
        <div>
            <form className='w-50 mx-auto py-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='my-5 d-flex align-items-center justify-content-center flex-column'>

                    <small className='text-secondary animate__animated animate__fadeInLeft'>Whant To Add A New Skill</small>
                    <h1 className='text-center animate__animated animate__fadeInRight'>Please Fill Up The Form.</h1>

                </div>
                <div className="form-floating mb-3  animate__animated animate__fadeInLeft">
                    <input type="email" className="form-control bg-transparent " {...register("email", { required: { value: true, message: "Email Is Required" } })} id="floatingEmail" placeholder=' ' />
                    <label htmlFor="floatingEmail">Skill Name</label>

                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="password" className="form-control bg-transparent " {...register("pass", { required: { value: true, message: "Password Is Required" } })} id="flotingName" placeholder=' ' />
                    <label htmlFor="flotingName">Skill Description</label>

                    {errors.pass && <span className="text-danger">{errors.pass.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="password" className="form-control bg-transparent " {...register("pass", { required: { value: true, message: "Password Is Required" } })} id="flotingName" placeholder=' ' />
                    <label htmlFor="flotingName">Languages</label>

                    {errors.pass && <span className="text-danger">{errors.pass.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="password" className="form-control bg-transparent " {...register("pass", { required: { value: true, message: "Password Is Required" } })} id="flotingName" placeholder=' ' />
                    <label htmlFor="flotingName">Frameworks</label>

                    {errors.pass && <span className="text-danger">{errors.pass.message}</span>}
                </div >
                <button className="btn btn-outline-dark my-4 w-100 animate__animated animate__fadeInUp">Submit</button>
            </form >
        </div>
    )
}
