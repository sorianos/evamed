import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddNewProjectComponent } from '../add-new-project/add-new-project.component';
import { ChooseTypeOfProjectComponent } from '../choose-type-of-project/choose-type-of-project.component';
import { ProjectsService } from './../../../core/services/projects/projects.service';
import { CatalogsService } from './../../../core/services/catalogs/catalogs.service';
import { UserService } from 'src/app/core/services/user/user.service';
import { ChangeNameProjectComponent } from '../change-name-project/change-name-project.component';
import { Calculos } from '../../../calculos/calculos'
import { element } from 'protractor';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { isTypeNode } from 'typescript';

@Component({
  selector: 'app-home-evamed',
  templateUrl: './home-evamed.component.html',
  styleUrls: ['./home-evamed.component.scss']
})

export class HomeEvamedComponent implements OnInit {

  nombre: string;
  filtroUsoSeleccionado: any;
  filtroCatalogoUsos: any;
  catalogoUsos: any;
  catalogoPaises: any;
  catalogoTipo: any;
  catalogoVidaUtil: any;
  catalogoEsqHabitacional: any;
  catalogoEstados: any;
  catalogoCiudades: any;
  usoSeleccionado: number;
  paisSeleccionado: string;
  tipoSeleccionado: string;
  vidaUtilSeleccionado: string;
  esqHabitacionalSeleccionado: string;
  estadoSeleccionado: any;
  ciudadSeleccionada: any;
  superficieConstruida: string;
  superficieHabitable: string;
  noNiveles: string;
  optionSelected: string;
  projectsList: any = 0;
  tempProjectsList: any = 0;
  countProjectList: number;
  user: string;
  sector: string;
  nameProject: string;
  filtroImpactoSeleccionado: any;
  catologoImpactoAmbiental: any;
  auxDataProjectList: any;

  constructor(
    private auth: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private calculos: Calculos,
    private projectsService: ProjectsService,
    private catalogsService: CatalogsService,
    private projects: ProjectsService,
    private users: UserService
  ) {
    this.catalogsService.usesCatalog().subscribe(data => {
      this.catalogoUsos = data;
      this.filtroCatalogoUsos = data;
      this.filtroCatalogoUsos.push({id: 0, name_use: "Todos"});
    });
    this.catalogsService.countriesCatalog().subscribe(data => {
      this.catalogoPaises = [];
      data.map( item => {
        if (item.id === 1) {
          this.catalogoPaises.push(item);
        }
      });
    });
    this.catalogsService.typeProjectCatalog().subscribe(data => {
      this.catalogoTipo = data;
    });
    this.catalogsService.usefulLifeCatalog().subscribe(data => {
      this.catalogoVidaUtil = data;
    });
    this.catalogsService.housingSchemeCatalog().subscribe(data => {
      this.catalogoEsqHabitacional = data;
    });
    this.users.searchUser(localStorage.getItem('email-login')).subscribe( data => {
      this.user = data[0].name;
      this.sector = data[0].institution;
      localStorage.setItem('email-id', data[0].id);
      this.auxDataProjectList = [];
      this.projectsList = [];
      this.projects.getProjects().subscribe( data => {
        data.map( item => {
          if ( item.user_platform_id === parseInt(localStorage.getItem('email-id'), 10)) {
            let auxDatos:Record<string,any>={
              id:item.id,
              datos:this.calculos.OperacionesDeFase(item.id),
              porcentaje:this.ValoresProcentaje(this.calculos.OperacionesDeFase(item.id)),
              impactoSelect:'Agotamiento de\nRecursos Abióticos\nMinerales'
            }
            this.auxDataProjectList.push(auxDatos)
            this.projectsList.push(item);
          }
          this.countProjectList = this.projectsList.length;
        });
        this.projectsList.reverse();
        this.tempProjectsList = this.projectsList;
      });
    });
    this.catalogsService.getStates().subscribe( data => {
      this.catalogoEstados = data;
    });
    this.catalogsService.getPotentialTypes().subscribe( data => {
      this.catologoImpactoAmbiental = data;
    });
  }

  ngOnInit(): void {}

  logout() {
    this.auth.logout()
    .then(() => {
      this.router.navigate(['/auth/login']);
    });
  }

  ValoresProcentaje(data){
    let auxData=[];
    Object.keys(data).forEach(element => {
      let auxsumimpacto=0;
      let auxsumetapa={};
      auxsumetapa[element]={}
      Object.keys(data[element]).forEach( etapa => {
        Object.keys(data[element][etapa]).forEach( subetapa => {
          auxsumimpacto = auxsumimpacto + data[element][etapa][subetapa]
        })
      })
      Object.keys(data[element]).forEach( etapa => {
        auxsumetapa[element][etapa] = {}
        auxsumetapa[element][etapa]['num']=0;
        Object.keys(data[element][etapa]).forEach( subetapa => {
          auxsumetapa[element][etapa]['num'] = auxsumetapa[element][etapa]['num'] + data[element][etapa][subetapa]
        })
        auxsumetapa[element][etapa]['porcentaje'] = (auxsumetapa[element][etapa]['num']/auxsumimpacto) * 100
      })
      auxData.push(auxsumetapa)
    })
    return auxData;
  }

