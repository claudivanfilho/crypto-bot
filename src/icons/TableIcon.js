import React from 'react'
import PropTypes from 'prop-types'

export default function TableIcon({ size = 30, color = 'black', className, title }) {
  return (
    <svg
      className={className}
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 1000 1000"
      enableBackground="new 0 0 1000 1000" xmlSpace="preserve"
    >
      <title>{title}</title>
      <g><g><g><g>
        <path
          fill={color}
          d="M988.9,98.7c-2.6-31.5-28.1-58.1-60.1-58.1H71.2c-32,0-57.5,26.5-60.2,58.1h-1v799.4c0,33.8,27.4,61.2,61.2,61.2h857.5c33.8,0,61.2-27.4,61.2-61.2V98.7H988.9z M316.2,898.1h-245V714.4h245V898.1z M316.2,658.2h-245V469.4h245V658.2z M316.2,408.1h-245V224.4h245V408.1z M622.5,898.1h-245V714.4h245V898.1z M622.5,658.2h-245V469.4h245V658.2z M622.5,408.1h-245V224.4h245V408.1z M928.8,898.1h-245V714.4h245V898.1z M928.8,658.2h-245V469.4h245V658.2z M928.8,408.1h-245V224.4h245V408.1z"
        />
      </g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></g>
    </svg>
  )
}

TableIcon.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
}

