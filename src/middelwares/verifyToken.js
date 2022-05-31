import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/index.js";

export const verifyTokenAdmin = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      status: "error",
      message: "Access Denied / Unauthorized request",
    });

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).json("Unauthorized request");

    let verifiedUser = jwt.verify(token, JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).json("Unauthorized request");

    if (verifiedUser.role !== "admin")
      return res.status(401).json({
        status: "error",
        message: "Access Denied / Unauthorized request",
      });
    next();
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "Access forbidden",
    });
  }
};

export const verifyTokenUmum = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      status: "error",
      message: "Access Denied / Unauthorized request",
    });

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).json("Unauthorized request");

    let verifiedUser = jwt.verify(token, JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).json("Unauthorized request");
    next();
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "Access forbidden",
    });
  }
};
export const decodeJwt = (jwtToken) => {
  const decode = jwt.decode(jwtToken);
  console.log(decode);
};

export const verifyTokenSiswa = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json({
      status: "error",
      message: "Access Denied / Unauthorized request",
    });

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).json("Unauthorized request");

    let verifiedUser = jwt.verify(token, JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).json("Unauthorized request");

    if (verifiedUser.role !== "siswa")
      return res.status(401).json({
        status: "error",
        message: "Access Denied / Unauthorized request",
      });
    next();
  } catch (error) {
    res.status(403).json({
      status: "error",
      message: "Access forbidden",
    });
  }
};
