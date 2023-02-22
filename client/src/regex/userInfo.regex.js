 const regexUsername = (text) =>{
    const regex = /^[a-z]{1}[\w]{5,20}/
    if(text){

       return regex.test(text)

    }
    return false
}


const regexPassword = (text) =>{
    const regex = /^[A-Z]{1}[^\s]{5,20}/
    if(text){
       return regex.test(text)
    }


}
const regexEmail = (text) => {
    let emailTest = text.toLowerCase()
    let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return regexEmail.test(emailTest)
};





export {regexUsername ,regexPassword , regexEmail}