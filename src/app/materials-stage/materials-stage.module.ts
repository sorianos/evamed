import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialsStageRoutingModule } from './materials-stage-routing.module';
import { MaterialsStageComponent } from './components/materials-stage/materials-stage.component';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './../material/material.module';

@NgModule({
  declarations: [MaterialsStageComponent],
  imports: [
    CommonModule,
    MaterialsStageRoutingModule,
    SharedModule,
    FormsModule,
    MaterialModule
  ]
})
export class MaterialsStageModule { }
