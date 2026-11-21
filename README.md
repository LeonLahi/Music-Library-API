# Music Library Manager

## Getting Started 

Prerequisites:
- .NET 8 SDK
- Docker

1 Start Docker Desktop

2 Initialise database

```docker compose up -d```

3 Move to API folder

```cd iap.API```

4 Initialise user secrets and set the connection string (match the password in docker-compose.yml)

```dotnet user-secrets init```

```dotnet user-secrets set "ConnectionStrings:DefaultConnection" 'Server=localhost,1434;Database=IapDb;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=True'``` 

5 Create a key for generating auth tokens

```dotnet user-secrets set "JwtSettings:SecretKey" "<your-own-random-string-at-least-32-characters>"```

6 Start the API

```dotnet watch run```

7 Open `https://localhost:<port>/swagger`

8 Register an account (or log in if you already have one), then paste the token into the Authorize button in Swagger.

9 Create tracks and playlists

10 Create listening sessions from tracks and playlists, then fetch listening stats.

## Status
**Complete**
- Tracks
- Playlists
- User auth

**Work in Progress**
- Dealing with all edge cases
- Creating default playlist when user registers
- Seeding and applying genres to tracks
- Playback and logging listening sessions
- Extra listening stats
- React user interface
- User account management

**Future Features** 
- Populating track metadata from a third-party database API
- Chapters to split mixes into individual tracks

## Tech Stack
- C#
- .NET 8.0
- EF Core
- JWT Authentication
- FluentValidation
- Swagger/OpenAPI
- SQL Server
- Docker

## Design

### Data Model
**Tracks** store two seperate sets of track details. One set is the original details which are nullable columns that will store metadata seeded from a third-party database if available. The second set is given by the user, which allows for custom details to be added and will display the original in the user interface if both are available. The track file is stored as a URL linking to the file itself. This could be a path to a local file on the user's system or be linked from cloud storage, for example. 

**Playlists** are various types of track collections (e.g. album, playlist) that are defined using an enum. The type *Folder* uses validation to only allow other playlists to be stored inside it, and each child playlist contains a *ParentId* field referencing the folder. Each playlist contains an *IsDefault* field, which will be used in the future for creating a default playlist when the user registers. This will simplify the structure of data by keeping every track organised into a collection for displaying in the user interface. Instead of a class property, it may be better to create a new playlist type of *Default* as there will only ever be one occasion where *IsDefault* is true, making it redundant to store for every playlist. 

### Request Handling
The **FluentValidation** library is used to check user input and return appropriate error messages for bad data before any logic is executed. Each DTO has a validator class (inheriting AbstractValidator) that runs through a filter before the controller executes. Validation rules can be chained, and custom rules can be added for specific needs, such as checking that a URL is valid and points to a supported file format.

**Results** store the outcome of business logic checks to maintain the program's integrity, while informing the user on what they need to do. A *Result* is a class that contains information to tell a controller if the logic it executed was successful and can be made of custom types that send a specific error message through JSON to the user. For example, if a playlist with the same name already exists, no data will be modified and a result of type *Conflict* will be returned to the controller to prevent duplicate records in the database. If all checks pass, a successful result (*IsSuccess*) is returned.

Any exceptions outside of business logic are captured by the **global exception handler** which logs the issue and returns the default status code error through JSON to inform the user that something unexpected happened. This only includes anything outside of the program such as a third-party error from an API, which cannot be fixed through user input.   

### Security
**ASP.NET Core Identity** is used to register with a hashed password and validate details during login. A *Generate Token* class has been created to make a unique token for login authorisation based on the user details and the secret key they set. Roles (e.g. admin) could be added to the token to give different levels of access, but currently each user only accesses their own data. 