import { Component, Input } from '@angular/core';
import {
  trigger,
  style,
  transition,
  animate,
} from '@angular/animations';

interface MenuItem {
  icon: string;
  label: string;
  route: string;
  badge?: string;
  submenu?: MenuItem[];
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, height: 0, overflow: 'hidden' }),
        animate('300ms ease-in-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-in-out',
          style({ opacity: 0, height: 0, overflow: 'hidden' })
        ),
      ]),
    ]),
  ],
})
export class SidebarComponent {
  @Input() collapsed = false;

  menuItems: MenuItem[] = [
    {
      icon: 'fas fa-home',
      label: 'Dashboard',
      route: '/dashboard',
    },
  ];

  expandedItems: Set<string> = new Set();

  toggleSubmenu(item: MenuItem) {
    if (item.submenu) {
      if (this.expandedItems.has(item.label)) {
        this.expandedItems.delete(item.label);
      } else {
        this.expandedItems.add(item.label);
      }
    }
  }

  isExpanded(item: MenuItem): boolean {
    return this.expandedItems.has(item.label);
  }
}
