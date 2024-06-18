namespace Core.Constants;

public static class EmailTemplate
{
    private static string getTextStyle()
    {
        string cssStyles = @"style=""font-size: 16px;""";
        return cssStyles;
    }
    private static string getTemplateStyle()
    {
        string cssStyles = @"style=""max-width: 600px;margin: 0 auto;font-size: 16px; background: #fff;padding: 20px;text-align: center;border: 1px solid #dedede;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);""";
        return cssStyles;
    }

    private static string getButtonStyle()
    {
        string cssStyles = @"style=""display: inline-block;padding: 10px 20px;margin-top: 20px;background-color: #007bff;text-decoration: none;color: #ffffff !important;border-radius: 5px;font-weight: bold;cursor: pointer;""";
        return cssStyles;
    }

    public static string GetVerificationEmailContent(string verificationLink, string username = "")
    {
        var emailTemplate = $@"
            <head>           
            </head>
                <body>
                   <div class='{getTemplateStyle()}'>
                        <h2>Welcome to nmdb!</h2>
                        <p {getTextStyle()}>Thank you for registering {username}. Please click the button below to verify your email address and complete your registration.</p>
                        <a href='{verificationLink}' {getButtonStyle()}>Verify Email Address</a>
                        <p {getTextStyle()}>If the button above does not work, please copy and paste the following URL into your browser:</p>
                        <p {getTextStyle()}>{verificationLink}</p>
                    </div>
                    <div>{getCompanySignature()}</div>
                </body>";
        return emailTemplate;
    }
    public static string CardRequestedMail(string crewEmail)
    {
        var emailTemplate = $@"
            <head>
            
            </head>
                <body>
                   <div class='email-container {getTemplateStyle()}'>
                        <h2>Card Request Recieved.</h2>
                        <p {getTextStyle()}>A card has been requested by {crewEmail}.</p>
                        <a {getButtonStyle()} href='LINK_TO_VERIFICATION_PAGE' class='button'>Verify Request</a>
                        <p {getTextStyle()}>Thank you!</p>
                    </div>
                    <div>{getCompanySignature()}</div>
                </body>";
        return emailTemplate;
    }
    public static string CardApprovedEmail(string cardReadyDate)
    {
        var emailTemplate = $@"
            <head>
             
            </head>
                <body>
                   <div class='email-container' {getTemplateStyle()}>
                       <h2>Card Request Approved.</h2>
                       <p {getTextStyle()}>Your card request has been approved.</p>
                       <p {getTextStyle()}>You can collect it after the mentioned date: {cardReadyDate}.</p>
                       <p {getTextStyle()}>Thank you!</p>
                    </div>
                    <div>{getCompanySignature()}</div>
                </body>";
        return emailTemplate;
    }
    public static string sendAlreadyRegisteredEmail(string email, string username = "", string loginLink = "")
    {
        var emailTemplate = $@"
            <head>
              
            </head>
                <body>
                   <div class='email-container' {getTemplateStyle()}>
                       <p>Hello ${username},</p>
                                <p {getTextStyle()}>Our records show that you are already registered with us. Here's a quick way to access your account:</p>
                                <a {getButtonStyle()} href='${loginLink}' class='button'>Login to Your Account</a>
                                <p {getTextStyle()}>If you have any questions or need assistance, feel free to reach out to our support team.</p>
                                <p {getTextStyle()}>Thank you for being a part of our community!</p>                               
                                <p {getTextStyle()}>Thank you!</p>
                        </div>
                    <div>{getCompanySignature()}</div>
                </body>";
        return emailTemplate;
    }
    public static string PasswordResetEmail(string username, string resetToken)
    {
        var emailTemplate = $@"
            <head>
             
            </head>
                <body>
                   <div class='email-container' {getTemplateStyle()}>
                       <h2>Password Reset Request</h2>
                                <p {getTextStyle()}>Dear ${username},</p>
                                <p {getTextStyle()}>You have requested to reset your password. Please click the button below to set a new password:</p>
                                    <a {getButtonStyle()} href='{resetToken}' class='button'>Reset Password</a>
                                <p {getTextStyle()}>If the button above does not work, please copy and paste the following URL into your browser:</p>
                                <p {getTextStyle()}>{resetToken}</p>
                                <p {getTextStyle()}>If you did not request a password reset, please ignore this email or contact support.</p>
                        </div>
                    <div>{getCompanySignature()}</div>
                </body>";
        return emailTemplate;

    }
    private static string getCompanySignature()
    {
        return "";
    }

}
