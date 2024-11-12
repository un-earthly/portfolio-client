import React from 'react';

const CloseSVG = () => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="30" className="rounded-full bg-black">
            <line x1="7" y1="7" x2="17" y2="17" stroke="#fff" strokeWidth="2" className="w-6 h-6" />
            <line x1="7" y1="17" x2="17" y2="7" stroke="#fff" strokeWidth="2" className="w-6 h-6" />
        </svg>
    );
};

export default CloseSVG;
