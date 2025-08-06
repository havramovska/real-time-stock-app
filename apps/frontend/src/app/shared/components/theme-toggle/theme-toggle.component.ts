import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/constants/theme.enum';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent {
  isDarkTheme = false;

  constructor(private themeService: ThemeService) {
    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkTheme = theme === Theme.DARK;
    });
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 