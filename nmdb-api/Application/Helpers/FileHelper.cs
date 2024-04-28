using Application.Dtos.Media;
using Core.Constants;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Helpers
{
    public class FileHelper
    {
        public string GetFileNewName(string fileName, string savePath, bool readableName)
        {
            if (!readableName)
            {
                string ext = Path.GetExtension(fileName);
                return Guid.NewGuid().ToString().Replace("-", "") + ext;
            }
            return GetUniqueFileName(0, fileName, savePath);
        }
        private string GetUniqueFileName(int count, string fileName, string savePath)
        {
            if (File.Exists(savePath + "\\" + fileName))
            {
                count++;
                string ext = Path.GetExtension(fileName);
                // fileName = fileName.Replace(ext, "") + "_" + count + ext;
                fileName = $"{fileName.Replace(ext, "").Replace(" ", "")}_{DateTime.Now.ToString("dd-MM-yy-HH-mm-ss")}{ext}";
                GetUniqueFileName(count, fileName, savePath);
            }
            return fileName;
        }
        public bool ValidExtension(string fileName, string[] allowExtension)
        {
            string extension = Path.GetExtension(fileName).ToLower();
            foreach (string ext in allowExtension)
            {
                if (ext == extension)
                    return true;
            }
            return false;
        }
        public void CreateThumbnail(string imgPath, int TargetSize, string SavePath)
        {
            Bitmap b = new Bitmap(imgPath);
            Size newSize = CalculateDimensions(b.Size, TargetSize);
            if (newSize.Width < 1)
                newSize.Width = 1;
            if (newSize.Height < 1)
                newSize.Height = 1;
            b.Dispose();
            var newWidth = (int)(newSize.Width);
            var newHeight = (int)(newSize.Height);
            var thumbnailImg = new Bitmap(newWidth, newHeight);
            var thumbGraph = Graphics.FromImage(thumbnailImg);
            thumbGraph.CompositingQuality = CompositingQuality.HighQuality;
            thumbGraph.SmoothingMode = SmoothingMode.HighQuality;
            thumbGraph.InterpolationMode = InterpolationMode.HighQualityBicubic;
            var imageRectangle = new Rectangle(0, 0, newWidth, newHeight);
            System.Drawing.Image image = System.Drawing.Image.FromFile(imgPath);
            thumbGraph.DrawImage(image, imageRectangle);
            thumbnailImg.Save(SavePath, image.RawFormat);
            thumbnailImg.Dispose();
            thumbGraph.Dispose();
            image.Dispose();

        }
        private Size CalculateDimensions(Size OriginalSize, int TargetSize)
        {
            Size newSize = new Size();
            if (OriginalSize.Height > OriginalSize.Width) // portrait 
            {
                newSize.Width = (int)(OriginalSize.Width * (float)(TargetSize / (float)OriginalSize.Height));
                newSize.Height = TargetSize;
            }
            else // landscape or square
            {
                newSize.Height = (int)(OriginalSize.Height * (float)(TargetSize / (float)OriginalSize.Width));
                newSize.Width = TargetSize;
            }
            return newSize;
        }
        public FileValidationResult EnsureValidFile(string fileName, string allowedExtensions = "")
        {
            string ext = Path.GetExtension(fileName);
            FileValidationResult validationResult = new FileValidationResult() { FileType = eFileTypes.Other };
            if (string.IsNullOrEmpty(allowedExtensions))
            {
                if (AllowedUploadFiles.Image.Contains(ext.ToLower()))
                {
                    validationResult.Valid = true;
                    validationResult.FileType = eFileTypes.Image;
                }
                else if (AllowedUploadFiles.Video.Contains(ext))
                {
                    validationResult.Valid = true;
                    validationResult.FileType = eFileTypes.Video;
                }
                else if (AllowedUploadFiles.Audio.Contains(ext))
                {
                    validationResult.Valid = true;
                    validationResult.FileType = eFileTypes.Audio;
                }
                else if (
              AllowedUploadFiles.Document.Contains(ext))
                {
                    validationResult.Valid = true;
                    validationResult.FileType = eFileTypes.Document;
                }
                else if (AllowedUploadFiles.OtherFiles.Contains(ext))
                {
                    validationResult.Valid = true;
                    validationResult.FileType = eFileTypes.Other;
                }
            }
            else
            {
                List<string> AllowedStringList = allowedExtensions.Split(",").ToList();
                validationResult.FileType = eFileTypes.Other;
                validationResult.Valid = AllowedStringList.Exists(x => x.Trim().ToLower() == ext.Trim().ToLower());
            }
            return validationResult;
        }
    }
}
