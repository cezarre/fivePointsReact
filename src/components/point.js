import React, { useState, useEffect } from 'react';
import { Circle } from 'react-konva';


const Point = (props) => {
    const [color, setColor] = useState("gray");
    const { x, y, ...rest} = props;

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(x, y);
        }
        console.log(`Clicked (${x}, ${y})`);
    }

    return (
        <Circle
        x={x}
        y={y}
        radius={5}
        fill={null}
        stroke={color}
        onClick={handleClick}
        />
     );
}

export default Point;