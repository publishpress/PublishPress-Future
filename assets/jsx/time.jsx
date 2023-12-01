export const getCurrentTimeInSeconds = () => {
    return normalizeUnixTimeToSeconds(new Date().getTime());
}

export const getCurrentTimeAsTimestamp = () => {
    return formatUnixTimeToTimestamp(getCurrentTimeInSeconds());
}

export const formatUnixTimeToTimestamp = (unixTimestamp) => {
    const date = new Date(
        normalizeUnixTimeToMilliseconds(unixTimestamp)
    );

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const formatTimestampToUnixTime = (time) => {
    const date = new Date(time);

    return normalizeUnixTimeToSeconds(date.getTime());
}

export const timeIsInSeconds = (time) => {
    return parseInt(time).toString().length === 10;
}

export const normalizeUnixTimeToSeconds = (time) => {
    time = parseInt(time);

    return timeIsInSeconds() ? time : time / 1000;
}

export const normalizeUnixTimeToMilliseconds = (time) => {
    time = parseInt(time);

    return timeIsInSeconds() ? time * 1000 : time;
}
