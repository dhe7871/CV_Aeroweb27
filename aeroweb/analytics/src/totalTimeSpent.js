export const totalTimeSpent = (data) => {
    let ttSpent = {};

    Object.keys(data).forEach((userKey) => {
        let timeSum = 0;
        Object.keys(data[userKey]["visits"]).forEach((visitnum) => {
            if (data[userKey]["visits"][visitnum]["exitepoch"] != undefined) {
                timeSum +=
                    data[userKey]["visits"][visitnum]["exitepoch"] -
                    data[userKey]["visits"][visitnum]["entryepoch"];
            }
        });
        ttSpent[userKey] = Math.floor(timeSum / 60);
    });

    return ttSpent;
};