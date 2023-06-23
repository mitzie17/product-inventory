class Article {
    constructor(name, subfamily, price, units, image) {
        this.name = name;
        this.subfamily = subfamily;
        this.price = price;
        this.units = units;
        this.image = image
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

    static createArticle(name, subfamily, price, units, image) {
        ArticleInventory.createArticle(new Article(name, subfamily, price, units, image))
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(articles));
    }

    static editArticle(name, subfamily, price, units, image) {
        ArticleInventory.updateArticle(name, subfamily, price, units, image)
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(this.articles));
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
                        <h2 id="article-name">${article.name}</h2>
                        
                        <button class="btn btn-danger" onclick="DOMManager.deleteArticle('${article.id}')">Delete</button>
                        <button class="btn btn-success edit-article-btn" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Edit
                        </button>
                            <div class="collapse" id="collapseExample">
                            
                            <div id="edit-article-div" >
                            <h2 id="edit-article-heading">Edit Article</h2>
                            <input type="text" id="edit-article-name" class="form-control" placeholder="Article Name"> <br>
                            <input type="text" id="edit-article-subfamily" class="form-control" placeholder="Subfamily"> <br>
                            <input type="number" id="edit-article-price" class="form-control" placeholder="Price"> <br>
                            <input type="number" id="edit-article-units" class="form-control" placeholder="Units"> <br>
                            <input type="text" id="edit-article-image" class="form-control" placeholder="Image URL"> <br>
                            
                            <button id="edit-article-btn" class="btn btn-success form-control">Submit</button>
                            </div>
                            
                            </div>
                    </div>

                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                <h4>${article.subfamily}</h4>
                                <h4>Price: $ ${article.price}</h4>
                                <h4>Available Units: ${article.units}</h4>
                                <img src="${article.image}" alt="article image" class="center">
                                </div>
                            </div>
                        </div>
                    </div>

                </div>`
            );
        }
    }
}

$('#create-new-article').click(() => {
    DOMManager.createArticle($('#new-article-name').val(),
    $('#new-article-subfamily').val(),
    $('#new-article-price').val(),
    $('#new-article-units').val(),
    $('#new-article-image').val());

    $('#new-article-name').val('');
    $('#new-article-subfamily').val('');
    $('#new-article-price').val('');
    $('#new-article-units').val('');
    $('#new-article-image').val('');
});

$('#edit-article-btn').click(() => {
    DOMManager.editArticle($('#edit-article-name').val(),
    $('#edit-article-subfamily').val(),
    $('#edit-article-price').val(),
    $('#edit-article-units').val(),
    $('#edit-article-image').val());

    $('#edit-article-name').val('');
    $('#edit-article-subfamily').val('');
    $('#edit-article-price').val('');
    $('#edit-article-units').val('');
    $('#edit-article-image').val('');
});

DOMManager.getAllArticles();
