using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace nmdb.Middlewares;

public class CamelCaseResponseMiddleware
{
    private readonly RequestDelegate _next;

    public CamelCaseResponseMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        var originalBodyStream = context.Response.Body;

        using (var responseBody = new MemoryStream())
        {
            context.Response.Body = responseBody;

            await _next(context);

            responseBody.Seek(0, SeekOrigin.Begin);

            // Check if the response should be intercepted (e.g., based on content type)
            if (context.Response.ContentType?.ToLower().Contains("application/json") == true)
            {
                // Read response
                var responseText = await new StreamReader(responseBody).ReadToEndAsync();

                // Check if the response is a Fluent Validation error response
                if (IsFluentValidationErrorResponse(responseText))
                {
                    // Convert response keys to camelCase
                    var camelCaseResponseText = ConvertResponseToCamelCase(responseText);

                    // Write modified response back
                    context.Response.Body = originalBodyStream;
                    await context.Response.WriteAsync(camelCaseResponseText);
                    return;
                }
            }

            // If the response doesn't meet the criteria for interception, write it back unchanged
            responseBody.Seek(0, SeekOrigin.Begin);
            await responseBody.CopyToAsync(originalBodyStream);
        }
    }

    private bool IsFluentValidationErrorResponse(string response)
    {
        // Check if the response has structure indicative of Fluent Validation error
        JObject jsonResponse = null;
        try
        {
            jsonResponse = JObject.Parse(response);
        }
        catch (JsonReaderException)
        {
            // If parsing fails, it's not a JSON response
            return false;
        }

        // Check for presence of typical Fluent Validation error properties
        return jsonResponse["type"] != null &&
               jsonResponse["title"]?.ToString().Contains("validation errors occurred") == true &&
               jsonResponse["errors"] != null;
    }

    private string ConvertResponseToCamelCase(string response)
    {
        // Implement logic to convert response keys to camelCase here
        // For example, you can use JSON.NET or any other library for JSON manipulation

        // For simplicity, let's assume the response is JSON and use JSON.NET
        JObject jsonResponse = JObject.Parse(response);
        ConvertKeysToCamelCase(jsonResponse);

        return jsonResponse.ToString();
    }

    private void ConvertKeysToCamelCase(JToken token)
    {
        if (token.Type == JTokenType.Object)
        {
            JObject obj = (JObject)token;
            foreach (JProperty prop in obj.Properties().ToList())
            {
                // Rename key to camelCase
                prop.Replace(new JProperty(Char.ToLowerInvariant(prop.Name[0]) + prop.Name.Substring(1), prop.Value));

                // Recursively convert child tokens
                ConvertKeysToCamelCase(prop.Value);
            }
        }
        else if (token.Type == JTokenType.Array)
        {
            JArray array = (JArray)token;
            foreach (JToken child in array)
            {
                // Recursively convert child tokens
                ConvertKeysToCamelCase(child);
            }
        }
    }
}

public static class CamelCaseResponseMiddlewareExtensions
{
    public static IApplicationBuilder UseCamelCaseResponseMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CamelCaseResponseMiddleware>();
    }
}

