namespace Core.Constants;

public static class EmailTemplate
{
    public const string CardRequested = @"
            <!DOCTYPE html>
            <html lang=""en"">
            <head>
                <meta charset=""UTF-8"">
                <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
                <title>Email Verification</title>
            </head>
            <body>
                <div style=""font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"">
                    <h2 style=""color: #333;"">Card Requested</h2>
                    <p>A card has been requested by {{crew}}.</p>                    
                </div>
            </body>
            </html>";

    public const string CardApproved = @"
            <!DOCTYPE html>
            <html lang=""""en"""">
            <head>
                <meta charset=""""UTF-8"""">
                <meta name=""""viewport"""" content=""""width=device-width, initial-scale=1.0"""">
                <title>Card Request Approved</title>
            </head>
            <body>
                <div style=""""font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;"""">
                    <h2 style=""""color: #333;"""">Card Request Approved</h2>
                    <p>Your card request has been approved. It will be ready by {{ready-date}}.</p>
                    <p>You can collect it after the mentioned date.</p>
                </div>
            </body>
            </html>";

}
