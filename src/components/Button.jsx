export const Button = ({children, className="", ...props}) => {
    return <button
        className={`px-4 border-2 rounded-sm enabled:cursor-pointer disabled:opacity-50 ${className}`}
        {...props }>
            {children}
    </button>
}
