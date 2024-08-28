import { useState, useEffect } from 'react';

function useDebounce(value, delay) {
    // State to hold the debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set up a timer
        const handler = setTimeout(() => {
            // Update the debounced value after the specified delay
            setDebouncedValue(value);
        }, delay);

        // Cleanup function to clear the timer if value changes before the delay has passed
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]); // Effect runs when value or delay changes

    // Return the debounced value
    return debouncedValue;
}

export default useDebounce;