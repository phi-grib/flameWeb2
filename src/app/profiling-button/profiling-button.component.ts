import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CommonFunctions } from '../common.functions';
import { CommonService } from '../common.service';
import { Compound, Model, Prediction, Profile } from '../Globals';
import { PredictorService } from '../predictor/predictor.service';
import { ProfilingService } from '../profiling.service';
declare var $: any;
@Component({
  selector: 'app-profiling-button',
  templateUrl: './profiling-button.component.html',
  styleUrls: ['./profiling-button.component.css']
})
export class ProfilingButtonComponent implements OnInit {
  endpoints = [];
  versions = [];
  isValidCompound: boolean = false;
  profileName: string = '';
  isvalidProfile: boolean = true;
  profilesNames = [];

  constructor(
    public commonService: CommonService,
    public compound: Compound,
    public commonFunc: CommonFunctions,
    private service: PredictorService,
    public prediction: Prediction,
    private toastr: ToastrService,
    public model: Model,
    public profile: Profile,
    private profiling : ProfilingService,
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.defaultProfileName();
    },500)
    $(function () {
      $('[data-toggle="popover"]').popover();
    });
    this.commonService.isValidCompound$.subscribe(
      (value) => (this.isValidCompound = value)
    );

  }
  selectOption() {
    if (this.compound.input_file) {
      this.predict();
    }
    if (this.compound.sketchstructure) {
      this.predictStructure();
    }
    if (this.compound.input_list) {
      this.predictInputList();
    }
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
    this.profiling
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

    this.profiling
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
    this.profiling.profileSummary(name).subscribe(
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
             
         }
         clearInterval(intervalId);
         this.commonFunc.getProfileList();
         setTimeout(() => {
          this.defaultProfileName();
         }, 100);
       }
      }
    )}
    predictInputList() {
      this.filterModels();
      const inserted = this.toastr.info('Running!', 'Profile ' + this.profileName, {
        disableTimeOut: true,
        positionClass: 'toast-top-right',
      });
  
      this.profiling.predictInputList(
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
