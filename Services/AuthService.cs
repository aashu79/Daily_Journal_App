namespace Daily_Journal_App.Services;

public class AuthService
{
    private const string HARDCODED_PIN = "1234"; // Simple hardcoded PIN
    private bool isAuthenticated = false;

    public bool IsAuthenticated => isAuthenticated;

    public bool ValidatePIN(string pin)
    {
        if (pin == HARDCODED_PIN)
        {
            isAuthenticated = true;
            return true;
        }
        return false;
    }

    public void Logout()
    {
        isAuthenticated = false;
    }

    public string GetPINHint()
    {
        return "Hint: PIN is 1234";
    }
}
