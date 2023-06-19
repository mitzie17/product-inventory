class Article {
    constructor(name, subfamily, price) {
        this.name = name;
        this.subfamily = subfamily;
        this.price = price;
        this.units = [ ]
    }
}

class ArticleInventory {
    static url = 'https://6490c6d22f2c7ee6c2c77d0d.mockapi.io/api/v1/articles'
}