import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  standalone: true,
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.scss']
})
export class ToggleButtonComponent {
  @Input() isActive: boolean = false;
  @Input() disabled: boolean = false;
  @Output() toggleChange = new EventEmitter<boolean>();

  onToggle() {
    if (!this.disabled) {
      this.isActive = !this.isActive;
      this.toggleChange.emit(this.isActive);
    }
  }
}
