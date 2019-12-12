import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;
  //fullNameLength = 0;

  validationMessages = {
    'fullName': {
      'required': 'Full Name is required.',
      'minlength': 'Full Name must be greater than 2 characters.',
      'maxlength': 'Full Name must be less than 10 characters.'
    },
    'email': {
      'requied': 'Email is required.'
    },
    'skillName': {
      'requied': 'Skill Name is required.'
    },
    'experienceInYears': {
      'requied': 'Experience Name is required.'
    },
    'proficiency': {
      'requied': 'Proficiency Name is required.'
    },
  };

  formErrors = {
    'fullName': '',
    'email': '',
    'skillName': '',
    'experienceInYears': '',
    'proficiency': ''
  };

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    // this.employeeForm = new FormGroup({
    //   fullName: new FormControl(),
    //   email: new FormControl(),
    //   skills: new FormGroup({
    //     skillName: new FormControl(),
    //     experienceInYears: new FormControl(),
    //     proficiency: new FormControl()
    //   })
    // })

    this.employeeForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      skills: this.fb.group({
        skillName: ['', [Validators.required]],
        experienceInYears: ['', [Validators.required]],
        proficiency: ['', [Validators.required]]
      })
    })

    this.employeeForm.get("skills").valueChanges.subscribe(
      (value: any) => {
      console.log(JSON.stringify(value));
    })
  }

  onLoadDataClick(): void{
    this.employeeForm.patchValue({ // To update all the values in form use setValue or to update only some part of the form use patchValue
      fullName: 'vishal',
      email: 'lotlikar18@gmail.com',
      skills: {
        skillName: 'a',
        experienceInYears: 5,
        proficiency: 'Beginner'
      }
    })
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched)
    console.log(this.employeeForm.value)

    console.log(this.employeeForm.controls.fullName.touched)
    console.log(this.employeeForm.get("fullName").value)

  }

}
