export const jwtDeccode = (token) => {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
};

export const filterKelas = (kelas, id) => {
  const _kelas = kelas.filter((x) => x._id === id);

  if (_kelas.length) return _kelas[0].nama;
  return null;
};
