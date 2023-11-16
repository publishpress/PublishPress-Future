export const getCurrentTime = () => {
    return (new Date()).getTime()/1000;
}

export const formatUnixTimestamp = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert to milliseconds by multiplying by 1000

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + date.getDate()).slice(-2);
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const seconds = ("0" + date.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const formatTimeToUnixTimestamp = (time) => {
    const date = new Date(time);

    return date.getTime()/1000;
}
