import { NewHotelComponent } from './components/hotel/new-hotel/new-hotel.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './auth/register/register.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { PunteggiComponent } from './components/punteggi/punteggi.component';
import { AuthGuard } from './auth/auth.guard';
import { MyHotelComponent } from './components/hotel/my-hotel/my-hotel.component';
import { RoleGuard } from './auth/role.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Rotte protette dall'AuthGuard
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },


  // SOLO HOTEL
  { path: 'feedback', component: FeedbackComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'punteggi', component: PunteggiComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'my-hotel', component: MyHotelComponent, canActivate: [RoleGuard], data: { roles: ['ROLE_HOTEL'] } },
  { path: 'new-hotel', component: NewHotelComponent, canActivate: [AuthGuard] },

  //SOLO CLIENT


  // Wildcard alla fine
  { path: '**', redirectTo: 'login' },


];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
