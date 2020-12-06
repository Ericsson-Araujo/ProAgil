using System;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class LoteDto
    {
        public int Id { get; set; }

        [Required, StringLength(100, MinimumLength=3, ErrorMessage="O nome de ter entre 3 e 100 caracteres")]
        public string Nome { get; set; }
        
        [Required(ErrorMessage="O campo {0} deve ser preenchido")]
        public decimal Preco { get; set; }
        
        public DateTime? DataInicio { get; set; }
        public DateTime? DataFim { get; set; }
        
        public int quantidade { get; set; }        
    }
}