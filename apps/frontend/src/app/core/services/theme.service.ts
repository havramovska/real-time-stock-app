import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Theme, ThemeType, DEFAULT_THEME } from '../constants/theme.enum';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentThemeSubject = new BehaviorSubject<ThemeType>(DEFAULT_THEME);
  public currentTheme$: Observable<ThemeType> = this.currentThemeSubject.asObservable();

  constructor() {
    this.initializeTheme();
  }

  private initializeTheme(): void {
    const savedTheme = localStorage.getItem('theme') as ThemeType;
    const theme = savedTheme && Object.values(Theme).includes(savedTheme) 
      ? savedTheme 
      : DEFAULT_THEME;
    
    this.setTheme(theme);
  }

  getCurrentTheme(): ThemeType {
    return this.currentThemeSubject.value;
  }

  setTheme(theme: ThemeType): void {
    this.currentThemeSubject.next(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
    this.setTheme(newTheme);
  }

  private applyTheme(theme: ThemeType): void {
    const root = document.documentElement;
    
    if (theme === Theme.DARK) {
      root.classList.add('dark-theme');
      root.classList.remove('light-theme');
    } else {
      root.classList.add('light-theme');
      root.classList.remove('dark-theme');
    }
  }
} 