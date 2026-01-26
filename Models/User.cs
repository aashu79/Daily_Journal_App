using SQLite;

namespace Daily_Journal_App.Models;

[Table("Users")]
public class User
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string OTP { get; set; } = string.Empty;
}