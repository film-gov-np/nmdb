using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helpers
{
    public static class ImageUrlHelper
    {
        public static string GetHostUrl(IHttpContextAccessor httpContextAccessor)
        {
            var request = httpContextAccessor.HttpContext.Request;
            return $"{request.Scheme}://{request.Host}{request.PathBase}";
        }

        public static string GetFullImageUrl(string hostUrl, string appendContent = "", string imagePath="")
        {
            if (!string.IsNullOrEmpty(imagePath))
            {
                return string.Concat(hostUrl, appendContent, imagePath);
            }
            return string.Empty;
        }
    }
}
