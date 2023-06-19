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

    static getAllArticles() {
        return $.get(this.url);
    }

    static getArticle(id) {
        return $.get(this.url + `/${id}`);
    }

    static createArticle(article) {
        return $.post(this.url, article);
    }

    static updateArticle(article) {
        return $.ajax({
            url: this.url + `/${article._id}`,
            dataType: 'json',
            data: JSON.stringify(article),
            contentTpye: 'application/json',
            type: 'PUT'
        });
    }

    static deleteArticle(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}