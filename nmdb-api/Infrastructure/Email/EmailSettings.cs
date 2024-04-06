using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Email
{
    public class EmailSettings
    {
        public const string Section = "EmailSettings";
        public string SmtpHost { get; set; }
        public int SmtpPort { get; set; }
        public string SmtpUsername { get; set; }
        public string SmtpPassword { get; set; }
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string CcTo { get; set; }
        public string BccTo { get; set; }
    }
}
