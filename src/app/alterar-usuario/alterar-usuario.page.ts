import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from '../models/Usuario';
import { UsuariosService } from '../services/usuarios.service';
import { CpfValidator } from '../validators/cpf-validator';

@Component({
  selector: 'app-alterar-usuario',
  templateUrl: './alterar-usuario.page.html',
  styleUrls: ['./alterar-usuario.page.scss'],
})
export class AlterarUsuarioPage implements OnInit {

  public formAlterar: FormGroup;

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
    ]
  };

  private usuario:Usuario;
  private manterLogadoTempo: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private usuariosService: UsuariosService,
    public alertController: AlertController) { 

      this.formAlterar = formBuilder.group({
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
        email: ['', Validators.compose([Validators.required, Validators.email])]
      });

      this.preencherFormulario();
    }

  ngOnInit() {
  }

  public async preencherFormulario(){
    this.usuario = await this.usuariosService.buscarUsuarioLogado();
    this.manterLogadoTempo = this.usuario.manterLogado;
    delete this.usuario.manterLogado;

    this.formAlterar.setValue(this.usuario);
    this.formAlterar.patchValue({dataNascimento: this.usuario.dataNascimento.toISOString()});
  }

  public async salvar(){
    if(this.formAlterar.valid){
     this.usuario.nome = this.formAlterar.value.nome;
     this.usuario.dataNascimento = new Date (this.formAlterar.value.dataNascimento);
     this.usuario.genero = this.formAlterar.value.genero;
     this.usuario.celular = this.formAlterar.value.celular;
     this.usuario.email = this.formAlterar.value.email;

     if(await this.usuariosService.alterar(this.usuario)){
       
        this.usuario.manterLogado = this.manterLogadoTempo;
        this.usuariosService.salvarUsuarioLogado(this.usuario);
        this.exibirAlerta("SUCESSO!", "Usuário alterado com sucesso!");
        this.router.navigateByUrl('/configuracoes');
     }
    } else{
      this.exibirAlerta('ADVERTÊNCIA!', 'Formulário inválido<br/>Verifique os campos do seu formulário!');
    }
  }
  async exibirAlerta(titulo: string, mensagem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensagem,
      buttons: ['OK']
    });

    await alert.present();
  }
}
