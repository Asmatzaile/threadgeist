export function Dialog({className, children, ...props}){
    const baseStyles = "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-xl border-2 shadow-[2px_2px]";
    return <dialog className={[baseStyles, className].join(" ")} {...props} >
        {children}
    </dialog>
}
