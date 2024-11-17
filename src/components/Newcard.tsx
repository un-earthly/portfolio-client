import React from 'react'
import styles from './newcard.module.scss'
import { ProjectInterface } from '../interface/ProjectInterface'
import { FileCode, Globe, Server } from 'lucide-react'
import { Card } from './ui/card'
interface Props {
    project: ProjectInterface
}
export default function Newcard({ project }: Props) {
    return (
        <div>
            <Card className={`${styles.card} grid grid-cols-5 w-2/3 mx-auto bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300`}>
                <div className="flex place-content-center py-3 col-span-2">
                    <img className='opacity-20 h-32' alt="project" src={project.img} />
                </div>

                <div className="col-span-3">
                    <p className='text-xs lg:text-xl  font-semibold'>{project.name}</p>
                    <p className='text-xs  '>{project.desc}</p>
                    {/* <p className='text-xs text-center mt-3'><span className='text-gray-300'>Built with </span>{project.tech}</p> */}
                    <div className="flex my-5 gap-4">
                        {project.server && (
                            <button className="px-4 py-2 rounded-lg bg-slate-800/50 text-violet-300 hover:bg-slate-700/50 hover:text-violet-200 transition-all duration-300 font-medium border border-slate-700/50 hover:border-violet-500/30 backdrop-blur-sm flex items-center gap-2 group">
                                <Server className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                <a rel="noreferrer" target="_blank" href={project.server}>
                                    Server
                                </a>
                            </button>
                        )}

                        <button className="px-4 py-2 rounded-lg bg-slate-800/50 text-rose-300 hover:bg-slate-700/50 hover:text-rose-200 transition-all duration-300 font-medium border border-slate-700/50 hover:border-rose-500/30 backdrop-blur-sm flex items-center gap-2 group">
                            <FileCode className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <a rel="noreferrer" target="_blank" href={project.client}>
                                Client
                            </a>
                        </button>

                        <button className="px-4 py-2 rounded-lg bg-slate-800/50 text-teal-300 hover:bg-slate-700/50 hover:text-teal-200 transition-all duration-300 font-medium border border-slate-700/50 hover:border-teal-500/30 backdrop-blur-sm flex items-center gap-2 group">
                            <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            <a rel="noreferrer" target="_blank" href={project.live}>
                                Live
                            </a>
                        </button>
                    </div>
                </div>
                <div className='space-x-3 text-xs md:text-base'>
                </div>

                <div className={`${styles.shine} pointer-events-none`}></div>
                <div className={`${styles.background} w-1/2 -ml-20 pointer-events-none`}>
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


            </Card>
        </div >

    )
}
