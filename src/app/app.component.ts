import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Subscription} from 'rxjs'
import { AbstractControl } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private formSubscription: Subscription | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient){
   console.log('this is app')
  }
  ngOnInit(): void {
    
  }

  //USING FORMBUILDER SERVICE
  registerForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(5)]],
    email:['',[Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@gmail.com')]],
    password: ['', [Validators.required, Validators.minLength(5)]],
    confirmPassword: ['', [Validators.required, this.passwordMatchValidator.bind(this)]],
    address: this.fb.group({
      city: [''],
      state:[''],
      postalCode: [''],
    }),
    alternateEmail: this.fb.array([])
  })

  //password validator 
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
  
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
  
    return null;
  }
  

  get UserName(){
    return this.registerForm.get('username')
  }
  get UserPass(){
    return this.registerForm.get('password')
  }
  get UserEmail(){
    return this.registerForm.get('email')
  }
  get AltEmail(){
    return this.registerForm.get('alternateEmail') as FormArray;
  }
  get ConfirmPass(){
    return this.registerForm.get('confirmPassword')
  }
  addAltEmail(){
    this.AltEmail.push(this.fb.control(''));
  }


  //for assigning form values form API and services
  
//   loadData(){
//     this.registerForm.setValue({    //is strict and used only if you have to load data in all fields
//       username: "pato",
//       password: "1234",
//       confirmPassword: "1234",
//       address:{
//         city: 'Biratnagar',
//         state: 'koshi',
//         postalCode:'1234'
//       }
//     })
//   }
// }

loadData(){
  this.registerForm.patchValue({    //used only if you need to load data initially for some specific field
    address:{
        city: 'Biratnagar',
        state: 'koshi',
        postalCode:'1234'
      }
  })
}
submitForm() {
  if (this.registerForm.valid) {
    const formData = this.registerForm.value;

    // Send POST request to localhost:3000/info
    this.formSubscription = this.http
      .post('http://localhost:3000/info', formData)
      .subscribe({
        next: (response) => {
          console.log('Form data sent successfully!', response);
          // Optionally, you can perform further actions upon successful submission
        },
        error: (error) => {
          console.error('An error occurred while sending form data:', error);
          // Handle error scenarios if needed
        }
      });
  }
}
ngOnDestroy(): void {
  if (this.formSubscription) {
    this.formSubscription.unsubscribe();
  }
}
}

