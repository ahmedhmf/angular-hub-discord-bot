module.exports = (logo) =>{
    const pattern = /^((http|https):\/\/)/;
    return pattern.test(logo) ? logo : "https://angular-hub.com/" + logo ;

}