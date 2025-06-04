export function Legend({children, ...params}) {
    return <legend className="contents"><div {...params}>{children}</div></legend>
}
