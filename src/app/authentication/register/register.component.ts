import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  Firestore,
  collectionData,
  collection,
  getDoc,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion, setDoc
} from '@angular/fire/firestore';
import * as moment from 'moment';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  selectedOption: string | null = null;
  PhoneContentFormControl: FormControl = new FormControl();
  UsernameFormControl: FormControl = new FormControl();
  FullNamesFormControl: FormControl = new FormControl();
  PhoneFormControl: FormControl = new FormControl();
  SurnameFormControl: FormControl = new FormControl();
  BioFormControl: FormControl = new FormControl();
  PasswordFormControl: FormControl = new FormControl();
  ConfirmPasswordFormControl: FormControl = new FormControl();
  options = [
    { id: 'personal', label: 'Melachat for Personal use' },
    { id: 'business', label: 'Melachat for Business use' },
  ];
  bio: string ='';
  phone: string ='';
  username: string ='';
  fullNames: string ='';
  password: string ='';
  confirmPassword: string ='';

  constructor( private firestore: Firestore,public router: Router,){

  }
  ngOnInit(): void {
   this.BioFormControl.valueChanges.subscribe(value =>{
   this.bio = value
   });
   this.PhoneFormControl.valueChanges.subscribe(value =>{
    this.phone = value
   });
   this.UsernameFormControl.valueChanges.subscribe(value =>{
    this.username = value
   });
   this.FullNamesFormControl.valueChanges.subscribe(value =>{
    this.fullNames = value
   });
   this.PasswordFormControl.valueChanges.subscribe(value =>{
    this.password = value
   });
   this.ConfirmPasswordFormControl.valueChanges.subscribe(value =>{
    this.confirmPassword = value
   });
  }

  

  onOptionChange(optionId: string): void {
    this.selectedOption = optionId;
    console.log(optionId)
  }

  async registerUserInFirestore(phone: string, username: string, name: string, password: string, token: string, dob: string, melaChatFor: string): Promise<void> {
    try {
      const userCollection = collection(this.firestore, 'Users');
  
      // Generate a random key for encryption
      let key = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 10; i++) {
        key += possible.charAt(Math.floor(Math.random() * possible.length));
      }
  
      // Encrypt the password
      const ciphertext = CryptoJS.AES.encrypt(password, key).toString();
  
      // Set user data in Firestore
      await addDoc(userCollection, {
        username: username,
        name: name,
        phone: phone,
        password: { ciphertext, key },
        notificationToken: token,
        image: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
        bio: '',
        friends: [],
        blocked: [],
        location: {},
        requests: [],
        language: 'English',
        dob: dob,
        created: moment().format('DD-MM-YYYY'),
        availability: 'online',
        InterestedIn: '',
        suspended: false,
        melachatFor:this.selectedOption
      });
  
      // Additional logic if needed
  
    } catch (error: any) {
      // Handle errors or show messages as needed
      console.error(error.message);
      throw error;
    }
  }
  
  // Modify your handleSignup function to call the new function
  async handleSignup() {
    // Existing code...
  
    try {
      // Check if user already exists in Firestore (optional, you can uncomment if needed)
   
      // Register new user in Firestore
      await this.registerUserInFirestore(
        this.phone,
        this.username,
        this.fullNames,
        this.password,
        '',
        '',
        this.selectedOption as string
      );
  
      // Registration successful, navigate to the next screen
      this.router.navigate(['authentication/login']);
      
     
  
    } catch (error) {
      // Handle errors or show messages as needed
 
    }
  }

  GoToLogin(){
    this.router.navigate(['authentication/login']);
  }
}
