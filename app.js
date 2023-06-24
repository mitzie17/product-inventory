class Article {
    constructor(name, subfamily, price, units, image) {
        this.name = name;
        this.price = price;
        this.subfamily = subfamily;
        this.image = image;
        this.units = units  
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
        console.log(article)
        return $.post(this.url, article);
    }

    static updateArticle(id, article) {
        console.log(id)
        console.log(article)
        return $.ajax({
            url: this.url + `/${id}`,
            dataType: 'json',
            data: JSON.stringify([article]),
            contentTpye: 'application/json',
            type: 'PUT'
        }).then(() => {
            return ArticleInventory.getAllArticles();
        })
            .then((articles) => {
                DOMManager.render(articles);
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

    static editArticle(id) {
        console.log(id)
        let updatedArticle = {
                    "name": $(`#edit-article-name-${id}`).val(),
                    "price": $(`#edit-article-price-${id}`).val(),
                    "subfamily": $(`#edit-article-subfamily-${id}`).val(),
                    "image": $(`#edit-article-image-${id}`).val(),
                    "units": $(`#edit-article-units-${id}`).val(),
                    "id": id
                };
        
        ArticleInventory.updateArticle(id, updatedArticle)
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(articles));
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

                        <button class="btn btn-success edit-article-btn" data-bs-toggle="collapse" data-bs-target="#collapse-${article.id}" aria-expanded="false" aria-controls="collapseExample">
                        Edit-${article.id}
                        </button>
                            <div class="collapse" id="collapse-${article.id}">
                            
                            <div id="edit-article-${article.id}-div" >
                            <h2 id="edit-article-heading">Edit Article</h2>
                            <input type="text" id="edit-article-name-${article.id}" class="form-control" value="${article.name}"> <br>
                            <input type="text" id="edit-article-subfamily-${article.id}" class="form-control" value="${article.subfamily}"> <br>
                            <input type="number" id="edit-article-price-${article.id}" class="form-control" value="${article.price}"> <br>
                            <input type="number" id="edit-article-units-${article.id}" class="form-control" value="${article.units}"> <br>
                            <input type="text" id="edit-article-image-${article.id}" class="form-control" value="${article.image}"> <br>
                            
                            <button class="btn btn-success form-control onclick="DOMManager.editArticle('${article.id}')">Submit-${article.id}</button>
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

// $(`#edit-article-btn`).click(() => {
//     let updatedArticle = {
//         "name": $(`#edit-article-name-${id}`).val(),
//         "price": $(`#edit-article-price-${id}`).val(),
//         "subfamily": $(`#edit-article-subfamily-${id}`).val(),
//         "image": $(`#edit-article-image-${id}`).val(),
//         "units": $(`#edit-article-units-${id}`).val(),
//         "id": id
//     };

//     $(`#edit-article-name-${id}`).val('');
//     $(`#edit-article-subfamily-${id}`).val('');
//     $(`#edit-article-price-${id}`).val('');
//     $(`#edit-article-units-${id}`).val('');
//     $(`#edit-article-image-${id}`).val('');

//     DOMManager.editArticle(id, updatedArticle)
// })

// $('#edit-article-btn').click(() => {
//     DOMManager.editArticle($('#edit-article-name').val(),
//     $('#edit-article-subfamily').val(),
//     $('#edit-article-price').val(),
//     $('#edit-article-units').val(),
//     $('#edit-article-image').val());

//     $('#edit-article-name').val('');
//     $('#edit-article-subfamily').val('');
//     $('#edit-article-price').val('');
//     $('#edit-article-units').val('');
//     $('#edit-article-image').val('');
// });

DOMManager.getAllArticles();
