const validateEditData = (userTypeJson) => {
  try {
    const AllowedEdit = ["firstName", "lastName", "age", "gender", "about"];
    const isEditAllow = Object.keys(userTypeJson).every((key) =>
      AllowedEdit.includes(key)
    );

    return isEditAllow;
  } catch (error) {
    throw new Error("validation failed");
  }
};

const validatePassword = (userTypeJson) => {
  try {
    const AllowedEdit = ["oldPassword", "newPassword"];
    const isEditAllow = Object.keys(userTypeJson).every((key) =>
      AllowedEdit.includes(key)
    );

    return isEditAllow;
  } catch (error) {
    throw new Error("validation failed");
  }
};
module.exports = { validateEditData, validatePassword };
