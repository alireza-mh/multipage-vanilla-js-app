export function getDate(date: string) {
  return date.split("T")[0].replace(/-/g, "/");
}

export function getTime(date: string) {
  return date.split("T")[1].split(".")[0];
}
