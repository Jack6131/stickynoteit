import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextField from '@mui/material/TextField';

const DraggableCard = ({ id, initialX, initialY }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isBold, setIsBold] = useState(false);
  const editorRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const toggleBold = () => {
    setIsBold(!isBold);
    if (editorRef.current) {
      document.execCommand('bold', false, null);
    }
  };

  const handleMouseDown = (e) => {
    if (e.target !== editorRef.current.querySelector('.draggable')) return;

    e.preventDefault();
    const rect = editorRef.current.getBoundingClientRect();
    dragOffset.current.x = e.clientX - rect.left;
    dragOffset.current.y = e.clientY - rect.top;
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newX = e.clientX - dragOffset.current.x;
      const newY = e.clientY - dragOffset.current.y;
      setPosition({ x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  React.useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      ref={editorRef}
      onMouseDown={handleMouseDown}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        border: '1px solid #ccc',
        width: '300px',
        padding: '10px',
        backgroundColor: '#f9f9f9',
        
      }}
    >
      {/* Draggable top area */}
      <div
        className="draggable"
        style={{
          height: '30px',
          backgroundColor: '#4CAF50',
          cursor: 'move',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          fontWeight: 'bold',
        }}
      >
        Drag Here
      </div>

      {/* Header TextField */}
      <TextField
        label="Header"
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px', marginTop: '10px',zIndex:0}}
      />

      {/* Content Editable Div */}
      <div
        contentEditable
        style={{
          minHeight: '100px',
          textAlign: 'center',
          border: '1px solid #ddd',
          padding: '10px',
          outline: 'none',
        }}
      >
        
      </div>

      {/* Bold Toggle Button */}
      <IconButton onClick={toggleBold} color={isBold ? 'primary' : 'default'}>
        <FormatBoldIcon />
      </IconButton>
    </div>
  );
};

export default DraggableCard;
