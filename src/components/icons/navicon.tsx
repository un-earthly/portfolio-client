import React from 'react'
interface Props {
  handler: React.MouseEventHandler<HTMLDivElement>
}
const NavIcon = ({ handler }: Props) => {
  return (
    <div onClick={handler}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="30" height="24">
        <rect x="0" y="5" width="30" height="3" fill="#fff" />
        <rect x="0" y="11" width="10" height="3" fill="#fff" />
      </svg>

    </div>
  )
}

export default NavIcon
