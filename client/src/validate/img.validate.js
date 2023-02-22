var _validFileExtensions = ["jpg", "jpeg", "bmp", "gif", "png"];

function isValidPhoto(fileType)
{


    var file_extension = fileType.split('/').pop()

    if(_validFileExtensions.includes(file_extension)) return true
   

    return false;
}
export default isValidPhoto
