import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera, CameraResultType } from '@capacitor/camera';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  wantToAddMedia: boolean =false;
  title = "Training Journal"
  
  entries = [
    {
      date: "09/10/2023",
      techniques: "Single leg X, Ashi Garami",
      notes: "notes about training here",
      media: ""
    }
    ,{
      date: "09/12/2023",
      techniques: "Ashi Garami, Butterfly Ashi",
      notes: "notes here blah blah blah ",
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
        title: 'Sharing Journal Entry',
        text: 'Entry Date: ' + entry.date + ", Techniques: " + entry.techniques + ", Notes: "+entry.notes+ ", Entry Media: "+ entry.media
      });
    } catch (error) {
      console.error('Error sharing entry: ', error);
      
    }
    
  }

  async removeEntry(entry:any, index:any){
    console.log("Removing Item - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Entry for ' + entry.date +" deleted.",
      duration: 3000
    });
    (await toast).present();
    this.entries.splice(index,1);
  }

  async editEntry(entry: any, index: any) {
    console.log("Edit Entry - ", entry, index);
    const toast = this.toastCtrl.create({
      message: 'Editing Entry from '+ entry.date,
      duration: 3000
    });
    (await toast).present();
    this.showEditEntryPrompt(entry,index);
  }

  async addEntry(){
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
    this.wantToAddMedia =false;
    const prompt = await this.alertCtrl.create({
      header:'New Journal Entry',
      cssClass: "large-prompt",
      message: "Enter the info for your new journal entry: ",
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
        },
        {
          name: 'techniques',
          type: 'textarea',
          placeholder: "Techniques",
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: "Notes",
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
            if (this.wantToAddMedia) {
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

  async showEditEntryPrompt(entry:any, index:any) {
    this.wantToAddMedia = false;
    const prompt = await this.alertCtrl.create({
      header:'Edit Entry',
      cssClass: "large-prompt",
      message: "Please edit the entry: ",
      inputs: [
        {
          name: 'date',
          type: 'date',
          placeholder: 'Date',
          value: entry.date,
        },
        {
          name: 'techniques',
          type: 'textarea',
          placeholder: "Techniques",
          value: entry.techniques,
        },
        {
          name: 'notes',
          type: 'textarea',
          placeholder: "Notes",
          value: entry.notes,
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
          handler: async editedEntry => {
            console.log('Save clicked', editedEntry);
            if (this.wantToAddMedia){
              await this.captureMedia();
              editedEntry.media =this.currentMedia;
            } else {
              editedEntry.media = entry.media;
            }
            this.entries[index] = editedEntry;
            this.currentMedia = '';
            this.wantToAddMedia = false;
          }
        }
      ]
    });
    await prompt.present();
  }

}
