import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function ManageSkills() {
    const { formState: { errors }, register, handleSubmit } = useForm()
    const onSubmit = data => {
        axios.post("https://portfolio-backend-39.herokuapp.com/skill", data)
    }
    return (
        <div>
            <form className='w-50 mx-auto py-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='my-5 d-flex align-items-center justify-content-center flex-column'>

                    <small className='text-secondary animate__animated animate__fadeInLeft'>Whant To Add A New Skill</small>
                    <h1 className='text-center animate__animated animate__fadeInRight'>Please Fill Up The Form.</h1>

                </div>
                <div className="form-floating mb-3  animate__animated animate__fadeInLeft">
                    <input type="text" className="form-control bg-transparent " {...register("name", { required: { value: true, message: "Skill Name Is Required" } })} id="name" placeholder=' ' />
                    <label htmlFor="name">Skill Name</label>

                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("desc", { required: { value: true, message: "Skill Description Is Required" } })} id="desc" placeholder=' ' />
                    <label htmlFor="desc">Skill Description</label>

                    {errors.desc && <span className="text-danger">{errors.desc.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("lang")} id="lang" placeholder=' ' />
                    <label htmlFor="lang">Languages</label>

                    {errors.lang && <span className="text-danger">{errors.lang.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("frameworks")} id="frameworks" placeholder=' ' />
                    <label htmlFor="frameworks">Frameworks</label>

                    {errors.frameworks && <span className="text-danger">{errors.frameworks.message}</span>}
                </div >
                <button className="btn btn-outline-dark my-4 w-100 animate__animated animate__fadeInUp">Submit</button>
            </form >
        </div>
    )
}
