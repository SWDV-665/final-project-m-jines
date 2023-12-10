import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  wantToAddMedia: boolean =false;
  title = "Technique Library"

  entries = [
    {
      name: "Tripod Sweep",
      description: "napsdjnapsdnaopsdnas",
      relatedTechniques: "Guard pull, collar sleeve, Single leg X, Ashi Garami",
      status: "Proficient",
      media:""
    }
    , {
      name: "Lumbar Jack Sweep",
      description: "napsdjnapsdnaopsdnas",
      relatedTechniques: "Guard pull, collar sleeve, Single leg X, Ashi Garami",
      status: "Proficient",
      media: ""
    }
  ];

  currentMedia: string = ''; 
  constructor(public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }

  async shareEntry(entry: any, index: any) {
    console.log("Sharing Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Sharing Entry: ' + entry.date,
      duration: 3000
    });
    (await toast).present();
    try {
      await Share.share({
        title: 'Sharing Technique',
        text: 'Technique: ' + entry.name + ", Description " + entry.description + ", Related Techniques: "+entry.relatedTechniques+ ", Entry Status: "+ entry.status + ", Entry Media: "+ entry.media
      });
    } catch (error) {
      console.error('Error sharing entry: ', error);
      
    }
    
  }

  async removeEntry(entry: any, index: any) {
    console.log("Removing Item - ", entry, index);
    const toast = this.toastCtrl.create({
      message: entry.name + " deleted.",
      duration: 3000
    });
    (await toast).present();
    this.entries.splice(index, 1);
  }

  async editEntry(entry: any, index: any) {
    console.log("Edit Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Entry for ' + entry.name,
      duration: 3000
    });
    (await toast).present();
    this.showEditEntryPrompt(entry, index);
  }

  async addEntry() {
    console.log("Adding Entry");
    this.showAddEntryPrompt();
  }

  async captureMedia() {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.Uri, 
      
    });
    if (image.webPath) {
      this.currentMedia = image.webPath;
    } else {
      console.error('No image path returned');
      this.currentMedia = ''; 
    }
  }

  async showAddEntryPrompt() {
    this.wantToAddMedia = false;
    const prompt = await this.alertCtrl.create({
      header: 'New Technique Entry',
      cssClass: "large-prompt",
      message: "Enter the info for your new technique library entry: ",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: "Description",
        },
        {
          name: 'relatedTechniques',
          type: 'textarea',
          placeholder: "Related Techniques",
        },

        {
          name: 'status',
          type: 'textarea',
          placeholder: "Status",
        },
      ],
      buttons: [
        {
          text: 'media',
          handler: () => {
            console.log('Want to add media. ')
            this.wantToAddMedia=true;
            return false;
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: async entry => {
            console.log('Save Clicked', entry);
            if (this.wantToAddMedia){
              await this.captureMedia();
              entry.media=this.currentMedia;
            }
            this.entries.push(entry);
            this.currentMedia = ''
            this.wantToAddMedia = false;
          }
        }
      ]
    });
    await prompt.present();
  }

  async showEditEntryPrompt(entry: any, index: any) {
    this.wantToAddMedia = false;
    const prompt = await this.alertCtrl.create({
      header: 'Edit Entry',
      cssClass: "large-prompt",
      message: "Please edit the entry: ",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: entry.name,
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: "Description",
          value: entry.description,
        },
        {
          name: 'relatedTechniques',
          type: 'textarea',
          placeholder: "Related Techniques",
          value: entry.relatedTechniques,
        },
        {
          name: 'status',
          type: 'textarea',
          placeholder: "Status",
          value: entry.status,
        },
       
       
      ],
      buttons: [
        {
          text: 'media',
          handler: () => {
            console.log('Want to Edit Media')
            this.wantToAddMedia=true;
            return false;
          }
        },
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel Clicked', data);
          }
        },
        {
          text: 'save',
          handler: async entry => {
            console.log('Save Clicked', entry);
            if (this.wantToAddMedia){
              await this.captureMedia();
              entry.media= this.currentMedia;
            } else {
              entry.media= entry.media;
            }
            this.entries[index] = entry;
            this.currentMedia = '';
            this.wantToAddMedia = false;
          }
        }
      ]
    });
    await prompt.present();
  }

}
