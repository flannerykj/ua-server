const getRotatedBase64 = function(files) {
  var rotatedBase64 = [];
  ExifRotate.getBase64String(files, {
        max_size: 700,
    }, (base64) => {
        rotatedBase64 = [base64];
    });
  /*var rotatedFiles = [];
  rotatedBase64.map((data, i) => {
    rotatedFiles.push(utils.dataURLtoFile(data, files.item(i).name));
  });*/
  return rotatedBase64;
}

function dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type:mime});
}


exports.getRotatedBase64 = getRotatedBase64;
