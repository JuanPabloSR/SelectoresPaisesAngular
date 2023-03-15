import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaisesService } from '../../services/paises.service';
import { PaisSmall } from '../../interfaces/paises.interface';

@Component({
  selector: 'app-selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent implements OnInit {

  myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    pais: ['', Validators.required],
  })

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] =[];

  constructor(private fb: FormBuilder, private paisesService: PaisesService ) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;

    //cuando cambie de region
    this.myForm.get('region')?.valueChanges
    .subscribe( region => {
      console.log(region)

      this.paisesService.getPaisesPorRegion(region)
      .subscribe(paises => {
        console.log(paises)
        this.paises = paises;
      })
    } )

  }

  guardar() {
    console.log(this.myForm.value);
  }

}
