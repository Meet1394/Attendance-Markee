namespace AttendanceTracker.Models;

public class Teacher
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class Student
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class Attendance
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty; // present, absent, late
    public int? TeacherId { get; set; }
    public string? Remarks { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class AttendanceWithStudent
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string StudentName { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}

// DTOs (Data Transfer Objects)
public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public int TeacherId { get; set; }
}

public class MarkAttendanceRequest
{
    public int StudentId { get; set; }
    public DateTime Date { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Remarks { get; set; }
}

// NEW: Request for adding/updating students
public class AddStudentRequest
{
    public string Name { get; set; } = string.Empty;
    public string RollNumber { get; set; } = string.Empty;
    public string Class { get; set; } = string.Empty;
}

public class AttendanceReport
{
    public Student? Student { get; set; }
    public int TotalPresent { get; set; }
    public int TotalAbsent { get; set; }
    public int TotalLate { get; set; }
    public int TotalDays { get; set; }
    public double AttendancePercentage { get; set; }
    public List<Attendance> RecentAttendance { get; set; } = new();
}

public class DashboardStats
{
    public int TotalStudents { get; set; }
    public int PresentToday { get; set; }
    public int AbsentToday { get; set; }
    public int LateToday { get; set; }
    public double OverallAttendance { get; set; }
}