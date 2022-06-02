import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function Dashboard() {
    return (
        <div style={{ height: "100vh" }} data-dashboard>

            <div className="d-flex flex-column flex-shrink-0 p-3 bg-secondary text-white h-100" data-sidebar>
                <div className="sticky-top d-flex justify-content-center flex-column">

                    <span className="fs-4">Admin Panel</span>
                    <NavLink activeclassname="active" to='/'>
                        Home
                    </NavLink>
                    <NavLink activeclassname="active" to='/admin/manage-project'>
                        Manage Projects
                    </NavLink>
                    <NavLink activeclassname="active" to='/admin/skills'>
                        Skills
                    </NavLink>
                    <NavLink activeclassname="active" to='/admin/messages'>
                        Messages
                    </NavLink>
                </div>
            </div>
            <div data-admin__content className='w-100 border'>
                <Outlet />
            </div>

        </div>
    )
}
