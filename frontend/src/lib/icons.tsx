export const ClickIcon = ({ width = 18, height = 18 }) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="hidden h-4 w-4 sm:block"
    >
      <g fill="currentColor">
        <path
          d="M8.095,7.778l7.314,2.51c.222,.076,.226,.388,.007,.47l-3.279,1.233c-.067,.025-.121,.079-.146,.146l-1.233,3.279c-.083,.219-.394,.215-.47-.007l-2.51-7.314c-.068-.197,.121-.385,.318-.318Z"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="12.031"
          x2="16.243"
          y1="12.031"
          y2="16.243"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="7.75"
          x2="7.75"
          y1="1.75"
          y2="3.75"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="11.993"
          x2="10.578"
          y1="3.507"
          y2="4.922"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="3.507"
          x2="4.922"
          y1="11.993"
          y2="10.578"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="1.75"
          x2="3.75"
          y1="7.75"
          y2="7.75"
        ></line>
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="3.507"
          x2="4.922"
          y1="3.507"
          y2="4.922"
        ></line>
      </g>
    </svg>
  )
}

export const RedirectIcon = ({ width = 18, height = 18 }) => {
  return (
    <svg
      className="inline"
      data-testid="geist-icon"
      height={height}
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width={width}
      style={{ color: 'currentcolor' }}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.5 9.75V11.25C11.5 11.3881 11.3881 11.5 11.25 11.5H4.75C4.61193 11.5 4.5 11.3881 4.5 11.25L4.5 4.75C4.5 4.61193 4.61193 4.5 4.75 4.5H6.25H7V3H6.25H4.75C3.7835 3 3 3.7835 3 4.75V11.25C3 12.2165 3.7835 13 4.75 13H11.25C12.2165 13 13 12.2165 13 11.25V9.75V9H11.5V9.75ZM8.5 3H9.25H12.2495C12.6637 3 12.9995 3.33579 12.9995 3.75V6.75V7.5H11.4995V6.75V5.56066L8.53033 8.52978L8 9.06011L6.93934 7.99945L7.46967 7.46912L10.4388 4.5H9.25H8.5V3Z"
        fill="currentColor"
      ></path>
    </svg>
  )
}

export const SearchIcon = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-neutral-400"
    >
      <g fill="currentColor">
        <line
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          x1="15.25"
          x2="11.285"
          y1="15.25"
          y2="11.285"
        ></line>
        <circle
          cx="7.75"
          cy="7.75"
          fill="none"
          r="5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></circle>
      </g>
    </svg>
  )
}

export const CopyIcon = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return (
    <svg
      fill="none"
      shapeRendering="geometricPrecision"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={width}
      height={height}
      className="h-3.5 w-3.5"
    >
      <path d="M8 17.929H6c-1.105 0-2-.912-2-2.036V5.036C4 3.91 4.895 3 6 3h8c1.105 0 2 .911 2 2.036v1.866m-6 .17h8c1.105 0 2 .91 2 2.035v10.857C20 21.09 19.105 22 18 22h-8c-1.105 0-2-.911-2-2.036V9.107c0-1.124.895-2.036 2-2.036z"></path>
    </svg>
  )
}

export const GotoIcon = ({
  width,
  height,
}: {
  width: number
  height: number
}) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 18 18"
      xmlns="http://www.w3.org/2000/svg"
      className="h-3 w-3 shrink-0 text-neutral-400"
    >
      <g fill="currentColor">
        <path
          d="M15.25,9.75H4.75c-1.105,0-2-.895-2-2V3.75"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></path>
        <polyline
          fill="none"
          points="11 5.5 15.25 9.75 11 14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        ></polyline>
      </g>
    </svg>
  )
}

export const MobileIcon = ({ width = 18, height = 18 }) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <rect
          x="7"
          y="3"
          width="10"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="10"
          y1="18"
          x2="14"
          y2="18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export const TabletIcon = ({ width = 18, height = 18 }) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <rect
          x="5"
          y="3"
          width="14"
          height="18"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="10"
          y1="18"
          x2="14"
          y2="18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}

export const DesktopIcon = ({ width = 18, height = 18 }) => {
  return (
    <svg
      height={height}
      width={width}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="currentColor">
        <rect
          x="2"
          y="4"
          width="20"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="8"
          y1="20"
          x2="16"
          y2="20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="12"
          y1="16"
          x2="12"
          y2="20"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
