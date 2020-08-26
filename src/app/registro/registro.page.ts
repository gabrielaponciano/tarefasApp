import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { CpfValidator } from '../validators/cpf-validator';
import { ComparacaoValidator } from '../validators/comparacao-validator';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public formRegistro: FormGroup;

  public mensagens_validacao = {
    nome: [
      {tipo: 'required', mensagem: 'O campo Nome é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O nome deve ter pelo menos 3 caracteres!'}
    ],
    cpf: [
      {tipo: 'required', mensagem: 'O campo CPF é obrigatório!'},
      {tipo: 'minlength', mensagem: 'O CPF deve ter pelo menos 11 cracteres!' },
      {tipo: 'maxlength', mensagem: 'O CPF deve ter no máximo 14 cracteres!' },
      {tipo: 'invalido', mensagem: 'CPF inválido'}
    ],
    dataNascimento: [
      {tipo: 'required', mensagem: 'O campo Data de nascimento é obrigatório!'},
    ],
    genero: [
      {tipo: 'required', mensagem: 'Escolha um gênero'},
    ],
    celular: [
      {tipo: 'minlength', mensagem: 'O campo Celular deve ter no mínimo 10 caracteres!'},
      {tipo: 'maxlength', mensagem: 'O campo Celular deve ter no máximo 16 cracteres!' }
    ],
    email: [
      {tipo: 'required', mensagem: 'O campo E-mail é obrigatório!'},
      {tipo: 'email', mensagem: 'E-mail inválido!'}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo Senha é obrigatório!'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 cracteres!' }
    ],
    confirma: [
      {tipo: 'required', mensagem: 'O campo Confirmar Senha é obrigatório!'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 cracteres!' },
      {tipo: 'comparacao', mensagem: 'Deve ser igual a senha'}
    ]

  };

  constructor(private formBuilder: FormBuilder,
    private router: Router) {
    this.formRegistro = formBuilder.group({
      nome: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      cpf: ['', Validators.compose([
        Validators.required, 
        Validators.minLength(11), 
        Validators.maxLength(14),
        CpfValidator.cpfValido
      ])],
      dataNascimento: ['', Validators.compose([Validators.required])],
      genero: ['', Validators.compose([Validators.required])],
      celular: ['', Validators.compose([Validators.minLength(10), Validators.maxLength(16)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      confirma: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    }, {
      validators: ComparacaoValidator('senha', 'confirma')
    });
   }

  ngOnInit() {
  }

  

}
