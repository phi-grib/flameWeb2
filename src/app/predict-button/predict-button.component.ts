import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction, Profile } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
declare var $: any;
@Component({
  selector: 'app-predict-button',
  templateUrl: './predict-button.component.html',
  styleUrls: ['./predict-button.component.css']
})
export class PredictButtonComponent implements OnInit {
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  profileName: string = '';
  isvalidProfile: boolean = true;
  profilesNames = [];
  constructor(public commonService: CommonService,
    public compound: Compound,
    private service: PredictorService,
    public prediction: Prediction,
    public profile: Profile,
    private toastr: ToastrService,
    public model: Model) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.defaultProfileName();
    },1000)
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );
  }
  select_prediction() {
    if (this.compound.input_file) {
      this.predict();
    }
    if (this.compound.sketchstructure) {
      this.predictStructure();
    }
    if (this.compound.input_list) {
      this.predictInputList();
    }
    setTimeout(() => {
      this.defaultProfileName();
    },3000)
  }
  defaultProfileName(){
    for(const name of this.profile.profileList[1]){
      this.profilesNames.push(name[0])
    }
    let i = 1;
    let nameFound = false;
    while (!nameFound){
      let istr = i.toString().padStart(4,'0');
      this.profileName = 'Profile_' + istr;
      let keyFound = false;
      for (const ikey of this.profilesNames) {
        if (ikey.startsWith(this.profileName)) {
          keyFound=true;
        }
      }
      if (!keyFound){
        nameFound = true;
        this.isvalidProfile = true;
      }
      i=i+1;
    }
  }
  profileNameChange(){
    this.isvalidProfile = true;
    const letters = /^[A-Za-z0-9_]+$/;
    this.profile.profileList[1].forEach(profile => {
       let name = profile[0]
       if(name.toUpperCase() === this.profileName.toUpperCase()){
         this.isvalidProfile = false;
       }
     });
    if (!this.profileName.match(letters) || this.profileName == '') {
      this.isvalidProfile = false;
    }

    if (!(this.profileName.match(letters)) || this.profileName in this.profilesNames || this.profileName.startsWith('ensemble')) {
      this.isvalidProfile = false;
    }
    for (const ikey of this.profilesNames) {
      if (ikey.startsWith(this.profileName)) {
        this.isvalidProfile=false;
      }
    }
  }
  predictStructure() {
    this.filterModels();
    const inserted = this.toastr.info('Running!', 'Profile ' + this.profileName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });
    this.service
      .predictSketchStructure(
        this.profileName,
        this.compound.sketchstructure['result'],
        this.compound.sketchstructure['name'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(()=> {
            if(iter < 500){
              this.checkProfile(result,inserted,intervalId)
            }else{
              clearInterval(intervalId)
              this.toastr.clear(inserted.toastId);
              this.toastr.warning( 'Profile ' + this.profileName + ' \n Time Out' , 'Warning', {
                timeOut: 10000, positionClass: 'toast-top-right'});
            }
            iter +=1;
          },2000)
        },
        (error) => {
          console.log(error);
        }
      );
  }
  predict() {
    this.filterModels();
    const inserted = this.toastr.info('Running!', 'Profile ' + this.profileName, {
      disableTimeOut: true,
      positionClass: 'toast-top-right',
    });

    this.service
      .predictInputFile(
        this.profileName,
        this.compound.input_file['result'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      )
      .subscribe(
        result => {
          let iter = 0;
          const intervalId = setInterval(()=> {
           if(iter < 500){
          this.checkProfile(result,inserted,intervalId)
           }else {
            this.toastr.clear(inserted.toastId);
            this.toastr.warning( 'Profile ' + this.profileName + ' \n Time Out' , 'Warning', {
              timeOut: 10000, positionClass: 'toast-top-right'});
           }
           iter+=1
          },2000)
        },
        error => {
          console.log('error');
        }
      );
  }
  checkProfile(name,inserted,intervalId){
    this.service.profileSummary(name).subscribe(
      result => {
       if (result['aborted']) {
         this.toastr.clear(inserted.toastId);
         this.toastr.error("Profile \"" + name + "\" task has not completed. Check the browser console for more information", 
           'Aborted', {timeOut: 10000, positionClass: 'toast-top-right'});
         console.log('ERROR report produced by profile task ', name);
         console.log(result['aborted']);
         clearInterval(intervalId);
         return;
       }
       if (!result ['waiting']) {
         this.toastr.clear(inserted.toastId);
         if (result['error']){
           this.toastr.warning('Profile ' + name + ' finished with error ' + result['error'] , 'PROFILE COMPLETED', {
             timeOut: 5000, positionClass: 'toast-top-right'});
         }
         else {
            this.toastr.success('Profile ' + name + ' created' , 'PROFILE COMPLETED', {
             timeOut: 5000, positionClass: 'toast-top-right'});
             this.commonService.setPredictionExec(true);
         }
         clearInterval(intervalId);
         $('#dataTablePredictions').DataTable().destroy();
       }
      }
    )}
    predictInputList() {
      this.filterModels();
      const inserted = this.toastr.info('Running!', 'Profile ' + this.profileName, {
        disableTimeOut: true,
        positionClass: 'toast-top-right',
      });
  
      this.service.predictInputList(
        this.profileName,
        JSON.stringify(this.compound.input_list['result']),
        this.compound.input_list['name'],
        JSON.stringify(this.endpoints),
        JSON.stringify(this.versions)
      ).subscribe(result => {
        let iter = 0;
        const intervalId = setInterval(()=> {
          if(iter < 500){
         this.checkProfile(result,inserted,intervalId)
          }else {
           this.toastr.clear(inserted.toastId);
           this.toastr.warning( 'Profile ' + this.profileName + ' \n Time Out' , 'Warning', {
             timeOut: 10000, positionClass: 'toast-top-right'});
          }
          iter+=1
         },2000)
      },error => {
        console.log('error');
      });
    }
    filterModels() {
      this.endpoints = [];
      this.versions = [];
      this.model.listModelsSelected.filter((model) =>
        this.endpoints.push(model.name)
      );
      this.model.listModelsSelected.filter((model) =>
        this.versions.push(model.version)
      );
    }

}
