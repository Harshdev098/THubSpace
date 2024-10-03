import React, { useEffect, useRef } from 'react';

export default function Whiteboord() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        let drawing = false;

        const startDrawing = () => { drawing = true; };
        const stopDrawing = () => { drawing = false; context.beginPath(); };
        const draw = (event) => {
            if (!drawing) return;
            context.lineWidth = 5;
            context.lineCap = 'round';
            context.strokeStyle = 'black';
            context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
            context.stroke();
            context.beginPath();
            context.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
            // socket.emit('drawing', { x: event.clientX, y: event.clientY });
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mousemove', draw);

        return () => {
            canvas.removeEventListener('mousedown', startDrawing);
            canvas.removeEventListener('mouseup', stopDrawing);
            canvas.removeEventListener('mousemove', draw);
        };
    }, []);
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);
    };
    return (
        <div>
            <canvas ref={canvasRef} id="whiteboard" width="800" height="600"></canvas>
            <button onClick={clearCanvas}>Clear Whiteboard</button>
        </div>
    );
}
