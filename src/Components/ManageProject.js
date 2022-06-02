import React from 'react'
import { useForm } from 'react-hook-form'

export default function ManageProject() {
    const { formState: { errors }, register, handleSubmit } = useForm()
    const onSubmit = data => console.log(data)
    return (
        <div>



            <form className='w-50 mx-auto py-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='my-5 d-flex align-items-center justify-content-center flex-column'>

                    <small className='text-secondary animate__animated animate__fadeInLeft'>Please Fill Up The Form To Add A.</small>
                    <h1 className='text-center animate__animated animate__fadeInRight'>New Project</h1>

                </div>
                <div className="form-floating mb-3  animate__animated animate__fadeInLeft">
                    <input type="name" className="form-control bg-transparent " {...register("name", { required: { value: true, message: "Project Name Is Required" } })} id="name" placeholder=' ' />
                    <label htmlFor="name">Project Name</label>

                    {errors.name && <span className="text-danger">{errors.name.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("desc", { required: { value: true, message: "Project Description Is Required" } })} id="desc" placeholder=' ' />
                    <label htmlFor="desc">Project Description</label>

                    {errors.desc && <span className="text-danger">{errors.desc.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <div class="mb-3">
                        <label for="formFile" class="form-label">Project Image</label>
                        <input class="form-control" type="file"{...register("img", { required: { value: true, message: "Project Image Is Required" } })} id="formFile" />
                        {errors.img && <span className="text-danger" >{errors.img.message}</span>}
                    </div>
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("tech", { required: { value: true, message: "Password Is Required" } })} id="tech" placeholder=' ' />
                    <label htmlFor="tech">Project Technologies</label>

                    {errors.tech && <span className="text-danger">{errors.tech.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("client", { required: { value: true, message: "Project Client Side Code Is Required" } })} id="client" placeholder=' ' />
                    <label htmlFor="client">Project Client Side Code</label>

                    {errors.client && <span className="text-danger">{errors.client.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("server")} id="server" placeholder=' ' />
                    <label htmlFor="server">Project Server Side Code</label>
                    {errors.server && <span className="text-danger">{errors.server.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="text" className="form-control bg-transparent " {...register("live", { required: { value: true, message: "Project Live Site Link Is Required" } })} id="live" placeholder=' ' />
                    <label htmlFor="live">Project Live Site Link</label>
                    {errors.live && <span className="text-danger">{errors.live.message}</span>}
                </div >
                <button className="btn btn-outline-dark my-4 w-100 animate__animated animate__fadeInUp">Submit</button>
            </form >
        </div>
    )
}
