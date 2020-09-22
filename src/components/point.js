import React, { useState, useEffect } from 'react';
import { Circle, Group, Layer } from 'react-konva';


const Point = (props) => {
    const [color, setColor] = useState("gray");
    const { x, y, ...rest} = props;

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(x, y);
        }
    }

    return (
        <Group>
            <Circle
            x={x}
            y={y}
            radius={5}
            fill={null}
            stroke={color}
            />
            <Circle
            x={x}
            y={y}
            radius={10}
            fill={null}
            onClick={handleClick}
            />
        </Group>
     );
}

export default Point;