/* =============================================
   EMAIL SERVICE
   Handles sending emails via Nodemailer + Gmail
   ============================================= */

const nodemailer = require('nodemailer');

// Create a transporter using Gmail SMTP
const createTransporter = () => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
        
        console.log('✅ Email transporter configured successfully');
        return transporter;
    } catch (error) {
        console.error('❌ Failed to configure email transporter:', error.message);
        return null;
    }
};

// Send email to portfolio owner
const sendContactEmail = async (name, email, message) => {
    try {
        // Check if email credentials are configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            console.warn('⚠️  Email credentials not configured. Skipping email send.');
            return {
                success: false,
                reason: 'Email service not configured'
            };
        }
        
        // Create transporter
        const transporter = createTransporter();
        
        if (!transporter) {
            console.error('❌ Email transporter could not be created');
            return {
                success: false,
                reason: 'Email transporter unavailable'
            };
        }
        
        // Format the email content
        const emailContent = `
╔════════════════════════════════════════════════════════════╗
║            NEW CONTACT FORM SUBMISSION                    ║
╚════════════════════════════════════════════════════════════╝

📝 SENDER DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name:     ${name}
Email:    ${email}
Date:     ${new Date().toLocaleString()}

📧 MESSAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ This message has been saved in your portfolio database.
🔗 Reply directly to: ${email}
        `;
        
        // Email options
        const mailOptions = {
            from: `${process.env.EMAIL_FROM_NAME || 'Portfolio'} <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_RECEIVER,
            subject: `New Contact: ${name}`,
            text: emailContent,
            html: `
                <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px;">
                    <div style="background: white; border-radius: 8px; padding: 30px; max-width: 600px; margin: 0 auto; border-left: 4px solid #007bff;">
                        <h2 style="color: #333; margin-top: 0;">New Contact Form Submission</h2>
                        
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <p style="margin: 10px 0;"><strong>From:</strong> ${name}</p>
                            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
                            <p style="margin: 10px 0;"><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div style="background: #fafafa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Message</h3>
                            <p style="color: #555; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; margin-top: 20px;">
                            ✅ This message has been saved in your portfolio database.<br>
                            🔗 Reply directly to: ${email}
                        </p>
                    </div>
                </div>
            `
        };
        
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        
        console.log(`✅ Email sent successfully to ${process.env.EMAIL_RECEIVER}`);
        console.log(`   Message ID: ${info.messageId}`);
        
        return {
            success: true,
            messageId: info.messageId
        };
        
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        
        return {
            success: false,
            error: error.message
        };
    }
};

module.exports = {
    sendContactEmail
};
