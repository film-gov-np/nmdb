﻿using Core.Constants;

namespace Application.Dtos.Media;

public class FileValidationResult
{
    public bool Valid { get; set; }
    public eFileTypes FileType { get; set; }
}
