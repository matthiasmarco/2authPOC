import { Pipe, type PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
    name: 'appBase64ToImage'
})
export class Base64ToImagePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    public transform(value: any, contentType: string = "image/png"): any {
        const base64Content = `data:${contentType};base64,${value}`;
        return this.sanitizer.bypassSecurityTrustUrl(base64Content);
    }
}
