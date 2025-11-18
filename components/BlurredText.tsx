'use client';

import React, { useState } from 'react';
import { Modal } from 'flowbite-react';

const BlurredText = ({ text }: { text: string }) => {
  const [isBlurred, setIsBlurred] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const handleShowText = () => {
    setIsBlurred(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      {/* Blurred text */}
      <p className={isBlurred ? 'blurred w-64 truncate' : ''}>{text}</p>

      {/* Show button overlay */}
      {isBlurred && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setOpenModal(true)}
            className='text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-3 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 me-2'
          >
            Preview
          </button>
        </div>
      )}

      <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Body Preview</Modal.Header>
        <Modal.Body>
          <div
            className='space-y-6'
            dangerouslySetInnerHTML={{ __html: text }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default BlurredText;
