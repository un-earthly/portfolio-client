import React from 'react'

export default function Skill({ skill }) {
    const { name, desc, frameworks, lang } = skill
    return (
        <div data-skill>
            <h5>{name}</h5>
            <p>
                {desc}
            </p>
            <p>

                {lang && " Languages –"} <strong>{lang}</strong>
            </p>
            <p>
                {lang && " Languages –"} <strong>{lang}</strong>
                {frameworks && " Frameworks –"}  <strong>{frameworks}</strong>

            </p>
        </div >
    )
}
