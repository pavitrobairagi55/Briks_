import axios from "../api/axios";

export function formatDate(date) {
  if (!date) {
    return " ";
  }
  const dateObj = new Date(date);

  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const parts = formatter
    .formatToParts(dateObj)
    .map((elem) => elem.value)
    .filter((elem) => elem != " ");
  let formattedDate = parts.join(" ");

  if (formattedDate === "01 Jan 1") {
    return "----";
  }
  return formattedDate;
}

export function capitalizeFirstLetter(str) {
  if (str?.length > 0) {
    const firstLetter = str.charAt(0);
    const firstLetterUppercase = firstLetter.toUpperCase();
    const remainingString = str.slice(1);
    const result = firstLetterUppercase + remainingString;
    return result;
  }
  return "";
}

export function convertExistingDate(date) {
  if (!date) {
    return null;
  }

  return date.split("T", 1);
}

export function addSecondsToTime(timeString) {
  const time = `${timeString}:00`;
  return time;
}

export function convertExistingTime(timeString) {
  if (!timeString) return null;
  let timeParts = timeString.split(":");
  timeParts.pop(); // Remove the last element (seconds)
  return timeParts.join(":");
}

export async function handlePrint(url, filename, auth) {
  try {
    const response = await axios.get(url, {
      responseType: "blob",
      headers: {
        Accept: "application/pdf",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    
    const href = URL.createObjectURL(response.data);

    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", filename); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    console.log(
      "🚀 ~ file: LoadingRequestTAB.jsx:162 ~ fetchData ~ error:",
      JSON.stringify(error)
    );
  }
}

export async function handleExcel(url, filename, auth) {
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    const blob = new Blob([response.data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);

    // Set the filename dynamically
    link.download = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;

    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
  } catch (error) {
    console.error("Error:", error);
  }
}

export function extractTimeFromDate(dateString) {
  const dateTime = new Date(dateString);

  // Extracting hours, minutes, and seconds
  let hours = dateTime.getHours();

  if (hours.toString().length === 1) {
    hours = `0${hours}`;
  }
  let minutes = dateTime.getMinutes();
  if (minutes.toString().length === 1) {
    minutes = `${minutes}0`;
  }

  // Formatting time string
  const formattedTime = `${hours}:${minutes}`;

  return formattedTime;
}

export async function uploadFile(file, auth) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("api/upload", formData, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.id;
}
export async function uploadFileUrl(file, auth) {
  const formData = new FormData();
  formData.append("file", file);
  const response = await axios.post("api/upload", formData, {
    headers: {
      Authorization: `Bearer ${auth.token}`,
    },
  });
  return response.data.path;
}

export function getParts(value) {
  const parts = [0];
  const increment = value / 10;

  for (let i = increment; i <= value; i += increment) {
    parts.push(i);
  }
  return parts;
}

export function roundUpToBucket(value) {
  // Define the cutoff points
  const buckets = [100, 500, 1000, 5000, 10000, 50000, 100000, 1000000, 5000000, 10000000];
  
  // If value is below the smallest bucket, return that bucket
  if (value <= buckets[0]) return buckets[0];
  
  // Loop through each bucket
  for (let i = 1; i < buckets.length; i++) {
    if (value <= buckets[i]) return buckets[i];
  }
  let bucket = buckets[buckets.length - 1];
  while (value > bucket) {
    bucket *= 10;
  }
  return bucket
}
