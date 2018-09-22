export const getValidDate = (d) => {
  console.log('date arg: ', d);

  //handle case: standard date object
  var newDate = Date.parse(d);
  if (newDate.toString() != "NaN") {
    return newDate
  }

  //handle case: YYYY:MM:DD HH:MM:SS
    var digitpattern = /^(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})$/,
    datetime = d,
    matches = datetime.match(digitpattern);
  console.log(matches);
  if (matches.length > 0) {
    const year = matches[1];
    const month = matches[2];
    const day = matches[3];
    return (new Date(year, day, month))
  }
  return null;
}

export const formattedStringFromDate = (d) => {
  console.log(d);
  var date = Date.parse(d);
  console.log(date);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const day = date.getDate();
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  return month + " " + day + ", " + year;
}
export const timeSince = (date) => {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

export const memberSince = (date) => {
  return new Date(date).getFullYear()
}

