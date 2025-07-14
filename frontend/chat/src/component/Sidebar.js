import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useTheme } from '../ThemeContext.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear,faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar({
  username = '',
  friends = [],
  receiver,
  setReceiver,
  searchUser,
  setSearchUser,
  addFriend,
  incomingRequests = [],
  acceptFriendRequest,
  rejectFriendRequest,
  sentRequests = [],
  cancelSentRequest,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [flipped, setFlipped] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const sortedFriends = [...friends];
  if (receiver && friends.includes(receiver)) {
    sortedFriends.splice(sortedFriends.indexOf(receiver), 1);
    sortedFriends.unshift(receiver);
  }

  const buttonRefs = useRef(new Map());
  const settingsBtnRef = useRef(null);

  useEffect(() => {
    buttonRefs.current.forEach((btn) => {
      gsap.set(btn, { scale: 1 });
    });
  }, [flipped]);

  const handleButtonHover = (e) => {
    gsap.to(e.currentTarget, { scale: 1.1, duration: 0.2 });
  };

  const handleButtonHoverOut = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.2 });
  };

  const animateRequestAction = (id, type, callback) => {
    const elem = document.getElementById(`request-item-${id}`);
    if (!elem) {
      callback(id);
      return;
    }

    let fill = document.createElement('div');
    fill.style.position = 'absolute';
    fill.style.top = 0;
    fill.style.left = 0;
    fill.style.width = '0%';
    fill.style.height = '100%';
    fill.style.zIndex = 0;
    fill.style.borderRadius = '4px';
    fill.style.pointerEvents = 'none';
    fill.style.backgroundColor =
      type === 'accept' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(239, 68, 68, 0.4)';
    fill.style.transition = 'width 0.5s ease';

    elem.style.position = 'relative';
    elem.insertBefore(fill, elem.firstChild);

    requestAnimationFrame(() => {
      fill.style.width = '100%';
      setTimeout(() => {
        gsap.to(elem, {
          opacity: 0,
          height: 0,
          marginBottom: 0,
          paddingTop: 0,
          paddingBottom: 0,
          duration: 0.5,
          onComplete: () => {
            callback(id);
          },
        });
      }, 600);
    });
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        !e.target.closest('.settings-dropdown') &&
        !e.target.closest('.settings-btn')
      ) {
        setSettingsOpen(false);
      }
    };
    if (settingsOpen) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [settingsOpen]);

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? 'open' : ''} ${darkMode ? 'dark' : 'light'}`}>
        <div className="sidebar-header">
          <h3>{username}'s Friends</h3>
          <div className="sidebar-header-buttons mobile-row" style={{ position: 'relative' }}>
            {/* Settings Button */}
            <button
              className="settings-btn"
              onClick={() => setSettingsOpen((prev) => !prev)}
              aria-label="Settings"
              title="Settings"
              ref={(el) => {
                if (el) {
                  buttonRefs.current.set('settings', el);
                  settingsBtnRef.current = el;
                }
              }}
              onMouseEnter={handleButtonHover}
              onMouseLeave={handleButtonHoverOut}
              type="button"
              style={{ position: 'relative', zIndex: 10 }}
            >
              <FontAwesomeIcon icon={faGear} />
            </button>

            {/* Close Button */}
<button
  className="close-sidebar-btn"
  onClick={() => setSidebarOpen(false)}
  aria-label="Close"
  title="Close"
  ref={(el) => el && buttonRefs.current.set('close', el)}
  onMouseEnter={handleButtonHover}
  onMouseLeave={handleButtonHoverOut}
  type="button"
>
  <FontAwesomeIcon icon={faXmark} />
</button>


            {/* Settings Dropdown */}
            {settingsOpen && (
              <div
                className="settings-dropdown"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 4px)', // directly below button with small gap
                  right: 0,
                  background: 'var(--main-comp-light)',
                  border: '1px solid var(--border-light)',
                  borderRadius: '6px',
                  padding: '8px',
                  zIndex: 9999,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  userSelect: 'none',
                  minWidth: '140px',
                }}
              >
                <button
                  className="toggle-theme-btn"
                  onClick={() => {
                    toggleTheme();
                    setSettingsOpen(false);
                  }}
                  aria-label="Toggle dark/light mode"
                  title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                  type="button"
                  style={{
                    width: '100%',
                    background: 'none',
                    border: 'none',
                    padding: '8px 12px',
                    textAlign: 'left',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    color: 'var(--accent-color)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--border-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="friends-list-section">
          <ul className="friend-list">
            {sortedFriends.map((friend) => (
              <li
                key={friend}
                className={friend === receiver ? 'active' : ''}
                onClick={() => {
                  setReceiver(friend);
                  setSidebarOpen(false);
                  setFlipped(null);
                }}
              >
                <span>{friend}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={`requests-card ${flipped ? 'flipped' : ''}`}>
          <div className="card-inner">
            <div className="card-front">
              <div className="add-friend-input">
                <input
                  type="text"
                  placeholder="Add friend by username"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
                <button
                  id="unique-hover-button"
                  onClick={() => {
                    addFriend(searchUser);
                  }}
                  ref={(el) => el && buttonRefs.current.set('addFriend', el)}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonHoverOut}
                >
                  Add
                </button>
              </div>
              <div className="requests-buttons">
                <button
                  className={flipped === 'received' ? 'active' : ''}
                  onClick={() => setFlipped(flipped === 'received' ? null : 'received')}
                  ref={(el) => el && buttonRefs.current.set('btnReceived', el)}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonHoverOut}
                >
                  Friend Requests
                </button>
                <button
                  className={flipped === 'sent' ? 'active' : ''}
                  onClick={() => setFlipped(flipped === 'sent' ? null : 'sent')}
                  ref={(el) => el && buttonRefs.current.set('btnSent', el)}
                  onMouseEnter={handleButtonHover}
                  onMouseLeave={handleButtonHoverOut}
                >
                  Sent Requests
                </button>
              </div>
            </div>

            <div className="card-back">
              {flipped === 'received' && (
                <div className="received-requests-section">
                  <h4>Requests</h4>
                  {incomingRequests.length > 0 ? (
                    <ul className="friend-requests">
                      {incomingRequests.map((req) => (
                        <li
                          key={req}
                          id={`request-item-${req}`}
                          className="request-item"
                          style={{ position: 'relative', overflow: 'hidden' }}
                        >
                          <span>{req}</span>
                          <button
                            onClick={() => animateRequestAction(req, 'accept', acceptFriendRequest)}
                            title="Accept"
                            style={{
                              fontSize: '14px',
                              marginLeft: '8px',
                              color: 'green',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              userSelect: 'none',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              background: 'transparent',
                              border: 'none',
                            }}
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => animateRequestAction(req, 'reject', rejectFriendRequest)}
                            title="Reject"
                            style={{
                              fontSize: '14px',
                              marginLeft: '4px',
                              color: 'red',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              userSelect: 'none',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              background: 'transparent',
                              border: 'none',
                            }}
                          >
                            ×
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No incoming friend requests</p>
                  )}
                  <button
                    className="back-btn"
                    onClick={() => setFlipped(null)}
                    ref={(el) => el && buttonRefs.current.set('backReceived', el)}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonHoverOut}
                  >
                    Back
                  </button>
                </div>
              )}
              {flipped === 'sent' && (
                <div className="sent-requests-section">
                  <h4>Requests</h4>
                  {sentRequests.length > 0 ? (
                    <ul className="sent-requests-list">
                      {sentRequests.map((req) => (
                        <li
                          key={req}
                          id={`request-item-${req}`}
                          className="sent-request-item"
                          style={{ position: 'relative', overflow: 'hidden' }}
                        >
                          <span>{req}</span>
                          <button
                            onClick={() => animateRequestAction(req, 'reject', cancelSentRequest)}
                            title="Cancel Request"
                            style={{
                              fontSize: '14px',
                              marginLeft: '8px',
                              color: 'red',
                              fontWeight: 'bold',
                              cursor: 'pointer',
                              userSelect: 'none',
                              padding: '2px 6px',
                              borderRadius: '3px',
                              background: 'transparent',
                              border: 'none',
                            }}
                          >
                            
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No sent requests</p>
                  )}
                  <button
                    className="back-btn"
                    onClick={() => setFlipped(null)}
                    ref={(el) => el && buttonRefs.current.set('backSent', el)}
                    onMouseEnter={handleButtonHover}
                    onMouseLeave={handleButtonHoverOut}
                  >
                    Back
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View Styles */}
      <style jsx>{`
        @media (max-width: 600px) {
          .sidebar-header-buttons.mobile-row {
            display: flex;
            gap: 8px;
          }
          .sidebar-header-buttons.mobile-row button {
            font-size: 1.1rem;
            padding: 6px 8px;
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </>
  );
}
