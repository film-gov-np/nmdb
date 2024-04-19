using Application.Dtos.Media;
using Core;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces.Services
{
    public interface IFileService
    {
        public Task<ApiResponse<UploadResult>> UploadFile(FileDTO model, string webRootPath);
        public bool RemoveFile(string filename, string webRootPath);

        //public Task<ApiResponse<IList<MediaDTO>>> GetByFilter(FilterBase filter);
        //public Task<ApiResponse<MediaDTO>> GetById(int id);
        //public Task<ApiResponse> AddUpdateMedia(MediaDTO model, string webRootPath);
        //public Task<ApiResponse> DeleteById(int id, string currentUser, string webRootPath);

        //public Task<IList<ApiResponse>> GetAllMediaCategories();
    }
}
