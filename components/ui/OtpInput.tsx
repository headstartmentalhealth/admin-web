'use client';

import React, { useState, useRef } from 'react';

const OTPInput = ({
  length = 6,
  onComplete,
}: {
  length?: number;
  onComplete?: (otp: string) => void;
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<Array<HTMLInputElement | null>>(
    Array(length).fill(null)
  );

  const triggerComplete = (digits: string[]) => {
    if (digits.every((digit) => digit !== '')) {
      onComplete?.(digits.join(''));
    }
  };

  // Handle OTP input change
  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to the next input box
    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    triggerComplete(newOtp);
  };

  // Handle backspace key
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste — fill all boxes from pasted text
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, ''); // digits only
    if (!pasted) return;

    const newOtp = [...otp];
    for (let i = 0; i < length; i++) {
      newOtp[i] = pasted[i] ?? '';
    }
    setOtp(newOtp);

    // Focus the last filled box (or the last box)
    const lastIndex = Math.min(pasted.length - 1, length - 1);
    inputRefs.current[lastIndex]?.focus();

    triggerComplete(newOtp);
  };

  return (
    <div className='flex space-x-2 justify-center'>
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el) as any}
          type='text'
          inputMode='numeric'
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className='py-4 text-center bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500'
        />
      ))}
    </div>
  );
};

export default OTPInput;
