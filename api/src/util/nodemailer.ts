import nodeMailer from 'nodemailer';

const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

export async function sendCustomEmail(recipiant: string, subject: string, options: { text: string, html: string }) {

    return await transporter.sendMail({
        from: '"NOOK noreply" <nook.noreply@gmail.com>',
        to: recipiant,
        subject: subject,
        text: options.text,
        html: options.html,
    })
}

export async function sendOTPEmail(recipiant: string, subject: string, otp: string) {
    await sendCustomEmail(recipiant, subject, {
        html: `
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Your Verification Code</title>
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background-color: #f4f6f8;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    .container {
                        width: 100%;
                        padding: 24px 0;
                    }

                    .card {
                        max-width: 480px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border-radius: 8px;
                        padding: 32px;
                        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                    }

                    .logo {
                        text-align: center;
                        margin-bottom: 24px;
                    }

                    .title {
                        font-size: 20px;
                        font-weight: bold;
                        color: #111827;
                        text-align: center;
                        margin-bottom: 12px;
                    }

                    .text {
                        font-size: 14px;
                        color: #4b5563;
                        text-align: center;
                        line-height: 1.6;
                        margin-bottom: 24px;
                    }

                    .otp {
                        font-size: 32px;
                        font-weight: bold;
                        letter-spacing: 6px;
                        color: #111827;
                        text-align: center;
                        margin: 24px 0;
                    }

                    .footer {
                        font-size: 12px;
                        color: #9ca3af;
                        text-align: center;
                        margin-top: 24px;
                    }
                </style>
            </head>

            <body>
                <table class="container" role="presentation" width="100%">
                    <tr>
                        <td align="center">
                            <table class="card" role="presentation" width="100%">
                                <tr>
                                    <td>
                                        <!-- Logo -->
                                        <div class="logo">
                                            <!-- Replace with your logo -->
                                            <strong>Nook</strong>
                                        </div>

                                        <!-- Title -->
                                        <div class="title">${subject}</div>

                                        <!-- Message -->
                                        <div class="text">
                                            Your verification code:
                                        </div>

                                        <!-- OTP -->
                                        <div class="otp">${otp}</div>

                                        <!-- Security note -->
                                        <div class="text">
                                            This code will expire in <strong>10 minutes</strong>.
                                            If you did not request this code, you can safely ignore this email.
                                        </div>

                                        <!-- Footer -->
                                        <div class="footer">
                                            ©${new Date(Date.now()).getFullYear()} NOOK. All rights reserved.
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>

        </html>`, text: `Your one-time-password is: ${otp} \nThis code expires in 10 minutes`
    });
}