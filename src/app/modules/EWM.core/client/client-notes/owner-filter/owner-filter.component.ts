
/*
     @Type: File, <ts>
    @Name: owner-filter.component.ts
    @Who: Renu
    @When: 16-Dec-2021
    @Why: EWM-3751 EWM-4175
    @What: popup component for filter owner
  */

    import { Component, Inject, OnInit, Optional } from '@angular/core';
    import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
    import { TranslateService } from '@ngx-translate/core';
    import { SnackBarService } from '../../../../../shared/services/snackbar/snack-bar.service';
    import { ContactReceipentService } from '../../../../../shared/services/contact-recipient/contact-receipent.service';
    import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { InviteATeammateComponent } from '../../../invite-a-teammate/invite-a-teammate.component';
import { AppSettingsService } from '../../../../../shared/services/app-settings.service';
import { IinviteTeammate, Iteammate } from '../../../invite-a-teammate/Iinvite-a-teammate';
   

@Component({
  selector: 'app-owner-filter',
  templateUrl: './owner-filter.component.html',
  styleUrls: ['./owner-filter.component.scss']
})
export class OwnerFilterComponent implements OnInit {

  
  /************************Global Variables decaraed her*********************** */
  public loadingPopup: boolean;
  public searchValue: string = "";
  public searchListUser: any = [];
  public PreviewUrl: string;
  searchTeammate = [];
  orgId: any;
  maxMsg: boolean = false;
  loading: boolean;
  noRecordFound: string;
  maxSelectEmail: any;
  saveEnableDisable: boolean = true;
  public selecteddata:[]
  constructor(public dialogRef: MatDialogRef<InviteATeammateComponent>, @Optional()
  @Inject(MAT_DIALOG_DATA) public data: any, public _dialog: MatDialog, private translateService: TranslateService,
    public _settingService: ContactReceipentService, private systemSettingService: SystemSettingService,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService) {
    this.PreviewUrl = "/assets/user.svg";

    this.maxSelectEmail = this.appSettingsService.maxSelectEmail;

  }

  ngOnInit(): void {
         //who:maneesh,what:ewm-15980 for paass key IsSelected=1,when:08/02/2024
         this.selecteddata = this.data?.selectedorDeselected?.filter(x => x.IsSelected == 1);          
         if (this.selecteddata?.length>0) {
           this.searchTeammate=this.selecteddata; 
           this.saveEnableDisable=false;  
         }
    this.orgId = localStorage.getItem('OrganizationId')
  }



  /* 
@Type: File, <ts>
 @Name: onsearchTeammate()
 @Who: Anup Singh
 @When: 27-May-2021
 @Why: EWM-1434 EWM-1613
 @What: search for invite teammate
*/
  onsearchTeammate(inputValue: string) {
    if (inputValue.length === 0) {
      this.noRecordFound = "";
      this.searchListUser = [];
    }
    if (inputValue.length > 3) {
      this.loadingPopup = true;
      this.searchValue = inputValue;
      this.systemSettingService.getUserDirectoryList("?Search=" + inputValue + "&OrganizationId=" + this.orgId).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loadingPopup = false;
            this.searchListUser = repsonsedata.Data;
            this.noRecordFound = "";
            // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
             this.maxMsg = false;
          }
          else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
            this.loadingPopup = false;
            this.noRecordFound = repsonsedata.Message;
            this.searchListUser = [];
            this.maxMsg = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
          }
          else {
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
            this.loadingPopup = false;
            this.noRecordFound = "";
            this.maxMsg = false;
          }
        }, err => {
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loadingPopup = false;
          this.noRecordFound = ""
          this.maxMsg = false;
        })

    }
  }

  /*
   @Type: File, <ts>
    @Name: AddSelectTeammate()
    @Who: Anup
    @When: 27-May-2021
    @Why: EWM-1434 EWM-1613
    @What: add teammate after searching in searchTeammate Array
  */
  AddSelectTeammate(userData: any, userName: string) {

  //  if (this.searchTeammate.length < this.maxSelectEmail) {
      const index = this.searchTeammate.findIndex(x => x.UserId === userData.UserId);
      if (index !== -1) {
        //  this.searchTeammate.splice(index, 1);
      } else {
        this.searchTeammate.push({
          'UserId': userData.UserId,
          'email': userData.EmailId,
          'fullName': userData.UserName,
          //'firstName': userData.FirstName,
         // 'middleName': userData.MiddleName,
         // 'lastName': userData.LastName,
        //  'orgId': userData.OrgId,
         // 'userTypeCode': userData.UserTypeCode,
          'PreviewUrl': userData.PreviewUrl,
          'IsSelected': 1 //who:maneesh,what:ewm-15980 for paass key IsSelected=1,when:08/02/2024
        })
      //  this.maxMsg = false;
      }
   // }
    // else {
    //   this.maxMsg = true;
    // }

    if (this.searchTeammate.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }

  }

  /*
      @Type: File, <ts>
       @Name: saveTeamMates()
       @Who: Anup Singh
       @When: 27-May-2021
       @Why: EWM-1434 EWM-1613
       @What: submit All selected Teammate
     */
  saveTeamMates() {
    this.loading = true;
    const teammatesRequest = this.createRequest(); 
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({res: teammatesRequest,selectedorDeselected:this.searchTeammate}); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }

  /*
      @Type: File, <ts>
       @Name: createRequest()
       @Who: Anup Singh
       @When: 27-May-2021
       @Why: EWM-1434 EWM-1613
       @What: make method for multi select teammate for submit
     */
  public createRequest(): IinviteTeammate {
    let requestData: IinviteTeammate = {};
    let teammateList: Iteammate[] = [];

    requestData.OrganizationId = this.orgId;

    if (this.searchTeammate.length > 0) {
      this.searchTeammate.forEach((element) => {
        let teammate: Iteammate = {};
        teammate.Id = element.UserId;
        // teammate.Email = element.email;
        // teammate.FirstName = element.firstName;
        // teammate.LastName = element.lastName;
        // teammate.UserTypeCode = element.userTypeCode;
        teammateList.push(teammate)
      });
      requestData.Teammates = teammateList;
    }

    return requestData
  }



  /*
@Type: File, <ts>
@Name: onTeammateRemove()
@Who: Anup Singh
@When: 27-May-2021
@Why: EWM-1434 EWM-1613
@What: when Teammate remove from chip
*/
  onTeammateRemove(Id) {
    const index = this.searchTeammate.findIndex(x => x.UserId === Id);
    if (index !== -1) {
      this.searchTeammate.splice(index, 1);
      this.maxMsg = false;
    }

    if (this.searchTeammate.length > 0) {
      this.saveEnableDisable = false;
    } else {
      this.saveEnableDisable = true;
    }
  }



  /*
  @Type: File, <ts>
  @Name: onDismiss()
  @Who: Anup Singh
  @When: 27-May-2021
  @Why: EWM-1434 EWM-1613
  @What: cancel button to close the dialog
  */
  onDismiss() {
    document.getElementsByClassName("add_teamMate")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_teamMate")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(true); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
    // this.dialogRef.close({ data: '' })
  }

}
