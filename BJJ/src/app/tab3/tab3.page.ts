import { Component } from '@angular/core';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
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
