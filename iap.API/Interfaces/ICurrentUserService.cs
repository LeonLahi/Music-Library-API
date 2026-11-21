public interface ICurrentUserService
{
    int? UserId { get; } // Store the usersId during runtime for matching records
}