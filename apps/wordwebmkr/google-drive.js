/* WordWebMkr uses the shared Google Drive save module (GSI + drive.file upload).
   It reads the OAuth client id from <meta name="google-drive-client-id">. */
export { saveToGoogleDrive, openFromGoogleDrive, connectGoogleDrive } from '../shared/google-drive.js';
