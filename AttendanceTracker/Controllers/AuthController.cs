using Microsoft.AspNetCore.Mvc;
using AttendanceTracker.Models;
using AttendanceTracker.Services;

namespace AttendanceTracker.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            _logger.LogInformation("Login attempt for email: {Email}", request.Email);

            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest(new { message = "Email and password are required" });
            }

            var response = await _authService.LoginAsync(request);
            
            if (response == null)
            {
                _logger.LogWarning("Failed login attempt for email: {Email}", request.Email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            _logger.LogInformation("Successful login for email: {Email}", request.Email);
            return Ok(response);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login for email: {Email}", request.Email);
            return StatusCode(500, new { message = $"Server error: {ex.Message}" });
        }
    }

    [HttpPost("logout")]
    public IActionResult Logout()
    {
        // JWT tokens are stateless, so logout is handled client-side
        return Ok(new { message = "Logged out successfully" });
    }

    [HttpGet("test")]
    public IActionResult Test()
    {
        return Ok(new { message = "Auth API is working!", timestamp = DateTime.Now });
    }
}