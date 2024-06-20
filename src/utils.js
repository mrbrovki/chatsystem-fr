export const getAuthHeader = () => {
  return { Authorization: "Bearer " + localStorage.getItem("jwt") };
};
