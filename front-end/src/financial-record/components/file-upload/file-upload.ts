import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './file-upload.html',
  styleUrls: ['./file-upload.css']
})
export class FileUpload {
  @Input() isLoading = false;
  @Output() fileSelected = new EventEmitter<File>();
  @Output() submit = new EventEmitter<void>();

  file: File | null = null;
  fileName = '';
  isDragOver = false;

  // Drag & Drop
  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver = false;
    if (event.dataTransfer?.files.length) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  // File selection via input
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File): void {
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(fileExtension || '')) {
      alert('Please select a valid file type (CSV, XLSX, XLS)');
      return;
    }

    this.file = file;
    this.fileName = file.name;
    console.log('File selected:', this.fileName);
    this.fileSelected.emit(file);
  }

  submitFile(): void {
    if (!this.file) {
      console.warn('No file to submit');
      return;
    }
    console.log('Submitting file:', this.fileName);
    this.submit.emit();
  }

}
