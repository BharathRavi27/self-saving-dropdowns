import { DOCUMENT } from '@angular/common';
import {
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  Renderer2,
} from '@angular/core';
import { Observable } from 'rxjs';

/**
 * `persistOnChange` directive takes an Input - @param observableFn which @returns an Observable ideally returned by an http request.
 * and shows loader when the request is in-flight and  shows a tick mark on API success.
 * In API failure cases, shows the error message below the host.
 * Ideally to be used with the Select element(not limitted to)
 */
@Directive({
  selector: '[selfSave]',
})
export class SelfSaveDirective {
  @Input('observableFn')
  observableFn!: Function;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}
  @HostListener('change')
  onChange() {
    if (this.observableFn instanceof Function) {
      const element: HTMLElement = this.elRef.nativeElement;

      this.addLoader(element);
      const changeObservable: Observable<unknown> = this.observableFn();
      changeObservable.subscribe(
        (_) => {
          this.removeBackground(element);
          this.addSuccess(element);
          setTimeout(() => {
            this.removeBackground(element);
          }, 1000);
        },
        (err) => {
          const child = this.document.createElement('div');
          child.innerText = err;
          const parent = this.renderer.parentNode(this.elRef.nativeElement);
          this.renderer.appendChild(parent, child);
        }
      );
    }
  }

  addLoader(element: HTMLElement) {
    this.addBackground(
      element,
      'https://replit.com/public/images/loading_dots.gif',
      20
    );
  }
  addSuccess(element: HTMLElement) {
    this.addBackground(
      element,
      'https://i.pinimg.com/originals/7b/dd/1b/7bdd1bc7db7fd48025d4e39a0e2f0fd8.jpg',
      20
    );
  }

  addBackground(
    element: HTMLElement,
    backgroundImg: string,
    backgroundSize: number
  ) {
    element.style.background = `#fff url("${backgroundImg}") no-repeat right 20px center`;
    element.style.backgroundSize = `${backgroundSize}px`;
  }

  removeBackground(element: HTMLElement) {
    element.style.background = '';
  }
}
