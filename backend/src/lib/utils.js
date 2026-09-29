import jwt from "jsonwebtoken";

export const getJwtToken = (UserId, res) => {
  const token = jwt.sign({ UserId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7d
    httpOnly: true,//XSS attacks
    sameSite: "strict",//csrf attacks
    secure: process.env.NODE_ENV === "development" ? "false" : "true",
  });

  return token;
};
