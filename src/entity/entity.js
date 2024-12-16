import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextField from '@mui/material/TextField';

function TextEditor() {
  const [isBold, setIsBold] = useState(false);
  const editorRef = useRef(null);

  // Toggle the bold state
  const toggleBold = () => {
    setIsBold(!isBold);
    if (editorRef.current) {
      document.execCommand('bold', false, null); // Apply the bold to selected text
    }
  };

  // Handle content change (can be used to update state if needed)
  const handleContentChange = () => {
    // Optional: You can track the content here if needed.
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        width: '300px',
        padding: '10px',
        marginBottom: '10px',
      }}
    >
      {/* Header TextField */}
      <TextField
        label="Header"
        variant="outlined"
        fullWidth
        style={{ marginBottom: '10px' }}
      />

      {/* Content Editable Div */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        style={{
          minHeight: '100px',
          textAlign: 'center',
          border: '1px solid #ddd',
          padding: '10px',
          outline: 'none', // Prevent the outline from appearing when clicked
        }}
      >
        Type here...
      </div>

      {/* Bold Toggle Button */}
      <IconButton 
        onClick={toggleBold} 
        color={isBold ? "primary" : "default"}
      >
        <FormatBoldIcon />
      </IconButton>
    </div>
  );
}

export default TextEditor;
