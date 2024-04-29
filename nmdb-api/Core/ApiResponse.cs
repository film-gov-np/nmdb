using System.Net;
using System.Text.Json.Serialization;

namespace Core
{
    public class ApiResponse : BaseResponse
    {
    }
    public class ApiResponse<T>
    {
        public bool IsSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; }
        public List<string> Errors { get; set; }

        public ApiResponse()
        {
            Errors = new List<string>();
        }

        public static ApiResponse<T> SuccessResponse(T? data, string? message = default(string?), HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new ApiResponse<T> { IsSuccess = true, StatusCode = statusCode, Data = data, Message = message };
        }

        public static ApiResponse<T> ErrorResponse(string errorMessage, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            return new ApiResponse<T> { IsSuccess = false, StatusCode = statusCode, Message = errorMessage, Errors = new List<string> { errorMessage } }; ;
        }
        public static ApiResponse<T> ErrorResponse(List<string> errors, HttpStatusCode statusCode = HttpStatusCode.BadRequest)
        {
            return new ApiResponse<T> { IsSuccess = false, StatusCode = statusCode, Message = "One or more errors occurred", Errors = errors };
        }
        public static ApiResponse<T> SuccessResponseWithoutData(string message = null, HttpStatusCode statusCode = HttpStatusCode.OK)
        {
            return new ApiResponse<T> { IsSuccess = true, StatusCode = statusCode, Message = message };
        }
    }


    public class Data
    {
        public string Idx { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }
        public string JwtToken { get; set; }

    }

    public class UserDetailResponse
    {
        /// <summary>
        /// Defines the status of respose 
        /// </summary>
        public HttpStatusCode status { get; set; } = HttpStatusCode.OK;
        /// <summary>
        /// Clear message that defines the respose clearly
        /// </summary>
        public string message { get; set; } = string.Empty;
        /// <summary>
        /// Holds the result object to be transmitted
        /// </summary>
        public UserDetailData data { get; set; }
        public bool success { get; set; }
        public int error_code { get; set; }

    }

    public class UserDetailData
    {
        public string Idx { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public DateTime Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool IsVerified { get; set; }
        public object RolesPid { get; set; }
    }

}
