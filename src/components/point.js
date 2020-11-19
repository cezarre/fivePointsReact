import React, { useState, useEffect } from 'react';
import { Circle, Group } from 'react-konva';
import configData from "./../config.json";


const Point = React.memo(props => {
    const [color, setColor] = useState(configData.POINT.STROKE_COLOR_UNFILLED);
    const { x, y, listening, status } = props;

    const handleClick = () => {
        if (props.onClick) {
            if (!props.onClick(x, y)) {
                return;
            }
        }
    }

    useEffect(() => {
        if (status === 'filled') {
            setColor(configData.POINT.STROKE_COLOR_FILLED);
        } else if (status === 'origin') {
            setColor(configData.POINT.STROKE_COLOR_ORIGIN);
        } else {
            setColor(configData.POINT.STROKE_COLOR_UNFILLED);
        }
    }, [status]);

    return (
        <Group>
            <Circle
            x={x}
            y={y}
            radius={configData.POINT.RADIUS}
            fill={null}
            stroke={color}
            />
            <Circle
            x={x}
            y={y}
            radius={configData.POINT.MOUSE_LISTENER_RADIUS}
            fill={null}
            listening={listening}
            onClick={handleClick}
            />
        </Group>
     );
});

const shouldNotUpdate = (prevProps, nextProps) => {
    return false; //TEMPORARY ; NOT OPTIMIZED ; WORKS EVERY TIME!!!!!!!!!!
}

export default React.memo(Point, shouldNotUpdate);

