import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap, tap } from 'rxjs/operators';

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
    frontera: ['', Validators.required],
  });

  // llenar selectores
  regiones: string[] = [];
  paises: PaisSmall[] = [];
  fronteras: string[] = [];

  // UI
  cargando: boolean = false;

  constructor(private fb: FormBuilder, private paisesService: PaisesService) {}

  ngOnInit(): void {
    this.regiones = this.paisesService.regiones;

    //cuando cambie de region
    // this.myForm.get('region')?.valueChanges
    // .subscribe( region => {
    //   console.log(region)

    //   this.paisesService.getPaisesPorRegion(region)
    //   .subscribe(paises => {
    //     console.log(paises)
    //     this.paises = paises;
    //   })
    // } )

    //*cuando cambia la region
    this.myForm
      .get('region')
      ?.valueChanges.pipe(
        tap((_) => {
          this.myForm.get('pais')?.reset('');
          this.cargando = true;
        }),
        switchMap((region) => this.paisesService.getPaisesPorRegion(region))
      )
      .subscribe((paises) => {
        this.paises = paises;
        this.cargando = false;
      });

    //*cuando cambia el pais
      this.myForm.get('pais')?.valueChanges
      .pipe(
        tap(() => {
          this.myForm.get('frontera')?.reset('');
          this.cargando = true;

        }),
        switchMap(codigo => this.paisesService.getPaisPorCodigo(codigo))
      )
      .subscribe( pais => {
        if(pais !== null){
          if( pais.length > 0) {
            this.fronteras = pais[0]?.borders
          }
        }
        this.cargando = false;
      })


  }

  guardar() {
    console.log(this.myForm.value);
  }
}
