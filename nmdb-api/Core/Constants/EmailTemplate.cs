namespace Core.Constants;

public static class EmailTemplate
{
    private static string getEmailStyle()
    {
        string cssStyles = @"<style>
                            .email-container {
                                max-width: 600px;
                                margin: 0 auto;
                                background: #fff;
                                padding: 20px;
                                text-align: center;
                                border: 1px solid #dedede;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            }
                            .button {
                                display: inline-block;
                                padding: 10px 20px;
                                margin-top: 20px;
                                background-color: #007bff;
                                color: #ffffff !important;
                                text-decoration: none;
                                border-radius: 5px;
                                font-weight: bold;
                                border: none;
                                cursor: pointer;
                            }
                            .button:hover {
                                background-color: #0056b3;
                            }
                            </style>";
        return cssStyles;
    }

    public static string GetVerificationEmailContent(string verificationLink, string username = "")
    {
        var emailTemplate = $@"
        <!DOCTYPE html>
            <html>
            <head>
              {getEmailStyle()}
            </head>
                <body>
                   <div class='email-container'>
                        <h2>Welcome to nmdb!</h2>
                        <p>Thank you for registering {username}. Please click the button below to verify your email address and complete your registration.</p>
                        <a href='{verificationLink}' class='button'>Verify Email Address</a>
                        <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
                        <p>{verificationLink}</p>
                    </div>
                    <div>${getCompanySignature()}</div>
                </body>
            </html>";
        return emailTemplate;
    }
    public static string CardRequestedMail(string crewEmail)
    {
        var emailTemplate = $@"
        <!DOCTYPE html>
            <html>
            <head>
              {getEmailStyle()}
            </head>
                <body>
                   <div class='email-container'>
                        <h2>Card Request Recieved.</h2>
                        <p>A card has been requested by {crewEmail}.</p>
                        <a href='LINK_TO_VERIFICATION_PAGE' class='button'>Verify Request</a>
                        <p>Thank you!</p>
                    </div>
                    <div>${getCompanySignature()}</div>
                </body>
            </html>";
        return emailTemplate;
    }
    public static string CardApprovedEmail(string cardReadyDate)
    {
        var emailTemplate = $@"
        <!DOCTYPE html>
            <html>
            <head>
              {getEmailStyle()}
            </head>
                <body>
                   <div class='email-container'>
                       <h2>Card Request Approved.</h2>
                       <p>Your card request has been approved.</p>
                       <p>You can collect it after the mentioned date: {cardReadyDate}.</p>
                       <p>Thank you!</p>
                    </div>
                    <div>${getCompanySignature()}</div>
                </body>
            </html>";
        return emailTemplate;
    }
    public static string sendAlreadyRegisteredEmail(string email, string username = "", string loginLink = "")
    {
        var emailTemplate = $@"
        <!DOCTYPE html>
            <html>
            <head>
              {getEmailStyle()}
            </head>
                <body>
                   <div class='email-container'>
                       <p>Hello ${username},</p>
                                <p>Our records show that you are already registered with us. Here's a quick way to access your account:</p>
                                <a href='${loginLink}' class='button'>Login to Your Account</a>
                                <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                                <p>Thank you for being a part of our community!</p>                               
                                <p>Thank you!</p>
                        </div>
                    <div>${getCompanySignature()}</div>
                </body>
            </html>";
        return emailTemplate;
    }
    public static string PasswordResetEmail(string username, string resetToken)
    {
        var emailTemplate = $@"
        <!DOCTYPE html>
            <html>
            <head>
              {getEmailStyle()}
            </head>
                <body>
                   <div class='email-container'>
                       <h2>Password Reset Request</h2>
                                <p>Dear ${username},</p>
                                <p>You have requested to reset your password. Please click the button below to set a new password:</p>
                                    <a href='{resetToken}' class='button'>Reset Password</a>
                                <p>If the button above does not work, please copy and paste the following URL into your browser:</p>
                                <p>{resetToken}</p>
                                <p>If you did not request a password reset, please ignore this email or contact support.</p>
                        </div>
                    <div>${getCompanySignature()}</div>
                </body>
            </html>";
        return emailTemplate;

    }
    private static string getCompanySignature()
    {
        return "";
    }

}
