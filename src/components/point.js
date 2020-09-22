import React, { useState, useEffect, useRef } from 'react';
import { Circle, Group, Layer } from 'react-konva';


const Point = React.memo((props) => {
    const [color, setColor] = useState("gray");
    const { x, y, ...rest} = props;
    const smallCircle = useRef(null);

    const handleClick = () => {
        if (props.onClick) {
            props.onClick(x, y);
        }
        console.log(smallCircle);
    }


    return (
        <Group>
            <Circle
            x={x}
            y={y}
            radius={5}
            fill={null}
            stroke={color}
            ref={smallCircle}
            />
            <Circle
            x={x}
            y={y}
            radius={10}
            fill={null}
            listening={props.listening}
            onClick={handleClick}
            />
        </Group>
     );
});

export default Point;