// components/ChatHeader.js
import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';

export default function ChatHeader({
  receiver,
  
  setSidebarOpen,
  sidebarOpen,
  darkMode,
  removeFriend
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`chat-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</div>
      {receiver ? (
        <div className="chat-header-content">
          <div className="chat-header-left">
            <strong>{receiver}</strong>
           
          </div>

          <div className="chat-header-right" ref={dropdownRef}>
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="ellipsis-icon"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <div className={`dropdown-menu ${darkMode ? 'dark' : ''}`}>
                <button onClick={() => {
                  removeFriend(receiver);
                  setMenuOpen(false);
                }}>
                  Remove Friend
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <span>WELCOME</span>
      )}
    </div>
  );
}
