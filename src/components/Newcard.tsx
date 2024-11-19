import React from 'react'
import styles from './newcard.module.scss'
import { ProjectInterface } from '../interface/ProjectInterface'
import { ArrowUpRight, ExternalLink, FileCode, Globe, Server } from 'lucide-react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import Link from 'next/link'
interface Props {
    project: ProjectInterface
}
export default function Newcard({ project }: Props) {
    return (
        <div>
            {/* <Card className={`${styles.card} grid grid-cols-5 w-2/3 mx-auto bg-gradient-to-br from-bg/10 to-bg/5 text-gray-300`}>
                <div className="flex place-content-center py-3 col-span-2">
                    <img className='opacity-20 h-32' alt="project" src={project.img} />
                </div>

                <div className="col-span-3">
                    <p className='text-xs lg:text-xl  font-semibold'>{project.name}</p>
                    <p className='text-xs  '>{project.desc}</p>
                    
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


            </Card> */}
            <Card
                key={project._id}
                className="group relative overflow-hidden bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/30 via-slate-900/30 to-blue-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <Link href={`/case-study/${project._id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View case study for {project.name}</span>
                </Link>

                <CardContent className="relative z-10 p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="relative overflow-hidden rounded-lg">
                            <img
                                src={project.img}
                                alt={`${project.name} preview`}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="relative">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="text-xl font-bold text-gray-100">{project.name}</h3>
                                <div className="p-2 rounded-full bg-slate-800/50 group-hover:bg-cyan-500/20 transition-colors">
                                    <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                                </div>
                            </div>

                            <p className="text-gray-400 mb-4">
                                {project.desc}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tech}
                            </div>


                            <div className="flex gap-4 relative z-20">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group-hover:text-cyan-400 group-hover:border-cyan-400/50"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(project.live, '_blank');
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Live
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="group-hover:text-cyan-400 group-hover:border-cyan-400/50"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        window.open(project?.server, '_blank');
                                    }}
                                >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Source Code
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span>View Case Study</span>
                        <ArrowUpRight className="h-4 w-4" />
                    </div>
                </CardContent>

                <div className="absolute inset-0 border border-cyan-500/0 group-hover:border-cyan-500/20 rounded-lg transition-colors duration-300" />
            </Card>
        </div >

    )
}
