//const { data } = require("jquery");

// Attributes that an article has when created
class Article {
    constructor(name, subfamily, price, units, image) {
        this.name = name;
        this.price = price;
        this.subfamily = subfamily;
        this.image = image;
        this.units = units;  
    }
}

class ArticleInventory {
    // URL where reguests are sent
    static url = 'https://6490c6d22f2c7ee6c2c77d0d.mockapi.io/api/v1/articles'

    // Gets all article objects in the database
    static getAllArticles() {
        return $.get(this.url);
    }

    // Gets a specific article by its id
    static getArticle(id) {
        return $.get(this.url + `/${id}`);
    }

    // Creates an article
    static createArticle(article) {
        return $.post(this.url, article);
    }

    // This is where the update is suppose to occur, however AJAX PUT request doesn't update the article in the database.
    static updateArticle(id, article) {
    // Console logging id and article does return the right article id and article object, however...
        console.log(id)
        console.log(article)

        $(`#editArticle_${id}`).show();
        $(`#${id} p`).hide();
    // Somewhere here is where the article object doesn't get updated in the database. Did some research but could not find a way for 
    // the newly edited article to re-render with the new edited information. Currently still working on this....
        return $.ajax({
            url: this.url + '/' + id,
            dataType: 'json',
            data: JSON.stringify(article),
            contentType: 'application/json',
            type: 'PUT'
        }).then(() => {
            return ArticleInventory.getAllArticles();
        })
            .then((articles) => {
                DOMManager.render(articles);
            });
    }

    // Deletes an article by passing its id
    static deleteArticle(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        });
    }
}

class DOMManager {
    static articles;
    
    // Renders all articles when called
    static getAllArticles() {
        ArticleInventory.getAllArticles()
        .then(articles =>
            this.render(articles));
    }

    // Creates article by calling the constructor and passing all attributes associated with an article object
    // It also renders all articles
    static createArticle(name, subfamily, price, units, image) {
        ArticleInventory.createArticle(new Article(name, subfamily, price, units, image))
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(articles));
    }

    // Passes an article id to the deleteArticle method to delete that article and renders all articles
    static deleteArticle(id) {
        ArticleInventory.deleteArticle(id)
        .then(() => {
            return ArticleInventory.getAllArticles();
        })
        .then((articles) => this.render(articles));
    }

    // Method that renders all articles in the database
    static render(articles) {
        this.articles = articles;
        $('#app').empty();
        for (let article of articles) {
            $('#app').prepend(
                `<div id="${article.id}" class="card">
                    <div class="card-header">
                        <h2 id="article-name">${article.name}</h2>
                        
                        <button class="btn btn-danger" onclick="DOMManager.deleteArticle('${article.id}')">Delete</button>
                        <button class="btn btn-success" id="updateArticle" onclick="DOMManager.updateArticle('${article.id}')">Edit</button>


                        <div id="editArticle_${article.id}" class="mt-2" style="display:none;">
                            <input type="text" id="editName_${article.id}" class="form-control m-1" value="${article.name}">
                            <input type="text" id="editSubfamily_${article.id}" class="form-control m-1" value="${article.subfamily}">
                            <input type="number" id="editPrice_${article.id}" class="form-control m-1" value="${article.price}">
                            <input type="number" id="editUnits_${article.id}" class="form-control m-1" value="${article.units}">
                            <input type="text" id="editImage_${article.id}" class="form-control m-1" value="${article.image}">
                            <button class="btn btn-success m-1" onclick="DOMManager.saveArticle('${article.id}')">Save</button>
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

    // Displays the input fields for updating an article 
    static updateArticle(id) {
        $(`#editArticle_${id}`).show();
        $(`#${id} p`).hide();
    }

    // This method captures the values in the edit fields and updates the article in the API and re-renders the articles
    static saveArticle(id) {
        let articleUpdated = {
            "name": $(`#editName_${id}`).val(),
            "price": $(`#editPrice_${id}`).val(),
            "subfamily": $(`#editSubfamily_${id}`).val(),
            "units": $(`#editUnits_${id}`).val(),
            "image": $(`#editImage_${id}`).val(),
            "id": id
        }
        ArticleInventory.updateArticle(id, articleUpdated)
            .then(() => {
                return ArticleInventory.getAllArticles();
            })
            .then((articles) => this.render(articles));
    }
}

// Event listener attached to the create button that initiates the creating process of a new article object
// Passes all values in the input fields to the createArticle method as arguments
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

// Calls the method to render (display) all articles when the page loads
DOMManager.getAllArticles();
