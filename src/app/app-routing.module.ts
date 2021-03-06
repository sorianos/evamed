import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { AdminGuard } from './admin.guard';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/home-evamed',
        pathMatch: 'full',
      },
      {
        path: 'home-evamed',
        canActivate: [AdminGuard],
        loadChildren: () => import('./home-evamed/home-evamed.module').then(m => m.HomeEvamedModule)
      },
      {
        path: 'do-files',
        canActivate: [AdminGuard],
        loadChildren: () => import('./to-do-file/to-do-file.module').then(m => m.ToDoFileModule)
      },
      {
        path: 'materials-stage',
        canActivate: [AdminGuard],
        loadChildren: () => import('./materials-stage/materials-stage.module').then(m => m.MaterialsStageModule)
      },
      {
        path: 'construction-stage',
        canActivate: [AdminGuard],
        loadChildren: () => import('./construction-stage/construction-stage.module').then(m => m.ConstructionStageModule)
      },
      {
        path: 'usage-stage',
        canActivate: [AdminGuard],
        loadChildren: () => import('./usage-stage/usage-stage.module').then(m => m.UsageStageModule)
      },
      {
        path: 'end-life-stage',
        canActivate: [AdminGuard],
        loadChildren: () => import('./end-life-stage/end-life-stage.module').then(m => m.EndLifeStageModule)
      }
    ]
  },
  {
    path: 'demo',
    loadChildren: () => import('./demo/demo.module').then(m => m.DemoModule)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    loadChildren: () => import('./page-not-found/page-not-found.module').then(m => m.PageNotFoundModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
