import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublishBackendComponent } from './publish-backend.component';

const routes: Routes = [
  {path:'',component:PublishBackendComponent},
  {path:'upload',component:PublishBackendComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublishBackendRoutingModule { }
