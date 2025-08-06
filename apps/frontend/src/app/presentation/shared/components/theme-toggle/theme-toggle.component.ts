import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../../core/services/theme.service';
import { Theme } from '../../../../core/constants/theme.enum';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.scss']
})
export class ThemeToggleComponent implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  
  currentTheme$ = this.themeService.currentTheme$;
  isDarkMode = false;

  ngOnInit(): void {
    this.currentTheme$.subscribe(theme => {
      this.isDarkMode = theme === Theme.DARK;
    });
  }

  ngOnDestroy(): void {
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 