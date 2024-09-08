const CircularProgressBar = ({ percent = 0, size = 50, strokeWidth = 5 }) => {
    const radius = size / 2 - strokeWidth;
    const perimeter = 2 * Math.PI * radius;
    const strokeOffset = ((100 - percent) / 100) * perimeter;
    return (
        <div>
            <svg width={size} height={size}>
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    stroke="#d5d6d7"
                    strokeWidth={strokeWidth}
                />
                <circle
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    fill="none"
                    stroke="green"
                    strokeWidth={strokeWidth}
                    strokeDasharray={perimeter}
                    strokeDashoffset={strokeOffset}
                    transform="rotate(-90)"
                    style={{ transformOrigin: "center" }}
                />
                <text
                    x={size / 2}
                    y={size / 2}
                    fill="white"
                    alignmentBaseline="middle"
                    textAnchor="middle"
                    fontSize={16}
                >
                    {percent}
                </text>
            </svg>
        </div>
    );
};
export default CircularProgressBar;
