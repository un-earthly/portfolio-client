import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import Dashboard from './Dashboard';

export default function RequireAdmin() {
    const { formState: { errors }, register, handleSubmit } = useForm()
    const [admin, setAdmin] = useState(false)
    const [error, setError] = useState("")
    const onSubmit = data => {
        const adminName = process.env.REACT_APP_admin_name
        const adminPass = process.env.REACT_APP_admin_pass
        const userName = data.email
        const userPass = data.pass
        if (adminName === userName && adminPass === userPass) {
            setAdmin(true)
        }
        setError("Your Credentials are not correct")
    }
    if (!admin) {


        return (
            <form className='w-50 mx-auto py-5' onSubmit={handleSubmit(onSubmit)}>
                <div className='my-5 d-flex align-items-center justify-content-center flex-column'>

                    <small className='text-secondary animate__animated animate__fadeInLeft'>Are you a admin?</small>
                    <h1 className='text-center animate__animated animate__fadeInRight'>Please Login.</h1>

                </div>
                <div className="form-floating mb-3  animate__animated animate__fadeInLeft">
                    <input type="email" className="form-control bg-transparent " {...register("email", { required: { value: true, message: "Email Is Required" } })} id="floatingEmail" placeholder=' ' />
                    <label htmlFor="floatingEmail">Your Admin Email</label>

                    {errors.email && <span className="text-danger">{errors.email.message}</span>}
                </div >
                <div className="form-floating mb-3  animate__animated animate__fadeInRight">
                    <input type="password" className="form-control bg-transparent " {...register("pass", { required: { value: true, message: "Password Is Required" } })} id="flotingName" placeholder=' ' />
                    <label htmlFor="flotingName">Your Admin Password</label>

                    {errors.pass && <span className="text-danger">{errors.pass.message}</span>}
                </div >
                {<span className='text-danger'>{error}</span>}
                <button className="btn btn-outline-dark my-4 w-100 animate__animated animate__fadeInUp">Submit</button>
            </form >
        )
    }
    else {
        return <>

            <Dashboard />

        </>
    }
}
