using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProAgil.WebAPI.Dtos
{
    public class EventoDto
    {
        [Required(ErrorMessage="O local é de preenchimento obrigatório")]
        public string Local {get;set;} 

        [Required(ErrorMessage="A data do evento é obrigatória")]
        public DateTime DataEvento {get;set;}
        
        [Required(ErrorMessage="O tema deve ser preenchido")]
        public string Tema {get;set;}

        [Range(2,12000, ErrorMessage="A quantidade de pessoas deve ser entre 2 e 120.000")]
        public int QtdPessoas {get;set;}

        public string ImagemURL { get; set; }
        public string Telefone { get; set; }
        
        [EmailAddress(ErrorMessage="O e-mail inserido não é válido")]
        public string Email { get; set; }

        public List<LoteDto> Lotes {get;set;}
        public List<RedeSocialDto> RedesSociais { get; set; }
        public List<PalestranteDto> Palestrantes { get; set; }
    }
}