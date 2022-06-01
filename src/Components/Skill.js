import React from 'react'

export default function Skill({ heading, exp, frameworks, lang, animation }) {
    return (
        <div className={`content animate__animated animate__${animation} `}>
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
