using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AttendanceTracker.Models;
using MySql.Data.MySqlClient;

namespace AttendanceTracker.Services;

public class AuthService
{
    private readonly DatabaseService _db;
    private readonly IConfiguration _configuration;

    public AuthService(DatabaseService db, IConfiguration configuration)
    {
        _db = db;
        _configuration = configuration;
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = "SELECT id, email, name, password FROM teachers WHERE email = @Email";
        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Email", request.Email);

        using var reader = await command.ExecuteReaderAsync();
        
        if (!await reader.ReadAsync())
            return null;

        var storedPassword = reader.GetString(reader.GetOrdinal("password"));
        
        // Simple password check (in production, use BCrypt or similar)
        if (storedPassword != request.Password)
            return null;

        var teacher = new Teacher
        {
            Id = reader.GetInt32(reader.GetOrdinal("id")),
            Email = reader.GetString(reader.GetOrdinal("email")),
            Name = reader.GetString(reader.GetOrdinal("name"))
        };

        var token = GenerateJwtToken(teacher);

        return new LoginResponse
        {
            Token = token,
            Name = teacher.Name,
            Email = teacher.Email,
            TeacherId = teacher.Id
        };
    }

    private string GenerateJwtToken(Teacher teacher)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLong!");
        var tokenHandler = new JwtSecurityTokenHandler();
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, teacher.Id.ToString()),
                new Claim(ClaimTypes.Email, teacher.Email),
                new Claim(ClaimTypes.Name, teacher.Name)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature
            )
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}