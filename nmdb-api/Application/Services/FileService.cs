using Application.Dtos.Film;
using Application.Dtos.Media;
using Application.Helpers;
using Application.Interfaces.Services;
using Application.Models;
using Core;
using Core.Constants;
using Core.Shared;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class FileService : IFileService
    {
        public async Task<ApiResponse<UploadResult>> UploadFile(FileDTO model, string webRootPath)
        {
            if (model.Files == null || model.Files.Length == 0)
            {
                return ApiResponse<UploadResult>.ErrorResponse("Please select a file.");
            }
            FileHelper helper = new FileHelper();
            var fileValid = helper.EnsureValidFile(model.Files.FileName);
            if (fileValid.Valid)
            {
                string savePath = GetFilePath(fileValid.FileType);
                string path = Path.Combine(webRootPath, savePath);
                string fileName = helper.GetFileNewName(model.Files.FileName, path, model.ReadableName);
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }
                using (var stream = new FileStream(Path.Combine(path, fileName), FileMode.Create))
                {
                    await model.Files.CopyToAsync(stream);
                }

                var result = ApiResponse<UploadResult>.SuccessResponse(
                    data: new UploadResult()
                    {
                        FileName = fileName,
                        FilePath = string.Concat('/', savePath.Replace('\\', '/'), '/', fileName),
                        FileExtension = Path.GetExtension(model.Files.FileName),
                        FileSize = model.Files.Length.ToString()
                    },
                    message: "File uploaded successfully"
                    );

                //If image file and thumbnail is set to true, 
                //create thumbnai of different sizes(small,medium and large)
                if (fileValid.FileType == FileTypes.Image && model.Thumbnail)
                {

                    string pathThumbSm = Path.Combine(path, "small");
                    string pathThumbMd = Path.Combine(path, "medium");
                    string pathThumbLg = Path.Combine(path, "large");
                    if (!Directory.Exists(pathThumbSm))
                    {
                        Directory.CreateDirectory(pathThumbSm);
                    }
                    if (!Directory.Exists(pathThumbMd))
                    {
                        Directory.CreateDirectory(pathThumbMd);
                    }
                    if (!Directory.Exists(pathThumbLg))
                    {
                        Directory.CreateDirectory(pathThumbLg);
                    }
                    path = Path.Combine(path, fileName);
                    helper.CreateThumbnail(path, 320, Path.Combine(pathThumbSm, fileName));
                    helper.CreateThumbnail(path, 768, Path.Combine(pathThumbMd, fileName));
                    helper.CreateThumbnail(path, 1200, Path.Combine(pathThumbLg, fileName));
                    result.Data.ThumbPaths = new List<string>() { pathThumbSm, pathThumbMd, pathThumbLg };
                }
                //result.Data.ThumbPaths = new List<string>() { Path.Combine(savePath, "small"), Path.Combine(savePath + "medium"), Path.Combine(savePath, "large") };
                return result;
            }
            else
                return ApiResponse<UploadResult>.ErrorResponse("File format not supported.", HttpStatusCode.NotAcceptable);

        }

        public bool RemoveFile(string filename, string webRootPath)
        {
            try
            {
                FileHelper fileHelper = new FileHelper();
                var fileValid = fileHelper.EnsureValidFile(filename);
                string filePath = GetFilePath(fileValid.FileType);// later take filetype input for media management
                var file = Path.Combine(webRootPath, string.Concat(filePath, '\\', filename));
                if (File.Exists(file))
                    File.Delete(file);

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return false;
            }
        }

        private static string GetFilePath(FileTypes fileType)
        {
            string savePath;
            switch (fileType)
            {
                case FileTypes.Image:
                    savePath = Path.Combine("upload", "img");
                    break;
                case FileTypes.Video:
                    savePath = Path.Combine("upload", "video");
                    break;
                case FileTypes.Audio:
                    savePath = Path.Combine("upload", "audio");
                    break;
                case FileTypes.Document:
                    savePath = Path.Combine("upload", "doc");
                    break;
                default:
                    savePath = Path.Combine("upload", "other");
                    break;
            }
            return savePath;
        }
    }
}
