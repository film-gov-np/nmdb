using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Dtos.Film;

public record FilmRoleCategoryDto(int Id, string CategoryName, int DisplayOrder);
