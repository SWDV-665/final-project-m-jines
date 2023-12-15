import { Component } from '@angular/core';
import { Camera, CameraResultType, Photo, CameraSource } from '@capacitor/camera';
import { Share } from '@capacitor/share';
import { ToastController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';


interface TechniqueEntry {
  _id: string;
  name: string;
  description: string;
  relatedTechniques: string;
  status: string;
  media: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public showSearchBar: boolean = false;
  wantToAddMedia: boolean =false;
  title = "Technique Library"
  filteredTechniqueEntries: TechniqueEntry[] = [];
  entries: TechniqueEntry[] = [];

  currentMedia: string = ''; 
  constructor(private changeDetector: ChangeDetectorRef, private http: HttpClient, public toastCtrl: ToastController, public alertCtrl: AlertController) {

  }

  ngOnInit() {
    this.getTechniqueEntries().subscribe(
      (data: TechniqueEntry[]) => {
        this.entries = data;
        this.filteredTechniqueEntries = [...this.entries];
      },
    );
  }
  
  onSearchChange(event: any) {
    const searchTerm = event.detail.value.toLowerCase();
  
    this.filteredTechniqueEntries = this.entries.filter(entry => {
      return (entry.name && entry.name.toLowerCase().includes(searchTerm)) ||
             (entry.description && entry.description.toLowerCase().includes(searchTerm)) ||
             (entry.status && entry.status.toLowerCase().includes(searchTerm)) ||
             (entry.relatedTechniques && entry.relatedTechniques.toLowerCase().includes(searchTerm));
    });
  }
  

  toggleSearch() {
    this.showSearchBar = !this.showSearchBar;
  }

  getTechniqueEntries() {
    return this.http.get<TechniqueEntry[]>('http://localhost:8080/api/techniqueentries');
  }

  addTechniqueEntry(entry:any) {
    return this.http.post<TechniqueEntry>('http://localhost:8080/api/techniqueentries', entry);
  }

  updateTechniqueEntry(id: string, entry: any) {
    return this.http.put<TechniqueEntry>(`http://localhost:8080/api/techniqueentries/${id}`, entry);
  }

  deleteTechniqueEntry(id: string) {
    return this.http.delete(`http://localhost:8080/api/techniqueentries/${id}`);
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
    const toast = await this.toastCtrl.create({
      message: entry.name + " deleted.",
      duration: 3000
    });
    (await toast).present();
    this.deleteTechniqueEntry(entry._id).subscribe(() => {
      console.log('Entry deleted');
      this.entries.splice(index,1);
      this.filteredTechniqueEntries = [...this.entries];
    })
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
    });
    
    this.processImage(image);
  }

  async selectFromGallery() {
    const image = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri, 
      
    });
    if (image.webPath) {
      try {
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        const reader = new FileReader();
  
        reader.onloadend = () => {
          this.currentMedia = reader.result as string;
          this.changeDetector.detectChanges(); //change detection so i don't have to refresh
        };
  
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Error processing image:', error);
        this.currentMedia = '';
      }
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

      ],
      buttons: [
        {
          text: 'media',
          handler: () => {
            this.captureMedia();
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
          handler: newEntry => {
            console.log('Save Clicked', newEntry);
            newEntry.media = this.currentMedia;
        
            this.addTechniqueEntry(newEntry).subscribe(response => {
              console.log("Entry added", response);
        
              // Re-fetch all entries from the server - fixing the refresh issue
              this.getTechniqueEntries().subscribe(entries => {
                this.entries = entries;
                this.filteredTechniqueEntries = [...this.entries]; // Update the filtered list
        
                this.changeDetector.detectChanges(); // change detection
              }, error => {
                console.error('Error fetching entries:', error);
              });
        
              this.currentMedia = ''; 
            }, error => {
              console.error('Error adding entry:', error);
            });
          }
        }
      ]
    });
  
    await prompt.present();
  }

  async showEditEntryPrompt(entry: any, index: any) {
    this.currentMedia=entry.media;
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
       
       
      ],
      buttons: [
        {
          text: 'media',
          handler: () => {
            this.captureMedia();
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
          handler: editedEntry => {
            console.log('Save clicked', editedEntry);
            editedEntry.media = this.currentMedia;
  
            this.updateTechniqueEntry(entry._id, editedEntry).subscribe(response => {
              console.log("Entry Updated", response);
  
              // Update the entry in the array
              this.entries[index] = response;
              this.filteredTechniqueEntries = [...this.entries]; // update filtered list
  
              this.currentMedia = ''; 
            }, error => {
              console.error('Error updating entry:', error);
            });
          }
        }
      ]
    });
  
    await prompt.present();
  }

  ionViewDidEnter() {
    this.getTechniqueEntries().subscribe(entries => {
      this.entries = entries;
    });
  }

}
