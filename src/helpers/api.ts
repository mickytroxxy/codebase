import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, setDoc, query, where, updateDoc, GeoPoint, orderBy, limit, deleteDoc, onSnapshot, Timestamp, FirestoreError, startAfter, getDoc, documentId } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { initializeFirestore } from 'firebase/firestore'
import { geohashForLocation, geohashQueryBounds,Geohash} from 'geofire-common';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
// @ts-ignore
import geohash from "ngeohash";
import axios from "axios";


interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const app = initializeApp(firebaseConfig);
export const db = initializeFirestore(app, { experimentalForceLongPolling: true })
export const auth = getAuth(app);
export const storage = getStorage(app);

export const getGeoPoint = (latitude: number, longitude: number) => geohashForLocation([latitude, longitude]);

export const createData = async (tableName: string, docId: string, data: any): Promise<boolean> => {
  try {
    await setDoc(doc(db, tableName, docId), data);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const loginApi = async (phoneNumber: string, password: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber), where("password", "==", password), where("deleted", "==", false)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};


export const getNearByTrucks = async (latitude: number, longitude: number, radius: number): Promise<any[]> => {
  try {
    const range = getGeohashRange(latitude, longitude, radius);
    let querySnapshot = await getDocs(query(collection(db, 'trucks'),limit(300),where("status", "==", 'ACTIVE'), where('geoHash', '>=', range.lower), where('geoHash', '<=', range.upper)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getSecretKeys = async (): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "secrets")));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const updateData = async (tableName: string, docId: string, obj: { field: string; value: any }): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, { [obj.field]: obj.value });
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const deleteData = async (tableName: string, docId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, tableName, docId));
    return true;
  } catch (e) {
    return false;
  }
};
export const updateTable = async (tableName: string, docId: string, obj:any): Promise<boolean> => {
  try {
    const docRef = doc(db, tableName, docId);
    await updateDoc(docRef, obj);
    return true;
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const getUserDetailsByPhone = async (phoneNumber: string): Promise<any[]> => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), where("phoneNumber", "==", phoneNumber)));
      const data = querySnapshot.docs.map((doc) => doc.data());
      return data;
    } catch (e) {
      console.error(e);
      return [];
    }
};
export const getUserDetailsByUserId = async (userId: string): Promise<any[]> => {
  try {
    const querySnapshot = await getDocs(query(collection(db, "users"), where("userId", "==", userId)));
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  } catch (e) {
    console.error(e);
    return [];
  }
};
export const uploadFile = async (file: string, path: string): Promise<string> => {
  const storage = getStorage(app);
  const fileRef = ref(storage, path);
  const response = await fetch(file);
  const blob = await response.blob();
  const uploadTask = await uploadBytesResumable(fileRef, blob);
  const url = await getDownloadURL(uploadTask.ref);
  return url;
};
const getGeohashRange = (latitude:number,longitude:number,distance:number) => {
  const lat = 0.0144927536231884;
  const lon = 0.0181818181818182;
  const lowerLat = latitude - lat * distance;
  const lowerLon = longitude - lon * distance;
  const upperLat = latitude + lat * distance;
  const upperLon = longitude + lon * distance;
  const lower = geohash.encode(lowerLat, lowerLon);
  const upper = geohash.encode(upperLat, upperLon);
  return {
    lower,
    upper
  };
};