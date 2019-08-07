import { Component, Input, Output, EventEmitter, ChangeDetectorRef, HostListener, TemplateRef } from '@angular/core';
import { AnimationEvent } from '@angular/animations';
import { appDropdownAnimations } from './dropdown-animation';

export class DropdownValue {
  value: string;
  label: string;

  constructor(value: string, label: string) {
    this.value = value;
    this.label = label;
  }
}

@Component({
  selector: 'stri-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  animations: [appDropdownAnimations.dropdown]
})
export class DropdownComponent {

  _state: 'void' | 'enter' | 'exit' | 'hidden' = 'hidden';

  @Input() expanded = false;
  @Input() enabled = true;
  @Input() mainValue: string;
  @Input() values: DropdownValue[] = [];
  @Output() close = new EventEmitter();
  @Output() value = new EventEmitter();

  private preventClose = false;

  constructor(private cdr: ChangeDetectorRef) { }

  exit(): void {
    this._state = 'exit';
    this.cdr.markForCheck();
  }

  avoidClose() {
    this.preventClose = true;
  }

  afterAnimationEnds(event: AnimationEvent) {
    if (event.toState === 'exit') { this.close.emit(); }
    if (event.toState === 'enter') { this.preventClose = false; }
  }

  afterAnimationStart(event: AnimationEvent) {
    if (event.toState === 'enter') { this.avoidClose(); }
  }

  toggleDropdown() {
    if (this._state === 'enter') {
      this.exit();
    } else {
      this._state = 'enter';
    }
  }

  @HostListener('document:click') onOutClickHandler() {
    if (!this.preventClose) { this.exit(); }
    this.preventClose = false;
  }

  @HostListener('document:keydown.escape') closeHandler() {
    this.exit();
  }
}
