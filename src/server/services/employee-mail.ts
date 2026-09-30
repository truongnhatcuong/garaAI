import "server-only";
import nodemailer from "nodemailer";

export class EmployeeMailError extends Error {}

export async function sendEmployeeMail({ to, name, subject, message }: { to: string; name: string; subject: string; message: string }) {
  const sender = process.env.CONTACT_EMAIL_USER?.trim();
  const password = process.env.GOOGLE_APP_PASSWORD?.replace(/\s/g, "");
  if (!sender || !password) throw new EmployeeMailError("Chưa cấu hình email gửi hoặc Gmail App Password.");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: sender, pass: password },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
  try {
    const result = await transporter.sendMail({
      from: { name: "AutoCare AI", address: sender },
      to,
      subject: `[AutoCare AI] ${subject}`,
      text: `Xin chào ${name},\n\n${message}\n\nAutoCare AI`,
    });
    if (!result.accepted.some((address) => String(address).toLowerCase() === to.toLowerCase())) {
      throw new EmployeeMailError("Máy chủ email không xác nhận người nhận. Vui lòng thử lại.");
    }
  } catch (error) {
    if (error instanceof EmployeeMailError) throw error;
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "UNKNOWN";
    console.error("Employee email delivery failed", code);
    throw new EmployeeMailError("Gửi email thất bại. Kiểm tra Gmail App Password hoặc kết nối SMTP rồi thử lại.");
  } finally {
    transporter.close();
  }
}
