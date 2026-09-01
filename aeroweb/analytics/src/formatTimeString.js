//isoStr: '2026-08-15T22:15:32.342Z'
export const formatTimeString = (isoStr) => {
    const dateTimeStr = new Date(isoStr).toString();
    const dateTimeStrArr = dateTimeStr.split(" ");

    const day = dateTimeStrArr[0];
    const month = dateTimeStrArr[1];
    const date = dateTimeStrArr[2];
    const year = dateTimeStrArr[3];
    const time = dateTimeStrArr[4];

    return `${time.slice(0, 5)} ${day} ${date} ${month.toUpperCase()} '${year.slice(2)}`;
};
