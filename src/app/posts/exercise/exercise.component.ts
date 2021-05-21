import { Component } from "@angular/core";
import { FormControl, NgForm, Validators } from "@angular/forms";


@Component({
  selector:'app-exercise',
  templateUrl:'./exercise.component.html',
  styleUrls:['./exercise.component.css']
})
export class ExerciseComponent{

  private password='';
  private reg = new RegExp("[a-z]*");
  isEqualPassword: boolean = true;
  email = new FormControl('',[Validators.required, Validators.email]);
  pass: boolean = true;
  public username: string;

  getErrorMessageMail(): string{
    if(this.email.hasError('required'))
      return 'Email is required!!';

    if(this.email.hasError('email'))
      return 'Mail not valid!!';
    return '';
  }

  verifica(form: NgForm){
    this.isEqualPassword=false;
    //if(form.invalid) return;
    if (form.value.password == form.value.confirm){
      this.isEqualPassword=true;
    }
    console.log(this.isEqualPassword);
  }

  //volevo usare questi metodi
  validaPassword(password: string){
    if(this.reg.test(password)){
      this.password = password;
      return false;
    }
    return true;
  }

}
