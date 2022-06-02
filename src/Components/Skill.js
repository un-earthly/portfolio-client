import React from 'react'

export default function Skill({ skill }) {
    const { name, desc, frameworks, lang } = skill
    return (
        <div>
            <h5>{name}</h5>
            <p>
                {desc}
            </p>
            <p>

                {lang && " Languages –"} <strong>{lang}</strong>
            </p>
            <p>

                Frameworks – <strong>{frameworks}</strong></p>
        </div >
    )
}
