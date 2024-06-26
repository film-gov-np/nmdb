﻿using System.Text.Json.Serialization;

namespace Application.Dtos.Auth;

public class AuthenticateResponse : AuthBaseResponse
{
    [JsonIgnore]
    public string JwtToken { get; set; }
    [JsonIgnore]
    public string RefreshToken { get; set; }
}

public class AuthBaseResponse
{
    public string Id { get; set; }
    public string Email { get; set; }
    public bool IsVerified { get; set; }
    public bool Authenticated { get; set; }
    public bool IsCrew { get; set; } = false;
    public string? Name { get; set; }
    public string Role { get; set; }
    public int? CrewId { get; set; }
    public string? ProfilePhotoUrl { get; set; }
}
