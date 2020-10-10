function InquirerList(name, message, choices){
    this.name = name;
    this.message = message;
    this.choices = choices;
    this.type = "list";
}

module.exports = InquirerList;