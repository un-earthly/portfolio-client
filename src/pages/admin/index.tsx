import React, { useEffect, useState } from 'react';
import Router from 'next/router';
import Dashboard from './dashboard';
import Users from './users';
import Projects from './Projects';
import Skills from './skills';
import Blogs from './blogs';
import Head from 'next/head';

interface Props {
    children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = () => {
    const [page, setPage] = useState("dashboard")
    useEffect(() => {
        const userAuth = window.localStorage.getItem("userAuthKey")
        if (!userAuth) {
            Router.push("/admin/login")
        }

    }, [])

    return (
        <div className="flex h-screen">
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className="w-64 bg-gray-800">
                <ul className="p-4">
                    <li>
                        <a onClick={() => setPage("dashboard")} className={`mb-4 ${page === "dashboard" ? "text-gray-400" : ""} text-white hover:text-gray-400`}>Dashboard</a>
                    </li>
                    <li>
                        <a onClick={() => setPage("users")} className={`mb-4 ${page === "users" ? "text-gray-400" : ""} text-white hover:text-gray-400`}>Users</a>
                    </li>
                    <li>
                        <a onClick={() => setPage("skills")} className={`mb-4 ${page === "skills" ? "text-gray-400" : ""} text-white hover:text-gray-400`}>Skills</a>
                    </li>
                    <li>
                        <a onClick={() => setPage("blogs")} className={`mb-4 ${page === "blogs" ? "text-gray-400" : ""} text-white hover:text-gray-400`}>Blogs</a>
                    </li>
                    <li>
                        <a onClick={() => setPage("projects")} className={`mb-4 ${page === "projects" ? "text-gray-400" : ""} text-white hover:text-gray-400`}>Projects</a>
                    </li>

                </ul>
            </div>
            <div className="flex-1 bg-white p-4">{
                page === "dashboard" ? <Dashboard /> : page === "users" ? <Users /> : page === "blogs" ? <Blogs /> : page === "projects" ? <Projects /> : <Skills />
            }</div>
        </div>
    );
};

export default AdminLayout;