  selectUse(id) {
    this.projectsList = [];
    this.tempProjectsList.map(item => {
      if (item.use_id === id) {
        this.projectsList.push(item);
      }

      if (id === 0) {
        this.projectsList.push(item);
      }
    });
    this.projectsList.reverse();
  }

  selectImpactoAmbiental(value){
    console.log(value)
  }

  openDialogCTOP() {
    const dialogRef = this.dialog.open(ChooseTypeOfProjectComponent, {
      width: '900px',
      data: {
        optionSelected: 'Huella de carbono'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        this.optionSelected = result.optionSelected;
        this.router.navigateByUrl('do-files');
      } catch (e){
        console.log('close modal');
      }
    });
  }

  deleteProject(id) {
    this.projects.deleteProject(id).subscribe(data => {
      this.users.searchUser(localStorage.getItem('email-login')).subscribe( data => {
        localStorage.setItem('email-id', data[0].id);
        this.projectsList = [];
        this.projects.getProjects().subscribe( data => {
          data.map( item => {
            if ( item.user_platform_id === parseInt(localStorage.getItem('email-id'), 10) ) {
              this.projectsList.push(item);
            }
            this.countProjectList = this.projectsList.length;
          });
          this.projectsList.reverse();
        });
      });
    });
  }

  renameProject(id) {
    const dialogRef = this.dialog.open(ChangeNameProjectComponent, {
      width: '680px',
      data: {
        nameProject: this.nameProject
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('result')
      console.log(result);
    });
  }

  openDialogANP() {
    const dialogRef = this.dialog.open(AddNewProjectComponent, {
      width: '680px',
      data: {
        nombre: this.nombre,
        catalogoUsos: this.catalogoUsos,
        catalogoPaises: this.catalogoPaises,
        catalogoTipo: this.catalogoTipo,
        catalogoVidaUtil: this.catalogoVidaUtil,
        catalogoEsqHabitacional: this.catalogoEsqHabitacional,
        catalogoEstados: this.catalogoEstados,
        usoSeleccionado: this.usoSeleccionado,
        paisSeleccionado: this.paisSeleccionado,
        tipoSeleccionado: this.tipoSeleccionado,
        superficieConstruida: this.superficieConstruida,
        superficieHabitable: this.superficieHabitable,
        vidaUtilSeleccionado: this.vidaUtilSeleccionado,
        esqHabitacionalSeleccionado: this.esqHabitacionalSeleccionado,
        estadoSeleccionado: this.estadoSeleccionado,
        ciudadSeleccionada: this.ciudadSeleccionada,
        noNiveles: this.noNiveles,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      try {
        this.projectsService.addProject({
          name_project: result.nombre,
          builded_surface: parseInt(result.superficieConstruida, 10),
          living_area: parseInt(result.superficieHabitable, 10),
          tier: parseInt(result.noNiveles, 10),
          use_id:  result.usoSeleccionado,
          type_id: result.tipoSeleccionado === undefined ? null : result.tipoSeleccionado,
          country_id: result.paisSeleccionado,
          useful_life_id: result.vidaUtilSeleccionado,
          housing_scheme_id: result.esqHabitacionalSeleccionado === undefined ? null : result.esqHabitacionalSeleccionado,
          user_platform_id: parseInt(localStorage.getItem('email-id'), 10),
          city_id_origin: result.ciudadSeleccionada === undefined ? null : result.ciudadSeleccionada,
          distance: null
        }).subscribe(data => {
          sessionStorage.setItem('primaryDataProject', JSON.stringify(data));
          console.log('estado seleccionado');
          console.log(result.estadoSeleccionado);
          sessionStorage.setItem('estadoSeleccionado', result.estadoSeleccionado);
          this.openDialogCTOP();
        });
      } catch (e){
        console.log('close modal');
      }
    });
  }

  redirectResultados(id) {
    sessionStorage.setItem('projectID', id);
    this.router.navigateByUrl('resultados');
  }

  updateMaterial(id) {
    localStorage.setItem('idProyectoConstrucción', id);
    this.router.navigateByUrl('material-stage-update');
  }

  updateConstruction(id) {
    localStorage.setItem('idProyectoConstrucción', id);
    this.router.navigateByUrl('construction-stage-update');
  }

  updateUso(id) {
    localStorage.setItem('idProyectoConstrucción', id);
    this.router.navigateByUrl('usage-stage-update');
  }


}
