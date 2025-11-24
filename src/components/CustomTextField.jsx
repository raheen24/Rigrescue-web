import { useState } from 'react';
import showPasswordIcon from '../assets/images/showpassword.png';
import hidePasswordIcon from '../assets/images/HiddenIcon.png';

const CustomTextField = ({
  label,
  value,
  onChange,
  register,
  type = 'text',
  placeholder = '',
  disabled = false,
  icon = null,
  className = '',
  inputClassName = '',
  multiline = false,
  rows = 3,
  name = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label className="form-label fw-semibold">
          {label}
        </label>
      )}
      <div className={`input-group ${isFocused ? 'focus-ring' : ''}`}>
        {icon && (
          <span className="input-group-text">
            {icon}
          </span>
        )}
        {multiline ? (
          <textarea
            name={name}
            className={`form-control w-95 bgofTextFields ${inputClassName} ${disabled ? 'bg-light' : ''}`}
            {...(register ? register : { value, onChange })}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        ) : (
          <input
            name={name}
            type={inputType}
            className={`form-control w-95 bgofTextFields ${inputClassName} ${disabled ? 'bg-light' : ''}`}
            {...(register ? register : { value, onChange })}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            style={type === 'password' ? { borderRight: 'none' } : {}}
          />
        )}
        {type === 'password' && (
          <span
            className="input-group-text"
            style={{ cursor: 'pointer', backgroundColor: '#F6F2EE' }}
            onClick={togglePasswordVisibility}
          >
            <img
              src={showPassword ? hidePasswordIcon : showPasswordIcon}
              alt="toggle password visibility"
              style={{ width: '28px', height: '28px' }}
            />
          </span>
        )}
      </div>
    </div>
  );
};

export default CustomTextField;