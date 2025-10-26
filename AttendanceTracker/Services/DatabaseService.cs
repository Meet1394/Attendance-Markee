using MySql.Data.MySqlClient;

namespace AttendanceTracker.Services;

public class DatabaseService
{
    private readonly string _connectionString;

    public DatabaseService(IConfiguration configuration)
    {
        _connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? throw new Exception("Connection string not found in appsettings.json");
    }

    public MySqlConnection GetConnection()
    {
        return new MySqlConnection(_connectionString);
    }

    public async Task<bool> TestConnectionAsync()
    {
        try
        {
            using var connection = GetConnection();
            await connection.OpenAsync();
            return true;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Database connection failed: {ex.Message}");
            return false;
        }
    }
}