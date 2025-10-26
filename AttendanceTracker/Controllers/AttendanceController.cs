using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using AttendanceTracker.Models;
using AttendanceTracker.Services;

namespace AttendanceTracker.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class AttendanceController : ControllerBase
{
    private readonly AttendanceService _attendanceService;
    private readonly ILogger<AttendanceController> _logger;

    public AttendanceController(AttendanceService attendanceService, ILogger<AttendanceController> logger)
    {
        _attendanceService = attendanceService;
        _logger = logger;
    }

    [HttpGet("students")]
    public async Task<IActionResult> GetAllStudents()
    {
        try
        {
            _logger.LogInformation("Fetching all students");
            var students = await _attendanceService.GetAllStudentsAsync();
            return Ok(students);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching students");
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("students/{id}")]
    public async Task<IActionResult> GetStudentById(int id)
    {
        try
        {
            _logger.LogInformation("Fetching student with ID: {Id}", id);
            var student = await _attendanceService.GetStudentByIdAsync(id);
            
            if (student == null)
            {
                return NotFound(new { message = "Student not found" });
            }

            return Ok(student);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching student with ID: {Id}", id);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    // NEW: Add Student
    [HttpPost("students")]
    public async Task<IActionResult> AddStudent([FromBody] AddStudentRequest request)
    {
        try
        {
            _logger.LogInformation("Adding new student: {Name}", request.Name);

            if (string.IsNullOrWhiteSpace(request.Name) || 
                string.IsNullOrWhiteSpace(request.RollNumber) || 
                string.IsNullOrWhiteSpace(request.Class))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            var studentId = await _attendanceService.AddStudentAsync(request);
            
            if (studentId > 0)
            {
                return Ok(new { message = "Student added successfully", id = studentId });
            }
            
            return BadRequest(new { message = "Failed to add student" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding student: {Name}", request.Name);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    // NEW: Update Student
    [HttpPut("students/{id}")]
    public async Task<IActionResult> UpdateStudent(int id, [FromBody] AddStudentRequest request)
    {
        try
        {
            _logger.LogInformation("Updating student with ID: {Id}", id);

            if (string.IsNullOrWhiteSpace(request.Name) || 
                string.IsNullOrWhiteSpace(request.RollNumber) || 
                string.IsNullOrWhiteSpace(request.Class))
            {
                return BadRequest(new { message = "All fields are required" });
            }

            var result = await _attendanceService.UpdateStudentAsync(id, request);
            
            if (result)
            {
                return Ok(new { message = "Student updated successfully" });
            }
            
            return NotFound(new { message = "Student not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating student with ID: {Id}", id);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    // NEW: Delete Student
    [HttpDelete("students/{id}")]
    public async Task<IActionResult> DeleteStudent(int id)
    {
        try
        {
            _logger.LogInformation("Deleting student with ID: {Id}", id);

            var result = await _attendanceService.DeleteStudentAsync(id);
            
            if (result)
            {
                return Ok(new { message = "Student and all attendance records deleted successfully" });
            }
            
            return NotFound(new { message = "Student not found" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting student with ID: {Id}", id);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpPost("mark")]
    public async Task<IActionResult> MarkAttendance([FromBody] MarkAttendanceRequest request)
    {
        try
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new { message = "Teacher ID not found in token" });
            }

            var teacherId = int.Parse(teacherIdClaim);
            
            _logger.LogInformation("Marking attendance for student {StudentId} by teacher {TeacherId}", 
                request.StudentId, teacherId);

            var result = await _attendanceService.MarkAttendanceAsync(request, teacherId);
            
            if (result)
            {
                return Ok(new { message = "Attendance marked successfully", data = request });
            }
            
            return BadRequest(new { message = "Failed to mark attendance" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking attendance for student: {StudentId}", request.StudentId);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("date/{date}")]
    public async Task<IActionResult> GetAttendanceByDate(DateTime date)
    {
        try
        {
            _logger.LogInformation("Fetching attendance for date: {Date}", date);
            var attendance = await _attendanceService.GetAttendanceByDateAsync(date);
            return Ok(attendance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching attendance for date: {Date}", date);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetStudentAttendance(
        int studentId, 
        [FromQuery] DateTime? startDate, 
        [FromQuery] DateTime? endDate)
    {
        try
        {
            _logger.LogInformation("Fetching attendance history for student: {StudentId}", studentId);
            var attendance = await _attendanceService.GetStudentAttendanceAsync(studentId, startDate, endDate);
            return Ok(attendance);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching attendance for student: {StudentId}", studentId);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("report/{studentId}")]
    public async Task<IActionResult> GetStudentReport(int studentId)
    {
        try
        {
            _logger.LogInformation("Generating report for student: {StudentId}", studentId);
            var report = await _attendanceService.GetStudentReportAsync(studentId);
            
            if (report.Student == null)
            {
                return NotFound(new { message = "Student not found" });
            }

            return Ok(report);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating report for student: {StudentId}", studentId);
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            _logger.LogInformation("Fetching dashboard statistics");
            var stats = await _attendanceService.GetDashboardStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching dashboard statistics");
            return StatusCode(500, new { message = $"Error: {ex.Message}" });
        }
    }

    [HttpGet("test")]
    [AllowAnonymous]
    public IActionResult Test()
    {
        return Ok(new { message = "Attendance API is working!", timestamp = DateTime.Now });
    }
}