'use client';

import { ChangeEvent, KeyboardEvent } from 'react';

export default function PhoneInput() {
  return (
    <div className="flex w-full gap-2">
      <div className="flex items-center bg-white/80 rounded-full px-3 w-full relative overflow-visible focus-within:ring-2 focus-within:ring-pink-400 transition-all">
        <select
          name="countryCode"
          className="bg-transparent text-gray-800 font-medium outline-none cursor-pointer py-2 text-sm w-20 min-w-[70px] border-none z-10"
          defaultValue="+91"
          style={{
            position: "relative",
            zIndex: 10,
            overflowY: "hidden",
            direction: "ltr",
            transform: "translateY(0)",
          }}
        >
          <option value="+91">🇮🇳 +91</option>
          <option value="+1">🇺🇸 +1</option>
          <option value="+44">🇬🇧 +44</option>
          <option value="+81">🇯🇵 +81</option>
          <option value="+49">🇩🇪 +49</option>
          <option value="+33">🇫🇷 +33</option>
        </select>

        <input
          name="phoneNumber"
          type="tel"
          placeholder="Enter Your Phone Number"
          className="bg-transparent outline-none flex-1 text-gray-800 placeholder-gray-500 py-2 px-2 focus:outline-none"
          required
          maxLength={10}
          pattern="[0-9]*"
          onKeyPress={(e: KeyboardEvent<HTMLInputElement>) => {
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          }}
        />
      </div>
    </div>
  );
}