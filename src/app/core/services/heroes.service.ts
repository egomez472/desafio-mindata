import { Injectable } from '@angular/core';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private storage = getStorage();

  public async uploadHeroImage(name: string, file: File) {
    const storageRef = ref(this.storage, name);

    const metadata = {
      contentType: file.type
    };

    let response = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
    return response
  }
}
