import React from 'react'

export default function Skill({ skill }) {
    const { name, desc, frameworks } = skill
    return (
        <div data-skill>
            <h5>{name}</h5>
            <p>
                {desc}
            </p>

            <p>
                Technologies - <strong>{frameworks}</strong>
            </p>
        </div >
    )
}
