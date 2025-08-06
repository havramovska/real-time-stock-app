import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
  isDarkMode$: Observable<boolean> = this.currentTheme$.pipe(
    map(theme => theme === Theme.DARK)
  );

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
} 