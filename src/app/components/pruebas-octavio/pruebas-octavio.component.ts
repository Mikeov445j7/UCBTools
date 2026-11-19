import { Component, OnInit } from '@angular/core';
import { ReportesDemoService } from '../../services/reporte.service';

@Component({
  selector: 'app-pruebas-octavio',
  templateUrl: './pruebas-octavio.component.html',
  styleUrls: ['./pruebas-octavio.component.scss'],
})
export class PruebasOctavioComponent implements OnInit {
  constructor(private readonly demo: ReportesDemoService) {}
  ngOnInit(): void { this.demo.registrar(); }
}
