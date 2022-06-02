import React from 'react'
export default function Modal({ workDetails }) {
    const { tech, desc, live, client, server, name } = workDetails
    return (


        <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{name}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <p className='text-capitalize'>{desc}</p>
                        <p className='text-capitalize'>{tech}</p>
                    </div>
                    <div className="modal-footer">
                        <a target="_blank" rel="noreferrer" href={live} className="btn btn-outline-dark">Live</a>

                        {server && <a target="_blank" rel="noreferrer" href={server} className="btn btn-outline-dark">Server</a>}
                        {client && <a target="_blank" rel="noreferrer" href={client} className="btn btn-outline-dark">Client</a>}
                        <button type="button" className="btn btn-outline-dark" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>

    )
}
