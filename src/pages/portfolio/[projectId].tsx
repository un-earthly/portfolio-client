import { useRouter } from 'next/router'
import React from 'react'

export default function PortfolioProject() {
    const { projectId } = useRouter().query
    return (
        <div>{projectId}</div>
    )
}
