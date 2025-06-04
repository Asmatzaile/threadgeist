export const Button = ({children, variant="secondary", className="", ...props}) => {
    const baseStyles = "px-4 border-2 rounded-sm enabled:cursor-pointer disabled:opacity-50 enabled:hover:scale-101 transition-all duration-50 shadow-[2px_2px_0_currentColor]" ;
    const variants = {
        primary: "bg-yellow-500 enabled:hover:bg-yellow-400",
        secondary: "bg-white enabled:hover:bg-yellow-200"
    }
    
    return <button
        className={[baseStyles, variants[variant], className].join(" ")}
        {...props }>
            {children}
    </button>
}
