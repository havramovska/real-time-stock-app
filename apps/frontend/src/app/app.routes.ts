import { Routes } from '@angular/router';
import { ShellComponent } from './presentation/layout/shell/shell.component';

export const routes: Routes = [
    {
      path: '',
      component: ShellComponent,
      children: [
        {
          path: '',
          loadComponent: () => import('./presentation/features/stocks/pages/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
        },
      ]
    }
  ];