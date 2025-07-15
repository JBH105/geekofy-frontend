export const validateForm = (formData) => {
  const newErrors = {};

  if (!formData.firstName.trim()) {
    newErrors.firstName = "First name is required";
  }

  if (!formData.lastName.trim()) {
    newErrors.lastName = "Last name is required";
  }

  if (!formData.email.trim()) {
    newErrors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Please enter a valid email";
  }

  if (!formData.password) {
    newErrors.password = "Password is required";
  } else if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
    newErrors.password =
      "Password must contain uppercase, lowercase and number";
  }

  if (!formData.agreeToTerms) {
    newErrors.agreeToTerms = "You must agree to the terms";
  }

  return newErrors;
};

export const isPasswordValid = (password) => {
  return (
    password.length >= 6 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
};
