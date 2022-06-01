import React from 'react'

export default function Skill({ skill }) {
    const { heading, exp, frameworks, lang } = skill
    return (
        <div>
            <h5>{heading}</h5>
            <p>
                {exp}
            </p>
            <p>

                {lang && " Languages –"} <strong>{lang}</strong>
            </p>
            <p>

                Frameworks – <strong>{frameworks}</strong></p>
        </div >
    )
}
