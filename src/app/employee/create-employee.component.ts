import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray, FormControl } from '@angular/forms'
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { JsonPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router'
import { EmployeeService } from './employee.service'
import { IEmployee } from './IEmployee'
import { ISkill } from './ISkill'

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
      'required': 'Email is required.',
      'email': 'Please enter valid email ID.',
      'emailDomain': 'Email domain should be gmail.com'
    },
    'confirmEmail': {
      'required': 'Confirm Email is required.'
    },
    'emailGroup': {
      'emailMismatch': 'Email and Confirm Email do not match'
    },
    'phone': {
      'required': 'Phone is required.'
    }
  };

  formErrors = {
  };

  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private employeeService: EmployeeService) { }

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
      contactPreference: ['email'],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email, emailDomain]],
        confirmEmail: ['', Validators.required],
      }, { validator: matchEmail }),
      phone: ['', Validators.required],
      skills: this.fb.array([
        this.addSkillFormGroup()
      ])
    })

    this.employeeForm.get('contactPreference').valueChanges.subscribe((data: string) => {
      this.onContactPreferenceChange(data);
    });

    // this.employeeForm.get("skills").valueChanges.subscribe(
    //   (value: any) => {
    //   // console.log(JSON.stringify(value));
    // })

    this.employeeForm.valueChanges.subscribe((data) => {
      this.logValidationErrors(this.employeeForm);
      // console.log(JSON.stringify(value));
    })

    this.route.paramMap.subscribe(params => {
      const empId = +params.get('id');
      if (empId) {
        this.getEmployee(empId);
      }
    })
  }

  getEmployee(id: number) {
    this.employeeService.getEmployee(id).subscribe(
      (employee: IEmployee) => this.editEmployee(employee),
      (err: any) => console.log(err)
    );
  }

  editEmployee(employee: IEmployee) {
    this.employeeForm.patchValue({
      fullName: employee.fullName,
      contactPreference: employee.contactPreference,
      emailGroup: {
        email: employee.email,
        confirmEmail: employee.email
      },
      phone: employee.phone
    });
  }

  addSkillFormGroup(): FormGroup {
    return this.fb.group({
      skillName: ['', Validators.required],
      experienceInYears: ['', Validators.required],
      proficiency: ['', Validators.required]
    })
  }

  addSkillButtonClick(): void {
    (<FormArray>this.employeeForm.get('skills')).push(this.addSkillFormGroup());
  }

  removeSkillButtonclick(skillGroupIndex: number): void {
    (<FormArray>this.employeeForm.get('skills')).removeAt(skillGroupIndex)
  }

  onContactPreferenceChange(selectedValue: string) {
    const phoneControl = this.employeeForm.get('phone');
    if (selectedValue === 'phone') {
      console.log('selectedValue', selectedValue)
      phoneControl.setValidators(Validators.required);
    } else {
      phoneControl.clearValidators();
    }
    phoneControl.updateValueAndValidity();
  }

  logValidationErrors(group: FormGroup = this.employeeForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key)

      this.formErrors[key] = '';
      //abstractControl.disable()
      // console.log('Key = '+ key + 'Value = ' + abstractControl.value)
      if (abstractControl && !abstractControl.valid && 
        (abstractControl.touched || abstractControl.dirty || abstractControl.value !== '')) {
        const messages = this.validationMessages[key];
        // console.log(messages);
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }

      if (abstractControl instanceof FormGroup) { // if nested form group is an instance of abstractControl
        this.logValidationErrors(abstractControl)
        // abstractControl.disable()
      }
    })
  }

  onLoadDataClick(): void {
    const formArray1 = this.fb.array([
      new FormControl('Vishal', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ])
    const FormGroup = this.fb.group([
      new FormControl('Vishal', Validators.required),
      new FormControl('IT', Validators.required),
      new FormControl('Male', Validators.required)
    ])
    // formArray1.push(new FormControl('Lotlikar', Validators.required));
    // console.log(formArray1.at(3).value)
    console.log(formArray1)
    console.log(FormGroup)
  }

  onSubmit(): void {
    /* console.log(this.employeeForm.touched)
    console.log(this.employeeForm.value)

    console.log(this.employeeForm.controls.fullName.touched)
    console.log(this.employeeForm.get("fullName").value) */

  }

}

function emailDomain(control: AbstractControl): { [key: string]: any } | null {
  const email: string = control.value;
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (email === '' || domain.toLowerCase() === 'gmail.com') {
    return null;
  } else {
    return { 'emailDomain': true };
  }
}

function matchEmail(group: AbstractControl): { [key: string]: any } | null {
  const emailControl = group.get('email');
  const confirmEmailControl = group.get('confirmEmail');

  if (emailControl.value === confirmEmailControl.value || 
    (confirmEmailControl.pristine && confirmEmailControl.value === '')) {
    return null;
  } else {
    return { 'emailMismatch': true };
  }
}
