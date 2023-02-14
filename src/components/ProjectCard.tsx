import React from 'react'
import { ProjectInterface } from '../interface/ProjectInterface'
interface Props {
    project: ProjectInterface
}

export default function ProjectCard({ project }: Props) {
    return (
        <div className='relative pt-10 '>
            <img src={project.img} alt="" />
            <div className='absolute space-y-7 z-10 font-semibold bg-black/50 text-white h-full w-full flex items-center justify-center flex-col top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2'>
                <p className='w-3/4 text-xs md:text-base lg:text-3xl text-center'>{project.name}</p>
                <p className='w-3/4 text-xs md:text-base text-center'>{project.desc}</p>
                <p className='w-3/4 text-xs md:text-base text-center'><span className='text-gray-300'>Built with </span>{project.tech}</p>
                <div className='space-x-3 text-xs md:text-base'>
                </div>
                <div className="flex">
                    {project.server &&
                        <button className="bg-indigo-600 duration-300 hover:bg-indigo-700 text-white font-bold py-2 px-4">
                            <a target={"_blank"} href={project.server}>Server</a>
                        </button>
                    }
                    <button className="bg-orange-600 duration-300 hover:bg-orange-700 text-white font-bold py-2 px-4">
                        <a target={"_blank"} href={project.client}>Client</a>
                    </button>
                    <button className="bg-cyan-500 duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4">
                        <a target={"_blank"} href={project.live}>Live</a>
                    </button>
                </div>
            </div>
        </div>
    )
}
