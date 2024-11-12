import React from 'react'
import styles from './newcard.module.scss'
import { ProjectInterface } from '../interface/ProjectInterface'
interface Props {
    project: ProjectInterface
}
export default function Newcard({ project }: Props) {
    return (
        <div>
            <div className={styles.card}>
                <img className='opacity-20 h-80' alt="project" src={project.img} />

                <div className="text-center w-full">
                    <p className='text-xs lg:text-xl text-center font-semibold'>{project.name}</p>
                    <p className='text-xs  text-center'>{project.desc}</p>
                    <p className='text-xs text-center mt-3'><span className='text-gray-300'>Built with </span>{project.tech}</p>
                    <div className="flex items-center justify-center my-5">
                        {project.server &&
                            <button className="bg-indigo-600 duration-300 hover:bg-indigo-700 text-white font-bold py-2 px-4  z-50">
                                <a rel="noreferrer" target={"_blank"} href={project.server}>Server</a>
                            </button>
                        }
                        <button className="bg-orange-600 duration-300 hover:bg-orange-700 text-white font-bold py-2 px-4  z-50">
                            <a rel="noreferrer" target={"_blank"} href={project.client}>Client</a>
                        </button>
                        <button className="bg-cyan-500 duration-300 hover:bg-cyan-700 text-white font-bold py-2 px-4  z-50">
                            <a rel="noreferrer" target={"_blank"} href={project.live}>Live</a>
                        </button>
                    </div>
                </div>
                <div className='space-x-3 text-xs md:text-base'>
                </div>

                <div className={styles.shine}></div>
                <div className={styles.background}>
                    <div className={styles.tiles}>
                        <div className={`${styles.tile} ${styles['tile-1']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-2']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-3']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-4']}`}></div>

                        <div className={`${styles.tile} ${styles['tile-5']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-6']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-7']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-8']}`}></div>

                        <div className={`${styles.tile} ${styles['tile-9']}`}></div>
                        <div className={`${styles.tile} ${styles['tile-10']}`}></div>
                    </div>

                    <div className={`${styles.line} ${styles['line-1']}`}></div>
                    <div className={`${styles.line} ${styles['line-2']}`}></div>
                    <div className={`${styles.line} ${styles['line-3']}`}></div>
                </div>


            </div>
        </div>

    )
}
