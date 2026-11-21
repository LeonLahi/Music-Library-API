using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace iap.API.Dtos
{
    public class PlaylistTrackDto
    {
       public int Order { get; set; }
       public DateTimeOffset AddedAt { get; set; }
       public TrackDto Track { get; set; } = null!;
    }
}