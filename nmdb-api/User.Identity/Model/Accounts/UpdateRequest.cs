namespace User.Identity.Model;

using System.ComponentModel.DataAnnotations;
using User.Identity.Entities;

public class UpdateRequest
{
    private string _password;
    private string _confirmPassword;
    private string _email;
    
    public string Idx { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
       

    [EmailAddress]
    public string Email
    {
        get => _email;
        set => _email = replaceEmptyWithNull(value);
    }

    public string Password
    {
        get => _password;
        set => _password = replaceEmptyWithNull(value);
    }

    [Compare("Password")]
    public string ConfirmPassword 
    {
        get => _confirmPassword;
        set => _confirmPassword = replaceEmptyWithNull(value);
    }

    // helpers

    private string replaceEmptyWithNull(string value)
    {
        // replace empty string with null to make field optional
        return string.IsNullOrEmpty(value) ? null : value;
    }
}