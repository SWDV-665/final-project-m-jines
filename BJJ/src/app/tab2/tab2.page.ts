import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Camera,CameraSource, CameraResultType, Photo } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
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
    const actionSheet = await this.alertCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture();
          }
        },
        {
          text: 'Select from Gallery',
          handler: () => {
            this.selectFromGallery();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async takePicture() {

    const image = await Camera.getPhoto({
      source: CameraSource.Camera,
      allowEditing: true,
      resultType: CameraResultType.Uri,
      // additional camera options
    });
    
    this.processImage(image);
  }

  async selectFromGallery() {
    const image = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri, 
      
    });
    if (image.webPath) {
      this.currentMedia = image.webPath;
      this.processImage(image);
    } else {
      console.error('No image path returned');
      this.currentMedia = ''; 
    }
  }
  
  processImage(image: Photo) {
    if (image && image.webPath) {
      this.currentMedia = image.webPath;
    } else {
      console.error('No image path returned');
      this.currentMedia = '';
    }
  }

  async showAddEntryPrompt() {
    this.wantToAddMedia = false;
    const prompt = await this.alertCtrl.create({
      header: 'New Journal Entry',
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
            this.captureMedia();
            return false; // Prevent prompt from closing
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
          handler: entry => {
            console.log('Save Clicked', entry);
            entry.media = this.currentMedia;
            this.entries.push(entry);
            this.currentMedia = ''; // Reset currentMedia for the next entry
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
            this.captureMedia();
            return false; // Prevent prompt from closing
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
          handler: editedEntry => {
            console.log('Save clicked', editedEntry);
            editedEntry.media = this.currentMedia;
            this.entries[index] = editedEntry;
            this.currentMedia = ''; // Reset currentMedia for the next entry
          }
        }
      ]
    });
    await prompt.present();
  }
  

}
