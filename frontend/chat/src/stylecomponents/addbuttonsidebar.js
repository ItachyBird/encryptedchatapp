import React from 'react';

const AddButtonSidebar = () => {
  return (
    <>
      <style>{`
        .add-button-container {
          display: flex;
          justify-content: center;
          padding: 1rem;
        }

        .cta {
          position: relative;
          margin: auto;
          padding: 12px 18px;
          transition: all 0.2s ease;
          border: none;
          background: none;
          cursor: pointer;
        }

        .cta:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          display: block;
          border-radius: 50px;
          background: #b1dae7;
          width: 45px;
          height: 45px;
          transition: all 0.3s ease;
        }

        .cta span {
          position: relative;
          font-family: "Ubuntu", sans-serif;
          font-size: 18px;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #234567;
        }

        .cta svg {
          position: relative;
          top: 0;
          margin-left: 10px;
          fill: none;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke: #234567;
          stroke-width: 2;
          transform: translateX(-5px);
          transition: all 0.3s ease;
        }

        .cta:hover:before {
          width: 100%;
          background: #b1dae7;
        }

        .cta:hover svg {
          transform: translateX(0);
        }

        .cta:active {
          transform: scale(0.95);
        }
      `}</style>
      <div className="add-button-container">
        <button className="cta">
          <span>Hover me</span>
          <svg width="15px" height="10px" viewBox="0 0 13 10">
            <path d="M1,5 L11,5"></path>
            <polyline points="8 1 12 5 8 9"></polyline>
          </svg>
        </button>
      </div>
    </>
  );
};

export default AddButtonSidebar;
