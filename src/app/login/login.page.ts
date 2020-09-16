import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../services/usuarios.service';
import { ToastController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  public formLogin:FormGroup;

  public mensagens_validacao = {
    email: [
      {tipo: 'required', mensagem: 'O campo E-mail é obrigatório!'},
      {tipo: 'email', mensagem: 'E-mail inválido!'}
    ],
    senha: [
      {tipo: 'required', mensagem: 'O campo Senha é obrigatório!'},
      {tipo: 'minlength', mensagem: 'A senha deve ter pelo menos 6 cracteres!' }
    ]
  };

  constructor(private formBuilder: FormBuilder,
    private router: Router, 
    private usuariosService: UsuariosService,
    public toastController: ToastController,
    public alertController: AlertController) {
    this.formLogin = formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      senha: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      manterLogado: [false]
    });
   }

  ngOnInit() {
  }

  async ionViewWillEnter(){

    const usuarioLogado = await this.usuariosService.buscarUsuarioLogado();
    if(usuarioLogado && usuarioLogado.manterLogado){
       this.router.navigateByUrl('/home');
       this.presentToast();
    }else{
      this.usuariosService.removerUsuarioLogado();
    }
  }

  public async login(){
    if(this.formLogin.valid){
     
      const usuario = await this.usuariosService.login(this.formLogin.value.email, this.formLogin.value.senha);

      if(usuario){
        usuario.manterLogado = this.formLogin.value.manterLogado;
        this.usuariosService.salvarUsuarioLogado(usuario);
        this.router.navigateByUrl('/home');
        this.presentToast();
      }else{
             this.presentAlert('ADVERTÊNCIA', 'USUÁRIO OU SENHA INVÁLIDOS!');
      }
    }else{
      this.presentAlert('ERRO', 'FORMULÁRIO INVÁLIDO, CONFIRA OS CAMPOS!');
    }
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Login efetuado com  sucesso!',
      duration: 2000
    });
    toast.present();
  }

  async presentAlert(titulo: string, mensgaem: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensgaem,
      buttons: ['OK']
    });

    await alert.present();
  }

}
