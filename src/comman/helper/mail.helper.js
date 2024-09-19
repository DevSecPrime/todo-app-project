import nodeMailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export default async (email, title, body, isHtml = false) => {
    try {
        //create transporter
        const transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        const mailOption = {
            from: process.env.MAIL_USER,
            to: `${email}`,
            subject: `${title}`,
            [isHtml ? "html" : "text"]: `${body}`
        };

        transporter.sendMail(mailOption, (error, info) => {
            if (error) {
                console.log("Errror while sending mail", error);

            } else {
                console.log("Email sent successfully", info.response);
            }
        })
    } catch (error) {
        console.log("something went wrong.", error);
    }
}