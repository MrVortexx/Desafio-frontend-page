const apiURL = "https://frontend-intern-challenge-api.iurykrieger.vercel.app";

class Products{
    constructor(){
        this.page = 1;
    }
    async  #makeHTTPGetRequest(url, params)
    {   
        let api = `${url}/${params}`;
        console.log(api);

        let  data = await fetch (api, {mode: 'cors'});

        if (!data.ok) throw 'Failed to load posts';
        return await data.json();
    }
    async nodesHTMLContainer()
    {
        console.log('---' + this.page);
        let products, productElements;
        productElements    = [];
        try{
            products = await this.#makeHTTPGetRequest( apiURL, `products?page=${this.page}` );

        }catch(e){
            console.log(e);
        }

        if (!products) return false;

        products = products.products;
        products.map((product)=> {

            let productHTMLElement =`
                <div class="product-card">
                    <img src="http://${product.image}" class="product-image"></img>
                    <span class="product-name">${product.name}</span>
                    <div class="product-description">
                        <span class="product-description">${product.description}</span>
                    </div>
                    <span class="price-product-from">De: R$${product.oldPrice}</span>
                    <span class="price-product-actual">Por: R$${product.price}</span>
                    <span class="price-product-installment"> ou ${product.installments.count}x de R$${product.installments.value}</span>
                    <button class="product-buy-btn">Comprar</button>
                </div>
            `;
            productHTMLElement = new DOMParser().parseFromString(productHTMLElement, 'text/html').body.childNodes[0];
            
            productElements.push(productHTMLElement);

        });
        this.page= this.page+1;

        return productElements;
    }
}

function makeShowMoreBtn( onClickCallBack)
{
    const showMoreBtn = document.createElement('button');
    showMoreBtn.setAttribute("id", "show-more-products-btn");
    showMoreBtn.innerHTML = "Ainda mais produtos aqui!";
    showMoreBtn.addEventListener('click', ()=>{
        onClickCallBack();
    });

    return showMoreBtn;
}

function LoadProductsCaller(){

    let productsSection, productsDiv, productsInstance;
    productsDiv = document.getElementById("your-selection-products");
    productsDiv.innerHTML = "";

    productsInstance = new Products();
    
    this.setPosts = async () => {
        let products =  await productsInstance.nodesHTMLContainer();
        if (!products) return;
        console.log(products)
        products.map(async (post)=>{ productsDiv.insertAdjacentElement('beforeend', post); }); 
    } 
    const loadMoreBtn = makeShowMoreBtn(this.setPosts);

    productsSection = document.getElementById("your-selection");
    productsSection.insertAdjacentElement("beforeend", loadMoreBtn);
}


function loadProducts(){
    let postsCaller = new LoadProductsCaller();
    postsCaller.setPosts();
}

function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function submitShareForm(e){
    let email, nameShare, validateField;
    e.preventDefault();

    nameShare = document.getElementById('share-form-name-input');
    email = document.getElementById('share-form-email-input');
    
    validateField = document.getElementById('share-friends-form-validate-field');

    if (!email.value || !nameShare.value){
        validateField.innerHTML='<span> Email ou o nome estão vazios!</span>';
            return;
    }
    
    if (!validateEmail(email.value))  validateField.innerHTML='<span> Email inválido!!</span>';
}

document.addEventListener('DOMContentLoaded', () => {

    const shareForm = document.getElementById("share-friends-form");
    shareForm.onsubmit = (e)=>{
        submitShareForm(e);
    };

    loadProducts();
   
});
