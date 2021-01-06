import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/_models/Evento';
import { Lote } from 'src/app/_models/Lote';
import { RedeSocial } from 'src/app/_models/RedeSocial';
import { EventoService } from 'src/app/_services/evento.service';

@Component({
  selector: 'app-evento-edit',
  templateUrl: './eventoEdit.component.html',
  styleUrls: ['./eventoEdit.component.css']
})
export class EventoEditComponent implements OnInit {
  titulo = 'Editar Evento';
  imagemURL = 'assets/img/upload-image.png';
  evento: Evento = new Evento();
  registerForm: FormGroup;
  file: File;
  fileNameToUpload: string;
  dataAtual: string;
  dataEvento: string;

  get lotes(): FormArray {
    return this.registerForm.get('lotes') as FormArray;
  }

  get redesSociais(): FormArray {
    return this.registerForm.get('redesSociais') as FormArray;
  }

  constructor(
      private eventoService: EventoService
    , private fb: FormBuilder
    , private localeService: BsLocaleService
    , private router: ActivatedRoute
    , private toastr: ToastrService){
    this.localeService.use('pt-br');
   }

  validation() {
    this.registerForm = this.fb.group({
      id: [''],
      tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      imagemURL: [''],
      qtdPessoas: ['', [Validators.required, Validators.max(120000)]],
      telefone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      lotes: this.fb.array([]),
      redesSociais: this.fb.array([])
    });
  }

  carregarEvento() {
    const idEvento = +this.router.snapshot.paramMap.get('id');
    this.eventoService.getEventoById(idEvento)
      .subscribe(
        (evento: Evento) => {
          this.evento = Object.assign({}, evento);
          this.fileNameToUpload = evento.imagemURL.toString();
          this.imagemURL = `http://localhost:5000/resources/images/${evento.imagemURL}?_ts=${this.dataAtual}`;
          this.evento.imagemURL = '';
          this.registerForm.patchValue(this.evento);

          evento.lotes.forEach(lote => {
            this.lotes.push(this.criaLote(lote)); });

          evento.redesSociais.forEach(rede => {
            this.redesSociais.push(this.criaRedeSocial(rede)); });
      });
  }

  criaLote(lote: any) {
    return this.fb.group({
      id: [lote.id],
      nome: [lote.nome, Validators.required],
      quantidade: [lote.quantidade, Validators.required],
      preco: [lote.preco, Validators.required],
      dataInicio: [lote.dataInicio],
      dataFim: [lote.dataFim]
    });
  }

  criaRedeSocial(redeSocial: any) {
    return this.fb.group({
      id: [redeSocial.id],
      nome: [redeSocial.nome, Validators.required],
      url: [redeSocial.url, Validators.required]
    });
  }

  adicionarLote() {
    this.lotes.push(this.criaLote({ id: 0 }));
  }

  adicionarRedeSocial() {
    this.redesSociais.push(this.criaRedeSocial({ id : 0 }));
  }

  removerLote(id: number) {
    this.lotes.removeAt(id);
  }

  removerRedeSocial(id: number) {
    this.redesSociais.removeAt(id);
  }

  onFileChange(file: FileList) {
    const reader = new FileReader();

    reader.onload = (event: any) => this.imagemURL = event.target.result;

    this.file = event.target.files;

    reader.readAsDataURL(file[0]);
  }

  salvarEvento() {
    this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
    this.evento.imagemURL = this.fileNameToUpload;

    this.uploadImagem();

    this.eventoService.putEvento(this.evento).subscribe(
      () => this.toastr.success('Editado com sucesso!'),
      error => this.toastr.error(`Erro ao editar: ${error}`)
    );
  }

  uploadImagem() {
    if (this.registerForm.get('imagemURL').value !== '') {
        this.eventoService.postUpload(this.file, this.fileNameToUpload).subscribe(
          () => {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.imagemURL = `http://localhost:5000/resources/images/${this.evento.imagemURL}?_ts=${this.dataAtual}`;
          }
        );
    }
  }

  ngOnInit() {
    this.validation();
    this.carregarEvento();
  }

}
