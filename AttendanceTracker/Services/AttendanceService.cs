using AttendanceTracker.Models;
using MySql.Data.MySqlClient;

namespace AttendanceTracker.Services;

public class AttendanceService
{
    private readonly DatabaseService _db;

    public AttendanceService(DatabaseService db)
    {
        _db = db;
    }

    public async Task<List<Student>> GetAllStudentsAsync()
    {
        var students = new List<Student>();
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = "SELECT * FROM students ORDER BY class, roll_number";
        using var command = new MySqlCommand(query, connection);
        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            students.Add(new Student
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                Name = reader.GetString(reader.GetOrdinal("name")),
                RollNumber = reader.GetString(reader.GetOrdinal("roll_number")),
                Class = reader.GetString(reader.GetOrdinal("class")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
            });
        }

        return students;
    }

    public async Task<Student?> GetStudentByIdAsync(int id)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = "SELECT * FROM students WHERE id = @Id";
        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Id", id);

        using var reader = await command.ExecuteReaderAsync();
        
        if (!await reader.ReadAsync())
            return null;

        return new Student
        {
            Id = reader.GetInt32(reader.GetOrdinal("id")),
            Name = reader.GetString(reader.GetOrdinal("name")),
            RollNumber = reader.GetString(reader.GetOrdinal("roll_number")),
            Class = reader.GetString(reader.GetOrdinal("class")),
            CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
        };
    }

    // NEW: Add Student
    public async Task<int> AddStudentAsync(AddStudentRequest request)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = @"INSERT INTO students (name, roll_number, class, created_at) 
                      VALUES (@Name, @RollNumber, @Class, @CreatedAt);
                      SELECT LAST_INSERT_ID();";

        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Name", request.Name.Trim());
        command.Parameters.AddWithValue("@RollNumber", request.RollNumber.Trim());
        command.Parameters.AddWithValue("@Class", request.Class.Trim());
        command.Parameters.AddWithValue("@CreatedAt", DateTime.Now);

        var result = await command.ExecuteScalarAsync();
        return Convert.ToInt32(result);
    }

    // NEW: Update Student
    public async Task<bool> UpdateStudentAsync(int id, AddStudentRequest request)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = @"UPDATE students 
                      SET name = @Name, roll_number = @RollNumber, class = @Class 
                      WHERE id = @Id";

        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Id", id);
        command.Parameters.AddWithValue("@Name", request.Name.Trim());
        command.Parameters.AddWithValue("@RollNumber", request.RollNumber.Trim());
        command.Parameters.AddWithValue("@Class", request.Class.Trim());

        var rowsAffected = await command.ExecuteNonQueryAsync();
        return rowsAffected > 0;
    }

    // NEW: Delete Student (and all their attendance records)
    public async Task<bool> DeleteStudentAsync(int id)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        using var transaction = await connection.BeginTransactionAsync();
        
        try
        {
            // First delete all attendance records for this student
            var deleteAttendanceQuery = "DELETE FROM attendance WHERE student_id = @Id";
            using (var cmd = new MySqlCommand(deleteAttendanceQuery, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@Id", id);
                await cmd.ExecuteNonQueryAsync();
            }

            // Then delete the student
            var deleteStudentQuery = "DELETE FROM students WHERE id = @Id";
            using (var cmd = new MySqlCommand(deleteStudentQuery, connection, transaction))
            {
                cmd.Parameters.AddWithValue("@Id", id);
                var rowsAffected = await cmd.ExecuteNonQueryAsync();
                
                if (rowsAffected > 0)
                {
                    await transaction.CommitAsync();
                    return true;
                }
            }

            await transaction.RollbackAsync();
            return false;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task<bool> MarkAttendanceAsync(MarkAttendanceRequest request, int teacherId)
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = @"INSERT INTO attendance (student_id, date, status, teacher_id, remarks) 
                      VALUES (@StudentId, @Date, @Status, @TeacherId, @Remarks)
                      ON DUPLICATE KEY UPDATE 
                      status = @Status, teacher_id = @TeacherId, remarks = @Remarks";

        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@StudentId", request.StudentId);
        command.Parameters.AddWithValue("@Date", request.Date.Date);
        command.Parameters.AddWithValue("@Status", request.Status.ToLower());
        command.Parameters.AddWithValue("@TeacherId", teacherId);
        command.Parameters.AddWithValue("@Remarks", request.Remarks ?? (object)DBNull.Value);

        await command.ExecuteNonQueryAsync();
        return true;
    }

    public async Task<List<AttendanceWithStudent>> GetAttendanceByDateAsync(DateTime date)
    {
        var records = new List<AttendanceWithStudent>();
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = @"SELECT a.*, s.name as student_name, s.roll_number, s.class 
                      FROM attendance a
                      JOIN students s ON a.student_id = s.id
                      WHERE a.date = @Date
                      ORDER BY s.class, s.roll_number";

        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@Date", date.Date);

        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            records.Add(new AttendanceWithStudent
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                StudentId = reader.GetInt32(reader.GetOrdinal("student_id")),
                StudentName = reader.GetString(reader.GetOrdinal("student_name")),
                RollNumber = reader.GetString(reader.GetOrdinal("roll_number")),
                Class = reader.GetString(reader.GetOrdinal("class")),
                Date = reader.GetDateTime(reader.GetOrdinal("date")),
                Status = reader.GetString(reader.GetOrdinal("status")),
                Remarks = reader.IsDBNull(reader.GetOrdinal("remarks")) ? null : reader.GetString(reader.GetOrdinal("remarks"))
            });
        }

        return records;
    }

    public async Task<List<Attendance>> GetStudentAttendanceAsync(int studentId, DateTime? startDate = null, DateTime? endDate = null)
    {
        var records = new List<Attendance>();
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var query = "SELECT * FROM attendance WHERE student_id = @StudentId";
        
        if (startDate.HasValue)
            query += " AND date >= @StartDate";
        if (endDate.HasValue)
            query += " AND date <= @EndDate";
            
        query += " ORDER BY date DESC";

        using var command = new MySqlCommand(query, connection);
        command.Parameters.AddWithValue("@StudentId", studentId);
        
        if (startDate.HasValue)
            command.Parameters.AddWithValue("@StartDate", startDate.Value.Date);
        if (endDate.HasValue)
            command.Parameters.AddWithValue("@EndDate", endDate.Value.Date);

        using var reader = await command.ExecuteReaderAsync();

        while (await reader.ReadAsync())
        {
            records.Add(new Attendance
            {
                Id = reader.GetInt32(reader.GetOrdinal("id")),
                StudentId = reader.GetInt32(reader.GetOrdinal("student_id")),
                Date = reader.GetDateTime(reader.GetOrdinal("date")),
                Status = reader.GetString(reader.GetOrdinal("status")),
                TeacherId = reader.IsDBNull(reader.GetOrdinal("teacher_id")) ? null : reader.GetInt32(reader.GetOrdinal("teacher_id")),
                Remarks = reader.IsDBNull(reader.GetOrdinal("remarks")) ? null : reader.GetString(reader.GetOrdinal("remarks")),
                CreatedAt = reader.GetDateTime(reader.GetOrdinal("created_at"))
            });
        }

        return records;
    }

    public async Task<AttendanceReport> GetStudentReportAsync(int studentId)
    {
        var student = await GetStudentByIdAsync(studentId);
        var attendance = await GetStudentAttendanceAsync(studentId);

        var totalPresent = attendance.Count(a => a.Status == "present");
        var totalAbsent = attendance.Count(a => a.Status == "absent");
        var totalLate = attendance.Count(a => a.Status == "late");
        var total = attendance.Count;

        return new AttendanceReport
        {
            Student = student,
            TotalPresent = totalPresent,
            TotalAbsent = totalAbsent,
            TotalLate = totalLate,
            TotalDays = total,
            AttendancePercentage = total > 0 ? Math.Round((double)totalPresent / total * 100, 2) : 0,
            RecentAttendance = attendance.Take(30).ToList()
        };
    }

    public async Task<DashboardStats> GetDashboardStatsAsync()
    {
        using var connection = _db.GetConnection();
        await connection.OpenAsync();

        var stats = new DashboardStats();

        // Total students
        var query1 = "SELECT COUNT(*) FROM students";
        using (var command = new MySqlCommand(query1, connection))
        {
            stats.TotalStudents = Convert.ToInt32(await command.ExecuteScalarAsync());
        }

        // Today's attendance
        var today = DateTime.Today;
        var query2 = @"SELECT status, COUNT(*) as count 
                       FROM attendance 
                       WHERE date = @Today 
                       GROUP BY status";
        
        using (var command = new MySqlCommand(query2, connection))
        {
            command.Parameters.AddWithValue("@Today", today);
            using var reader = await command.ExecuteReaderAsync();
            
            while (await reader.ReadAsync())
            {
                var status = reader.GetString(reader.GetOrdinal("status"));
                var count = reader.GetInt32(reader.GetOrdinal("count"));
                
                if (status == "present") stats.PresentToday = count;
                else if (status == "absent") stats.AbsentToday = count;
                else if (status == "late") stats.LateToday = count;
            }
        }

        // Overall attendance percentage
        var query3 = @"SELECT 
                        COUNT(CASE WHEN status = 'present' THEN 1 END) as present_count,
                        COUNT(*) as total_count
                       FROM attendance";
        
        using (var command = new MySqlCommand(query3, connection))
        {
            using var reader = await command.ExecuteReaderAsync();
            if (await reader.ReadAsync())
            {
                var presentCount = reader.GetInt32(reader.GetOrdinal("present_count"));
                var totalCount = reader.GetInt32(reader.GetOrdinal("total_count"));
                stats.OverallAttendance = totalCount > 0 ? Math.Round((double)presentCount / totalCount * 100, 2) : 0;
            }
        }

        return stats;
    }
}