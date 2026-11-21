using System.Security.Claims;

public class CurrentUserService : ICurrentUserService
{
    private readonly IHttpContextAccessor _accessor;
    public CurrentUserService(IHttpContextAccessor accessor) => _accessor = accessor;

    // Get UserId from token when user logs in to filter so user only sees their own records
    public int? UserId =>
        int.TryParse(_accessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier), out var id)
            ? id : null;
}