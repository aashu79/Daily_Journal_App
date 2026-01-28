using SQLite;

namespace Daily_Journal_App.Models;

[Table("Moods")]
public class Mood
{
    [PrimaryKey, AutoIncrement]
    public int Id { get; set; }

    // Display name of the mood (e.g., "Happy", "Sad")
    public string Name { get; set; } = string.Empty;

    // Category denotes Positive / Neutral / Negative (used for analytics)
    public string Category { get; set; } = string.Empty;

    // MoodType is an additional descriptor (can be used for sub-typing or grouping)
    // e.g., same as Name or values like "All" when needed
    public string MoodType { get; set; } = string.Empty;
}