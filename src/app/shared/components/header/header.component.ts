import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}
