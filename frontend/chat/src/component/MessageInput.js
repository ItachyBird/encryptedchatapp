import React from 'react';
import UploadPreview from './UploadPreview';

export default function MessageInput({
  message,
  setMessage,
  sendMessage,
  file,
  setFile,
  darkMode
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Show image preview if file is selected
  if (file) {
    return (
      <UploadPreview
        file={file}
        setFile={setFile}
        sendMessage={sendMessage}
      />
    );
  }

  return (
    <div className={`input-panel ${darkMode ? 'dark' : 'light'}`}>
      <label className="file-upload-label">
        📎
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const selected = e.target.files[0];
            if (selected) {
              setFile(selected);
              setMessage('');
            }
          }}
        />
      </label>
      <textarea
        placeholder="Type message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={!!file}
        onKeyDown={handleKeyDown}
        rows={1}
        maxLength={1000}
      />
      <button
        onClick={sendMessage}
        disabled={!message.trim() && !file}
        className="send-button"
      >
        ➤
      </button>
    </div>
  );
}
