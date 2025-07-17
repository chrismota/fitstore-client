import { Component, computed, DestroyRef, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCamera, faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CustomerService } from '../../../../core/services/customer.service';
import { MessageModalService } from '../../../../core/services/messageModal.service';
import { ImageUploadService } from './image-upload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExceptionDto } from '../../../../models/exception.model';

@Component({
  selector: 'app-change-profile-picture',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './change-profile-picture.component.html',
  styleUrl: './change-profile-picture.component.scss',
})
export class ChangeProfilePictureComponent {
  private destroyRef = inject(DestroyRef);
  private customerService = inject(CustomerService);
  private messageModalService = inject(MessageModalService);
  private fileService = inject(ImageUploadService);

  faCamera = faCamera;
  faFloppyDisk = faFloppyDisk;

  imageServerPath = this.customerService.imageServerPath;
  customer = this.customerService.customer;
  selectedImage = this.fileService.selectedImage;
  previewUrl = this.fileService.previewUrl;

  userHasNoImage = computed<boolean>(() => {
    return !this.customer()?.imagePath && !this.selectedImage();
  });

  userHasProfileImage = computed<boolean | '' | undefined>(() => {
    return this.customer()?.imagePath && !this.selectedImage();
  });

  onFileSelected(files: FileList | null): void {
    this.fileService.onFileSelected(files);
  }

  onUpload(): void {
    if (!this.selectedImage()) {
      this.messageModalService.buildErrorMessage('Nenhuma imagem selecionada!');
      return;
    }

    this.customerService
      .uploadCustomerImage(this.selectedImage()!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.fileService.clearFile();
          this.messageModalService.buildSuccessMessage(
            'Imagem alterada com sucesso!',
          );
        },
        error: (error: HttpErrorResponse) => {
          const err: ExceptionDto = error.error;

          if (
            err.errorCode == 'IMAGE_UPLOAD_ERROR' ||
            err.errorCode == 'IMAGE_DELETE_ERROR'
          ) {
            this.messageModalService.buildErrorMessage(
              'Erro na tentativa de alteração de imagem. Por favor, tente novamente.',
            );
          }
        },
      });
  }
}
