using Application.Dtos.Film;
using Application.Dtos.Media;
using Application.Helpers;
using Application.Interfaces.Services;
using Application.Models;
using Core;
using Core.Constants;
using Core.Shared;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
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
        private readonly string _uploadFolderPath;
        public FileService(IConfiguration configuration)
        {
            _uploadFolderPath = configuration["UploadFolderPath"];
            if (!Directory.Exists(_uploadFolderPath))
            {
                Directory.CreateDirectory(_uploadFolderPath);
            }
        }
        public async Task<ApiResponse<UploadResult>> UploadFile(FileDTO model)
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
                string path = Path.Combine(_uploadFolderPath, savePath);
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
                if (fileValid.FileType == eFileTypes.Image && model.Thumbnail)
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

        public bool RemoveFile(string filename)
        {
            try
            {
                FileHelper fileHelper = new FileHelper();
                var fileValid = fileHelper.EnsureValidFile(filename);
                string filePath = GetFilePath(fileValid.FileType);// later take filetype input for media management
                var file = Path.Combine(_uploadFolderPath, string.Concat(filePath, '\\', filename));
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

        private static string GetFilePath(eFileTypes fileType)
        {
            string savePath;
            switch (fileType)
            {
                case eFileTypes.Image:
                    savePath = Path.Combine("uploads", "img");
                    break;
                case eFileTypes.Video:
                    savePath = Path.Combine("uploads", "video");
                    break;
                case eFileTypes.Audio:
                    savePath = Path.Combine("uploads", "audio");
                    break;
                case eFileTypes.Document:
                    savePath = Path.Combine("uploads", "doc");
                    break;
                default:
                    savePath = Path.Combine("uploads", "other");
                    break;
            }
            return savePath;
        }
    }
}
