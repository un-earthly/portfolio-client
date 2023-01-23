import axios from 'axios'
import React from 'react'
import { useForm } from 'react-hook-form'
import useSkill from '../Hooks/useSkill'
import { baseURL } from '../utils/urls'

export default function ManageSkills() {
    const { formState: { errors }, register, handleSubmit } = useForm()
    const { skills } = useSkill()
    const onSubmit = data => {
        axios.post(baseURL + "/skill", data)
    }


    // const update = id => {
    //     axios.patch(`baseURLskill/${id}`,data)
    //         .then(res => console.log(res.data))

    // }
    const deleteSkl = id => {
        axios.delete(baseURL + `/skill/${id}`)
            .then(res => console.log(res.data))

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

            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Name</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            skills.map((s, i) => (<tr>
                                <th scope="row">{i + 1}</th>
                                <td>{s.name}</td>
                                <td>

                                    <button onClick={() => deleteSkl(s._id)} className="btn btn-sm btn-outline-danger"><i class="bi bi-pencil"></i></button>
                                </td>
                                <td>

                                    <button onClick={() => deleteSkl(s._id)} className="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                                </td>

                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
