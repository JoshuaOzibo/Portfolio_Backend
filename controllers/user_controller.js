

const signupController = async (req, res, next) => {
  try {

  } catch (error) {
    res.send(`error occured :`, error);
    next(error);
  }
};
