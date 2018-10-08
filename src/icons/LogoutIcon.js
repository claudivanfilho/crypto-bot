import React from 'react'
import PropTypes from 'prop-types'

export default function LogputIcon({ size = 30, color = 'black', className, title }) {
  return (
    <svg
      className={className}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      enableBackground="new 0 0 32 32"
    >
      <title>{title}</title>
      <g id="background">
        <rect
          fill="none"
          width="32"
          height="32"
          id="rect3022" />
      </g>
      <path
        fill={color}
        id="polygon3027"
        d="m 18,24 0,4 -14,0 0,-24 14,0 0,4 4,0 0,-8 -22,0 0,32 22,0 0,-8 z m -6,-4.003 0,-8 12,0 0,-4 8,8 -8,8 0,-4 z"
      />
    </svg>

  )
}

LogputIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
}

