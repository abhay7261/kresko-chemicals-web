import React, { useState, useEffect } from 'react';

export default function EditableText({ id, defaultText, style, className, tag: Tag = 'span' }) {
  const [text, setText] = useState(defaultText);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Load from localstorage if modified
    const savedTexts = JSON.parse(localStorage.getItem('kresko_editable_texts') || '{}');
    if (savedTexts[id] !== undefined) {
      setText(savedTexts[id]);
    } else {
      setText(defaultText);
    }

    // Check login status
    const checkLogin = () => {
      setIsAdmin(sessionStorage.getItem('isAdminLoggedIn') === 'true');
    };
    checkLogin();

    // Listen for status changes
    window.addEventListener('adminLoginStatusChange', checkLogin);
    return () => window.removeEventListener('adminLoginStatusChange', checkLogin);
  }, [id, defaultText]);

  const handleBlur = (e) => {
    const newText = e.target.innerText.trim();
    if (newText !== undefined && newText !== text) {
      setText(newText);
      const savedTexts = JSON.parse(localStorage.getItem('kresko_editable_texts') || '{}');
      savedTexts[id] = newText;
      localStorage.setItem('kresko_editable_texts', JSON.stringify(savedTexts));
    }
  };

  if (isAdmin) {
    return (
      <Tag 
        contentEditable
        suppressContentEditableWarning
        onBlur={handleBlur}
        style={{ 
          outline: '1px dashed var(--color-accent)', 
          padding: '2px', 
          cursor: 'text',
          position: 'relative',
          display: 'inline-block',
          minWidth: '20px',
          ...style 
        }}
        className={`${className || ''} admin-editable`}
        title="Admin: Click to edit text inline"
      >
        {text}
      </Tag>
    );
  }

  return <Tag style={style} className={className}>{text}</Tag>;
}
