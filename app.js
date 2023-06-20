class Article {
    constructor(name, subfamily, price) {
        this.name = name;
        this.subfamily = subfamily;
        this.price = price;
        this.image =image;
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

class DOMManager {
    static articles;
    
    static getAllArticles() {
        ArticleInventory.getAllArticles()
        .then(articles =>
            this.render(articles));
    }

    static deleteArticle(id) {
        ArticleInventory.deleteArticle(id)
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(articles));
    }

    static render(articles) {
        this.articles = articles;
        $('#app').empty();
        for (let article of articles) {
            $('#app').prepend(
                `<div id="${article.id}" class="card">
                    <div class="card-header">
                        <h2>${article.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteArticle('${article.id}')">Delete</button>
                    </div>

                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                <h4>${article.subfamily}</h4>
                                <h4>Price: $ ${article.price}</h4>
                                <h4>Available Units: ${article.units}</h4>
                                <img src="${article.image}" alt="article image" width="500" height="600">
                                </div>
                            </div>
                        </div>
                    </div>

            </div>`
            );
        }
    }
}

DOMManager.getAllArticles();
