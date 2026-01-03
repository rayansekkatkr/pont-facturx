1) the user should upload multiple invoice pdf. UI /upload
2) We use OCR in JS backend to analyse each file and give the interface to correct data if they are wrong. API OCR /process, UI to check data consistency /verify
3) User validate the data and send to the JS backend, it'll convert the PDF metada to add electronical France specification invoice and let the user upload the files
UI to download the new files /results, API to download /download