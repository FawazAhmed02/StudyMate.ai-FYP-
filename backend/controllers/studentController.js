const Student = require("../models/Student");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
//const bcrypt = require("bcrypt");

exports.registerStudent = async (req, res) => {
  const { rollno, password, name, email } = req.body;

  if (!rollno || !password || !name || !email) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    //const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      rollNo: rollno,
      password, // In production, hash the password
      name,
      email,
    });
    res.status(201).json({ message: "Student added successfully", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error occurred while adding student" });
  }
};

exports.loginStudent = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }
  try {
    const student = await Student.findOne({
      email,
      password,
    });

    if (!student) {
      return res.status(401).json({ message: "Invalid rollno or password" });
    }
    // const isPasswordValid = await bcrypt.compare(password, student.password);
    // if (!isPasswordValid) {
    //   return res.status(401).json({ message: "Invalid email or password" });
    // }

    res.status(200).json({ message: "Login successful", student });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error occurred while logging in student" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }
    const token = crypto.randomBytes(32).toString("hex");
    student.resetPasswordToken = token;
    student.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await student.save();

    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    const resetUrl = `http://localhost:3000/reset-password?token=${token}&email=${encodeURIComponent(
      email
    )}`;
    const mailOptions = {
      to: student.email,
      from: "no-reply@studymate.com",
      subject: "StudyMate Password Reset",
      html: `<p>You requested a password reset for StudyMate.</p>
               <p>Click <a href="${resetUrl}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    };

    let info = await transporter.sendMail(mailOptions);

    // Log the Ethereal preview URL for dev/testing
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Ethereal email preview URL:", previewUrl);
    return res.json({
      message: "Password reset link sent to your email.",
      resetUrl,
      previewUrl,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, token, newPassword } = req.body;
  if (!email || !token || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, token, and new password are required" });
  }
  try {
    const student = await Student.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!student) {
      return res.status(404).json({ message: "Invalid or expired token" });
    }
    student.password = newPassword;
    student.resetPasswordToken = undefined;
    student.resetPasswordExpires = undefined;
    await student.save();
    return res.json({ message: "Password reset successful." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
};
