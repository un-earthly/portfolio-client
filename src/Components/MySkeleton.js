import React from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import ScrollAnimation from 'react-animate-on-scroll';
export default function MySkeleton() {
    return (
        <ScrollAnimation animateIn="animate__fadeInUp" duration={2}>

            <SkeletonTheme width="100%" baseColor='gray' highlightColor='lightgray'>
                <Skeleton height={340} />
                <div style={{ textAlign: "center" }}>
                    <Skeleton height={70} width="25%" />
                    <Skeleton borderRadius={400} width="50%" />
                </div>
            </SkeletonTheme>
        </ScrollAnimation>
    )
}
