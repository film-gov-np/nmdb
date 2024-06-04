using Microsoft.Extensions.Options;
using System.Net.Mail;
using System.Net;
using Amazon;
using Application.Abstractions;

namespace Infrastructure.Email;

public class SmtpEmailService : IEmailService
{
    private readonly EmailSettings _mailSettings;

    public SmtpEmailService(IOptions<EmailSettings> mailSettings)
    {
        _mailSettings = mailSettings.Value;
    }

    public async Task Send(string to, string subject, string html, string from = null)
    {
        AWSConfigs.AWSRegion = RegionEndpoint.APSouth1.SystemName;
        var fromAddress = new MailAddress(_mailSettings.SenderEmail, _mailSettings.SenderName);
        var toAddress = new MailAddress(to);
        var smtpClient = new SmtpClient
        {
            Host = _mailSettings.SmtpHost,
            Port = _mailSettings.SmtpPort,
            EnableSsl = true,
            Credentials = new NetworkCredential(_mailSettings.SmtpUsername, _mailSettings.SmtpPassword)
        };
        ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;
        using var message = new MailMessage(fromAddress, toAddress)
        {
            Subject = subject,
            Body = html,
            IsBodyHtml = true
        };
        if (!string.IsNullOrEmpty(_mailSettings.CcTo))
        {
            string[] ccRecipients = _mailSettings.CcTo.Split(",");
            foreach (string recipient in ccRecipients)
            {
                message.CC.Add(recipient);
            }
        }

        if (!string.IsNullOrEmpty(_mailSettings.BccTo))
        {
            string[] bccRecipients = _mailSettings.BccTo.Split(",");

            foreach (string recipient in bccRecipients)
            {
                message.Bcc.Add(recipient);
            }
        }

        try
        {
            await smtpClient.SendMailAsync(message);
            Console.WriteLine("Email sent successfully!");
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to send email: {ex.Message}");
        }
    }
}
