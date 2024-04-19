using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Media
{
    public class AllowedUploadFiles
    {
        public const string Section = "AllowedUploadFiles";

        public static double MaxKBSize { get; set; }
        public static double MaxMediaMBSize { get; set; }
        public static string[] Image { get; set; }
        public static string[] Video { get; set; }
        public static string[] Audio { get; set; }
        public static string[] Document { get; set; }
        public static string[] OtherFiles { get; set; }
    }
}
