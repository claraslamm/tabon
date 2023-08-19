const formatDate = (array, dateKey) => {
    return array.map((x) => {
        const formattedDate = x[dateKey].toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        x[dateKey] = formattedDate;
        return x;
    })
}

module.exports = {
    formatDate,
}