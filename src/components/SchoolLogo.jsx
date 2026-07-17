import React from 'react';

const SchoolLogo = ({ size = 50, showText = true, theme = 'dark' }) => {
  const primaryColor = theme === 'dark' ? '#f1c40f' : '#2c3e50';
  const textColor = theme === 'dark' ? '#ffffff' : '#2c3e50';
  const subtextColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : '#7f8c8d';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.15))' }}
      >
        {/* Shield Outer Outline */}
        <path
          d="M50 5L15 20V50C15 72 35 88 50 95C65 88 85 72 85 50V20L50 5Z"
          fill="url(#shieldGrad)"
          stroke={primaryColor}
          strokeWidth="3"
        />
        {/* Inner Shield */}
        <path
          d="M50 11L22 23V48C22 66 38 80 50 86C62 80 78 66 78 48V23L50 11Z"
          fill="url(#innerGrad)"
          opacity="0.9"
        />
        {/* Graduation Cap */}
        {/* Cap diamond */}
        <polygon
          points="50,22 72,32 50,42 28,32"
          fill={primaryColor}
          stroke="#1a252f"
          strokeWidth="1"
        />
        {/* Cap base/skullcap */}
        <path
          d="M38 37V45C38 48 43 51 50 51C57 51 62 48 62 45V37"
          fill={primaryColor}
          stroke="#1a252f"
          strokeWidth="1"
        />
        {/* Tassel */}
        <path
          d="M50 32C52 35 68 37 68 45"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="68" cy="46" r="1.5" fill={primaryColor} />

        {/* Laurels / Leaves (Vector decoration) */}
        <path
          d="M28 65C32 60 40 58 45 58"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />
        <path
          d="M72 65C68 60 60 58 55 58"
          stroke={primaryColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Stars */}
        <polygon points="50,60 52,65 57,65 53,68 55,73 50,70 45,73 47,68 43,65 48,65" fill={primaryColor} />
        <polygon points="38,55 39.5,58 42.5,58 40,60 41,63 38,61.5 35,63 36,60 33.5,58 36.5,58" fill={primaryColor} opacity="0.8" />
        <polygon points="62,55 63.5,58 66.5,58 64,60 65,63 62,61.5 59,63 60,60 57.5,58 60.5,58" fill={primaryColor} opacity="0.8" />

        {/* Gradients */}
        <defs>
          <linearGradient id="shieldGrad" x1="50" y1="5" x2="50" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1a365d" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="innerGrad" x1="50" y1="11" x2="50" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>
      </svg>

      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <h1
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: textColor,
              lineHeight: 1.1,
              fontFamily: "'Montserrat', sans-serif"
            }}
          >
            A.A.N.M & V.V.R.S.R
          </h1>
          <span
            style={{
              margin: 0,
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '1px',
              color: subtextColor,
              textTransform: 'uppercase',
              lineHeight: 1,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            Gudlavalleru School
          </span>
        </div>
      )}
    </div>
  );
};

export default SchoolLogo;
