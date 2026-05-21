export function EyeBackground() {
  return (
    <div className="eye-bg" aria-hidden="true">
      <svg viewBox="0 0 600 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="300" cy="150" rx="280" ry="120" stroke="#1d4ed8" strokeWidth="3" />
        <circle cx="300" cy="150" r="90" stroke="#1d4ed8" strokeWidth="3" />
        <circle cx="300" cy="150" r="42" fill="#1d4ed8" />
        <circle cx="285" cy="138" r="10" fill="#ffffff" />
        <path d="M40 150 Q300 -10 560 150" stroke="#1d4ed8" strokeWidth="3" fill="none" />
        <path d="M40 150 Q300 310 560 150" stroke="#1d4ed8" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}
