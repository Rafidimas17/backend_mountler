const authoriztaion = (req, res, next) => {
  try {
    const token = req.header("Authorization");
    const fixedToken = "iO3quoYg265hlzq30E8RelQc0LOKle4R0yk6CMbgeHgGNcm_mR";

    if (token && token.startsWith("Bearer ")) {
      const extractedToken = token.slice(7); // Remove "Bearer " from the token
      if (extractedToken === fixedToken) {
        return next();
      }
    }

    res.status(500).json({
      message: "Token is invalid",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = authoriztaion;
