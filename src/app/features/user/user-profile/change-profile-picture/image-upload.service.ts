import { inject, Injectable, signal } from '@angular/core';
import { MessageModalService } from '../../../../core/services/messageModal.service';

@Injectable({
  providedIn: 'root',
})
export class ImageUploadService {
  private _selectedImage = signal<File | null>(null);
  selectedImage = this._selectedImage.asReadonly();

  private _previewUrl = signal<string | null>(null);
  previewUrl = this._previewUrl.asReadonly();

  private messageModalService = inject(MessageModalService);

  onFileSelected(imageFile: FileList | null) {
    if (!imageFile || imageFile.length === 0) return;

    const file = imageFile[0];

    if (!file.type.startsWith('image/')) {
      this.messageModalService.buildErrorMessage(
        'Apenas imagens são permitidas!',
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.messageModalService.buildErrorMessage(
        'A imagem deve ter no máximo 2MB!',
      );
      return;
    }

    this._selectedImage.set(file);

    const reader = new FileReader();
    reader.onload = () => this._previewUrl.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  clearFile() {
    this._selectedImage.set(null);
  }
}
