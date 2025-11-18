import React from 'react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number | string;
}

const Drawer = ({ isOpen, onClose, children, width = 96 }: DrawerProps) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-end transition-transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50'
        onClick={onClose}
      ></div>

      {/* Drawer Content */}
      <div
        className={`w-96 bg-white  border-l border-gray-200 dark:border-gray-600 dark:bg-gray-800 shadow-lg h-full p-6 overflow-y-auto relative`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
        >
          ✕
        </button>

        {/* Drawer Content */}
        <div className='mt-8'>{children}</div>
      </div>
    </div>
  );
};

export default Drawer;
