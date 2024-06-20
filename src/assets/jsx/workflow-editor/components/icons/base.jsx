export default function BaseIcon({children, size}) {
    return (
        <span className="publishpress-icon" style={{width: `${size}px`, height: `${size}px`, display: 'inline-block'}}>
            {children}
        </span>
    )
}
