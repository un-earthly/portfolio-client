import React from 'react'

export default function Skill({ heading, exp, frameworks, lang }) {
    return (
        <div className="content">
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
