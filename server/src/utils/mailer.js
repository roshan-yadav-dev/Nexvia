const env = require('../config/env');

const sendVerificationEmail = async (email, token) => {
  const verificationUrl = `${env.CLIENT_URL}/verify/${token}`;
  console.log('----------------------------------------------------');
  console.log(`✉️ [SIMULATED EMAIL] Verification email to: ${email}`);
  console.log(`👉 Verification Link: ${verificationUrl}`);
  console.log(`👉 Token: ${token}`);
  console.log('----------------------------------------------------');
  return { verificationUrl, token };
};

const sendPasswordResetEmail = async (email, token) => {
  const resetUrl = `${env.CLIENT_URL}/reset-password/${token}`;
  console.log('----------------------------------------------------');
  console.log(`✉️ [SIMULATED EMAIL] Password reset email to: ${email}`);
  console.log(`👉 Reset Link: ${resetUrl}`);
  console.log(`👉 Token: ${token}`);
  console.log('----------------------------------------------------');
  return { resetUrl, token };
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
