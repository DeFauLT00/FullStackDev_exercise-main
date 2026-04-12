import {
  AfterViewInit,
  Component,
  ChangeDetectorRef,
  ElementRef,
  ViewChild,
  signal,
  OnInit
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';




// Registra i controller e gli elementi base di Chart.js.
Chart.register(...registerables);

@Component({
  selector: 'app-root',
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit, AfterViewInit {

  protected readonly title = signal('frontend');

  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  // Conserviamo un riferimento al chart per aggiornarlo in seguito.
  chart!: Chart;  // Senza chart!: Chart;, il grafico viene creato ma non hai un riferimento persistente per modificarlo dopo.

  // Var
  selectedStation = '';
  startDate = '';
  endDate = '';
  stations: any[] = [];
  isLoadingStations = true;

  // Client
  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  // Chiamo il back-end, faccio GET di /stations, salvo la risposta e la stampo
  loadStations(): void {
    this.http.get<any[]>('http://localhost:8000/stations').subscribe(data => {
      this.stations = data;
      this.isLoadingStations = false;
      this.cdr.detectChanges();
      console.log(this.stations);
    });
  }

  // Chiamo loadStations()
  ngOnInit(): void {
    this.loadStations();
  }

  onSubmit(): void {
    // Controllo che tutti i campi siano compilati (anche se ho messo required)
    if (!this.selectedStation || !this.startDate || !this.endDate) {
      console.log('Compila tutti i campi');
      return;
    }

    // Controllo che data iniziale sia piu piccola di data finale
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    if (start > end) {
      console.log('La data iniziale deve essere precedente a quella finale');
      return;
    }

    // Stampa
    console.log(this.selectedStation, this.startDate, this.endDate);
    
    // GET per la stampa dei parametri inseriti dopo la submit, poi stampa 
    this.http.get<any>('http://localhost:8000/data', {
      params: {
        station_id: Number(this.selectedStation),
        startDate: this.startDate,
        endDate: this.endDate
      }
    }).subscribe(response => {
      
      // Stampa
      console.log(response.points);

      // Recupero i dati sul tempo e li formatto
      const labels = response.points.map((point: any) => {
      const date = new Date(point.datetime);
      return date.toLocaleString('it-IT', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
      // Recupero i dati sulle precipitazioni
      const values = response.points.map((point: any) => point.cumulative_precipitation);

      // Valorizzo chart in base ai dati recuperati
      this.chart.data.labels = labels;
      this.chart.data.datasets[0].data = values;
      this.chart.update();
    });
  }

  ngAfterViewInit(): void {
    // Il canvas esiste solo dopo il render della view.
    // Creazione grafico
    this.chart = new Chart(this.chartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [],
        datasets: [
          {
            label: 'Precipitazioni Cumulative',
            data: []
          }
        ]
      },
      // Opzioni facoltative, ritengo che sia corretto mettere le unità di misura e formattare il dato
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Range di tempo selezionato'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Precipitazioni cumulate in [mm]'
            },
            ticks: {
              callback: function(value) {
                return value + ' mm';
              }
            }
          }
        }
      }
    });

    setTimeout(() => {
      this.chart.resize();
      this.chart.update();
    }, 0);
  }
}
