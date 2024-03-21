using Microsoft.AspNetCore.StaticFiles;
using System.Net;

namespace Core.Helper.FTP
{
    public class FTPHelper
    {
        public FTPResponse UploadFile(string ftpServer, string ftpUsername, string ftpPassword, string remoteFileName, byte[] data)
        {
            FTPResponse fTPResponse= new FTPResponse();
            try
            {
                // Create the FTP request
                FtpWebRequest request = (FtpWebRequest)WebRequest.Create($"{ftpServer}/{remoteFileName}");
                request.Method = WebRequestMethods.Ftp.UploadFile;
                request.Credentials = new NetworkCredential(ftpUsername, ftpPassword);
                request.UseBinary = true;

                // Write the byte array to the request stream
                using (Stream requestStream = request.GetRequestStream())
                {
                    requestStream.Write(data, 0, data.Length);
                }

                // Get the response from the FTP server
                using (FtpWebResponse response = (FtpWebResponse)request.GetResponse())
                {
                    fTPResponse.Status = 1;
                    fTPResponse.StatusMessage = $"Upload File Complete, status {response.StatusDescription}";
                }
            }
            catch (WebException ex)
            {
                fTPResponse.Status = -1;
                fTPResponse.StatusMessage = ex.ToString();
            }
            return fTPResponse;
        }

        public string GetFileExtension(byte[] fileBytes)
        {
            // Check if the byte array is empty or null
            if (fileBytes == null || fileBytes.Length == 0)
            {
                throw new ArgumentException("Byte array is empty or null.");
            }

            // Use FileExtensionContentTypeProvider to get MIME type
            var provider = new FileExtensionContentTypeProvider();
            string contentType;
            if (provider.TryGetContentType("file." + GetFileExtension(fileBytes), out contentType))
            {
                // Get the MIME type and extract the file extension
                return Path.GetExtension(contentType);
            }

            // If the content type is not recognized, you can return an empty string or handle it differently
            return string.Empty;
        }
    }
}
