import { Component } from '@angular/core';

interface Seat {
  number: string;
  booked: boolean;
}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  requestedSeats: number = 1;
  bookedSeats: string[] = [];
  errorMessage: string = '';
  seatLayout: Seat[][] = [];

  constructor() {
    this.initializeSeats();
  }

  initializeSeats() {
    const rows = 12; // 11 rows with 7 seats + last row with 3 seats
    const seatsPerRow = 7;
    let seatNumber = 1;

    for (let i = 0; i < rows - 1; i++) {
      const row: Seat[] = [];
      for (let j = 0; j < seatsPerRow; j++) {
        row.push({ number: seatNumber.toString(), booked: false });
        seatNumber++;
      }
      this.seatLayout.push(row);
    }

    // Last row with 3 seats
    const lastRow: Seat[] = [];
    for (let j = 0; j < 3; j++) {
      lastRow.push({ number: seatNumber.toString(), booked: false });
      seatNumber++;
    }
    this.seatLayout.push(lastRow);
  }

  bookSeats() {
    this.errorMessage = '';

    // Input validation: Check if requested seats are within the allowed range
    if (this.requestedSeats < 1) {
      this.errorMessage = 'You must book at least 1 seat.';
      return;
    }

    if (this.requestedSeats > 7) {
      this.errorMessage = 'You can only book at max 7 seats at a time.';
      return;
    }

    // Check if all seats are already booked
    const totalAvailableSeats = this.seatLayout.reduce((total, row) => {
      return total + row.filter(seat => !seat.booked).length;
    }, 0);

    if (totalAvailableSeats === 0) {
      this.errorMessage = 'No seats are available.';
      return;
    }

    this.bookedSeats = [];
    let seatsToBook = this.requestedSeats;

    // Sequentially book seats across multiple rows if necessary
    for (let row of this.seatLayout) {
      for (let seat of row) {
        if (!seat.booked && seatsToBook > 0) {
          seat.booked = true;
          this.bookedSeats.push(seat.number);
          seatsToBook--;
        }
        // If all requested seats have been booked, break out of the loop
        if (seatsToBook === 0) {
          break;
        }
      }
      // If all requested seats are booked, stop checking further rows
      if (seatsToBook === 0) {
        break;
      }
    }
  }
}
