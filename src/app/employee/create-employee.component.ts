import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

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
      email: [''],
      skills: this.fb.group({
        skillName: [''],
        experienceInYears: [''],
        proficiency: ['Beginner']
      })
    })
  }

  logKeyValuePairs(group: FormGroup): void{
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key)
      if(abstractControl instanceof FormGroup){ // if nested form group is an instance of abstractControl
        this.logKeyValuePairs(abstractControl)
        abstractControl.disable()
      }
      else{
        //abstractControl.disable()
        console.log('Key = '+ key + 'Value = ' + abstractControl.value)
        abstractControl.markAsDirty();
      }
    })
  }

  onLoadDataClick(): void{
    this.logKeyValuePairs(this.employeeForm)
  }

  onSubmit(): void {
    console.log(this.employeeForm.touched)
    console.log(this.employeeForm.value)

    console.log(this.employeeForm.controls.fullName.touched)
    console.log(this.employeeForm.get("fullName").value)

  }

}
