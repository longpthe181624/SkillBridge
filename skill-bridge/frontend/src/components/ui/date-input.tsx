'use client';

import * as React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface DateInputProps extends Omit<React.ComponentProps<'input'>, 'type' | 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  displayFormat?: string;
}

/**
 * Formats a date string from YYYY-MM-DD to yyyy/MM/dd
 */
function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
  if (isNaN(date.getTime())) return dateStr;
  
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}/${month}/${day}`;
}

/**
 * Parses a date string from yyyy/MM/dd to YYYY-MM-DD
 */
function parseDateFromDisplay(displayStr: string): string {
  if (!displayStr) return '';
  
  // Remove any non-digit characters except /
  const cleaned = displayStr.replace(/[^\d/]/g, '');
  
  // Try to parse yyyy/MM/dd format
  const parts = cleaned.split('/');
  if (parts.length === 3) {
    const year = parts[0].padStart(4, '0');
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    
    // Validate date
    const date = new Date(`${year}-${month}-${day}T00:00:00`);
    if (!isNaN(date.getTime()) && 
        date.getFullYear().toString() === year &&
        String(date.getMonth() + 1).padStart(2, '0') === month &&
        String(date.getDate()).padStart(2, '0') === day) {
      return `${year}-${month}-${day}`;
    }
  }
  
  // If parsing fails, return empty string
  return '';
}

export function DateInput({ 
  value, 
  onChange, 
  className,
  min,
  max,
  disabled,
  ...props 
}: DateInputProps) {
  const [displayValue, setDisplayValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const hiddenDateInputRef = React.useRef<HTMLInputElement>(null);

  // Update display value when value prop changes
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(formatDateForDisplay(value));
    }
  }, [value, isFocused]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDisplayValue = e.target.value;
    setDisplayValue(newDisplayValue);
    
    // Try to parse the display value
    const parsed = parseDateFromDisplay(newDisplayValue);
    if (parsed) {
      onChange(parsed);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Format the value on blur
    const parsed = parseDateFromDisplay(displayValue);
    if (parsed) {
      setDisplayValue(formatDateForDisplay(parsed));
      onChange(parsed);
    } else if (displayValue) {
      // If invalid, try to restore from value prop
      setDisplayValue(formatDateForDisplay(value));
    } else {
      setDisplayValue('');
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleCalendarClick = () => {
    if (hiddenDateInputRef.current && 'showPicker' in hiddenDateInputRef.current) {
      hiddenDateInputRef.current.showPicker();
    }
  };

  const handleHiddenDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="relative">
      <Input
        {...props}
        ref={inputRef}
        type="text"
        value={displayValue}
        onChange={handleTextChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="yyyy/MM/dd"
        className={cn('pr-10', className)}
        disabled={disabled}
      />
      {/* Hidden date input for native picker - positioned to overlay the button area */}
      <input
        ref={hiddenDateInputRef}
        type="date"
        value={value || ''}
        onChange={handleHiddenDateChange}
        min={min as string}
        max={max as string}
        className="absolute right-0 top-0 w-10 h-full opacity-0 cursor-pointer"
        tabIndex={-1}
        aria-hidden="true"
        style={{ zIndex: 1 }}
      />
      <button
        type="button"
        onClick={handleCalendarClick}
        disabled={disabled}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
        tabIndex={-1}
      >
        <CalendarIcon size={18} />
      </button>
    </div>
  );
}

