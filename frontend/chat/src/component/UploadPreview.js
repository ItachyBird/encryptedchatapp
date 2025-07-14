import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function UploadPreview({ file, setFile, sendMessage }) {
  const imageUrl = URL.createObjectURL(file);
  const buttonRef = useRef();
  const textRef = useRef();
  const tickRef = useRef();
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (clicked) return;
    setClicked(true);

    const tl = gsap.timeline();

    // Bounce + Morph to circle
    tl.to(buttonRef.current, {
      scale: 1.1,
      duration: 0.2,
      ease: 'power1.out',
    })
      .to(buttonRef.current, {
        borderRadius: '50%',
        width: 60,
        height: 60,
        padding: 0,
        duration: 0.4,
        ease: 'power2.out',
      })
      // Hide text
      .to(textRef.current, {
        opacity: 0,
        duration: 0.2,
      }, '<')
      // Show tick
      .fromTo(tickRef.current, {
        scale: 0,
        opacity: 0,
      }, {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: 'back.out(2)',
      }, '-=0.2');

    sendMessage(); // actual send
  };

  return (
    <div className="upload-preview">
      <button className="cancel-button" onClick={() => setFile(null)}>✕</button>
      <img src={imageUrl} alt="Preview" />
      <button className="send-button" ref={buttonRef} onClick={handleClick}>
        <span ref={textRef}>Send</span>
        <span className="tick" ref={tickRef}>✔</span>
      </button>
    </div>
  );
}
