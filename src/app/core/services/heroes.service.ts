import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from 'firebase/storage';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private storage = getStorage();

  constructor() {}

  // public async uploadHeroImage(name: string, imageBase64: any) {
  //   const storageRef = ref(this.storage, name);
  //   let response = await uploadString(storageRef, imageBase64, 'base64');
  //   console.log(response);
  // }

  public async uploadHeroImage(name: string, file: File) {
    const storageRef = ref(this.storage, name); // referencia al archivo en storage
    // const base64String = imageBase64.split(',')[1];

    const metadata = {
      contentType: file.type // Establecer el tipo MIME correcto
    };

    let response = await uploadBytes(storageRef, file, metadata).then(() => getDownloadURL(storageRef));
    return response

    // return uploadString(storageRef, base64String, 'base64')
    //   .then(() => {
    //     // Obtener el URL de descarga de la imagen
    //     return getDownloadURL(storageRef);
    //   })
    //   .then((downloadURL) => {
    //     console.log('File available at', downloadURL);
    //     return downloadURL; // Devuelve la URL de la imagen subida
    //   })
    //   .catch((error) => {
    //     console.error('Error uploading image:', error);
    //     throw error; // Manejo de errores
    //   });
  }
}
