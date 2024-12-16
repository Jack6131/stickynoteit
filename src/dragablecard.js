import React, { useState, useRef, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import TextField from '@mui/material/TextField';

const DraggableCard = ({ id, initialX, initialY, header, content, updateCard }) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [cardHeader, setCardHeader] = useState(header || '');
  const [cardContent, setCardContent] = useState(content || '');
  const [isBold, setIsBold] = useState(false);
  const editorRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // Handle Bold Button
  const toggleBold = () => {
    setIsBold(!isBold);
    document.execCommand('bold', false, null);  // Apply bold formatting
    const updatedContent = editorRef.current.innerHTML;
    setCardContent(updatedContent);  // Update content with the bold tag applied
    updateCard(id, cardHeader, updatedContent);  // Pass content to the parent
  };

  // Handle Dragging
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

  const handleHeaderChange = (e) => {
    setCardHeader(e.target.value);
    updateCard(id, e.target.value, cardContent);  // Update parent with new header
  };

  // Handle Content Change (Plain Text Parsing)
  const handleContentChange = () => {
    const contentHtml = editorRef.current.innerHTML;  // Get the HTML content
    const plainTextContent = convertToPlainText(contentHtml);  // Convert to plain text
    setCardContent(plainTextContent);  // Set the content in state
    updateCard(id, cardHeader, plainTextContent);  // Update the parent component
  };

  // Convert HTML content to plain text (Remove all HTML tags)
  const convertToPlainText = (html) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;  // Set innerHTML to parse HTML content
    return tempDiv.innerText || tempDiv.textContent || '';  // Return plain text
  };

  // Prevent Copying Rich Text (Force Plain Text)
  const handleCopy = (e) => {
    e.preventDefault();  // Prevent default copy behavior

    // Get the plain text content from the editor
    const plainText = convertToPlainText(editorRef.current.innerHTML);

    // Use the Clipboard API to set the copied text as plain text
    e.clipboardData.setData('text/plain', plainText);
  };

  // Prevent Pasting Rich Text (Force Plain Text)
  const handlePaste = (e) => {
    e.preventDefault();  // Prevent default paste behavior

    // Get the plain text from clipboard data
    const plainText = e.clipboardData.getData('text/plain');

    // Insert plain text into the contenteditable div
    document.execCommand('insertHTML', false, plainText);

    // Immediately update the state after pasting to ensure it's plain text
    setCardContent(plainText);
    updateCard(id, cardHeader, plainText);  // Update the parent with the new plain text content
  };

  // Listen for copy and paste events to ensure only plain text
  useEffect(() => {
    const editor = editorRef.current;

    editor.addEventListener('copy', handleCopy);
    editor.addEventListener('paste', handlePaste);

    return () => {
      editor.removeEventListener('copy', handleCopy);
      editor.removeEventListener('paste', handlePaste);
    };
  }, []);

  useEffect(() => {
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

      <TextField
        label="Header"
        variant="outlined"
        fullWidth
        value={cardHeader}
        onChange={handleHeaderChange}
        style={{ marginBottom: '10px', marginTop: '10px', zIndex: 0 }}
      />

      <div
        contentEditable
        ref={editorRef}
        onInput={handleContentChange}
        style={{
          minHeight: '100px',
          textAlign: 'center',
          border: '1px solid #ddd',
          padding: '10px',
          outline: 'none',
        }}
      >
        
      </div>

      <IconButton onClick={toggleBold} color={isBold ? 'primary' : 'default'}>
        <FormatBoldIcon />
      </IconButton>
    </div>
  );
};

export default DraggableCard;
