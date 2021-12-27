const ColoredLine = ({ color }: ColoredLinePropsType) => {
    return (
        <hr
        className="w-1/3 opacity-50 mt-6 "
        style={{
        color: color,
        backgroundColor: color,
        height: .5,
        borderColor: color,
        borderTop: 0,
        }} />
    )
};
type ColoredLinePropsType = {
    color : string
}
export default ColoredLine