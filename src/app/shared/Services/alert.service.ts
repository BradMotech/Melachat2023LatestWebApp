// alert.service.ts
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private toastr: ToastrService) {
   
  }

  // Display success message
  success(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title);
  }

  // Display error message
  error(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  // Display warning message
  warning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title);
  }
}
