function InquirerList(name, message, choices){
    this.name = name;
    this.message = message;
    this.choices = choices;
    this.type = "list";
}

function InquirerInput(name, message){
    this.name = name;
    this.message = message;
    this.type = "input";
}

module.exports = {InquirerList , InquirerInput};