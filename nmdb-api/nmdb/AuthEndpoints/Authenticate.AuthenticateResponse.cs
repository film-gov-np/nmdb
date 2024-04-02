namespace nmdb.AuthEndpoints
{
    public class AuthenticateResponse
    {
        public AuthenticateResponse(string messages)
        {
            Message = messages;
        }

        public string Message { get; set; }
    }
}
