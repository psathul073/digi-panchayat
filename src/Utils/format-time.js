const formatTime = (unix, format) => {

    // Convert seconds + nano`s to milliseconds:
    const ms = unix._seconds * 1000 + unix._nanoseconds / 1e6;

    const date = new Date(ms);
    const dateOnly = date.toISOString().split('T')[0];
    const timeOnly = date.toISOString().split('T')[1].split('.')[0];
    if (format === "D") {
        return dateOnly;
    } else if (format === "T") {
        return timeOnly;
    } else {
        return (`D : ${dateOnly}, T : ${timeOnly}`);
    }
};

export default formatTime