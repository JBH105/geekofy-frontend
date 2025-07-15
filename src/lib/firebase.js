import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  AuthErrorCodes,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const setupRecaptcha = (containerId) => {
  const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
    size: "invisible",
    callback: () => {
      console.log("reCAPTCHA solved");
    },
    "expired-callback": () => {
      console.log("reCAPTCHA expired");
    },
  });
  return recaptchaVerifier;
};

const sendOTP = async (phoneNumber, appVerifier) => {
  const confirmationResult = await signInWithPhoneNumber(
    auth,
    phoneNumber,
    appVerifier
  );
  return confirmationResult;
};

const verifyOTP = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult?.confirm(code);
    return result?.user;
  } catch (err) {
    let errorMessage = "Something went wrong, please try again.";
    if (err?.code == AuthErrorCodes?.INVALID_CODE) {
      errorMessage = "Invalid OTP. Please check and try again.";
    } else if (err?.code == AuthErrorCodes?.EXPIRED_ID_TOKEN) {
      errorMessage = "OTP has expired. Please request a new one.";
    }
    throw new Error(errorMessage);
  }
};

export { sendOTP, verifyOTP, setupRecaptcha };
