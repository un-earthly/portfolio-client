import React from 'react'

export default function SkeletonCard() {
    return (
        <div className="p-4 mx-2 my-4 w-full bg-[#18181B] animate-pulse rounded-lg shadow-md">
            <div className="relative h-80">
                <div className="bg-gray-800 h-full w-full absolute animate-pulse"></div>
                <div className="opacity-20" />
            </div>
            <div className="text-center w-full space-y-3 mt-4">
                <p className="bg-gray-800 h-10 w-2/3 mx-auto"></p>
                <p className="bg-gray-800 h-14"></p>
                <p className="bg-gray-800 h-10 w-10/12 mx-auto"><span className="text-gray-300"></span></p>
                <div className="flex items-center justify-center my-5 space-x-4">
                    <button className="bg-gray-800 w-20 h-10" disabled>
                    </button>
                    <button className="bg-gray-800 w-20 h-10" disabled>
                    </button>
                    <button className="bg-gray-800 w-20 h-10" disabled>
                    </button>
                </div>
            </div>
            <div className="space-x-3 text-xs md:text-base">
            </div>
        </div>

    )
}
