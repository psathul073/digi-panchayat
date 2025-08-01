import { useState, useEffect } from "react";


export const useDebounce = (arg, delay) => {

    const [debounced, setDebounced] = useState(arg);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebounced(arg)
        }, delay);

        return () => clearTimeout(timerId);

    }, [arg, delay])

    return debounced;

};