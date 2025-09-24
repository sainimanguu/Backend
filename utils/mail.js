import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Our App",
            link: "http://ourapp.com/",
        },
    })


    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);// Generate plaintext email content

    const emailHTML = mailGenerator.generate(options.mailgenContent);// Generate HTML email content

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASSWORD,
        },
    });

    const mail = {
        from: '"Example Team" <team@example.com>', // sender address
        to: options.email, // list of receivers
        subject: options.subject, // Subject line
        text: emailTextual, // plain text body
        html: emailHTML, // html body
    }

    try {
        await transporter.sendMail(mail);
    } catch (error) {
        console.error("Error email service :", error);
    }
};


const emailVerificationMailgenContent = (username, verificationUrl) => {
    body: {
        name: username;
        intro: "Welcome to Our App! We're excited to have you on board.";
        action: {
            instructions: "To get started with Our App, please click the button below to verify your email address:";
            button: {
                color: "#22BC66"; // Optional action button color
                text: "Verify your email";
                link: verificationUrl;
            }
        };
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    body: {
        name: username;
        intro: "Welcome to Our App! We've received a request to reset your password.";
        action: {
            instructions: "To change your password please click the button below to reset your password:";
            button: {
                color: "#22BC66"; // Optional action button color
                text: "Reset your password";
                link: passwordResetUrl;
            }
        };
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent };
