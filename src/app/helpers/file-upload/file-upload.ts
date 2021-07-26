import { Component, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';

@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.html',
    styleUrls: ['./file-upload.scss'],
})
export class FileUploadComponent {
    @ViewChild('fileDropRef', { static: false }) fileDropEl !: ElementRef;
    @Output() load = new EventEmitter();
    @Input() disabled = false;
    @Input() accept = '*.*';
    file !: File;

    onFileDropped($event: any) {
        this.prepareFilesList($event);
    }

    fileBrowseHandler(event: any) {
        this.prepareFilesList(event.target.files);
    }

    prepareFilesList(files: Array<any>) {
        this.file = files[0];
        this.load.next(this.file);
        this.fileDropEl.nativeElement.value = '';
    }
}
