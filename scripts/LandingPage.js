// Elements in cart 
function renderCartEleCount(cart) {
    // console.log(cart);
    document.querySelector('.ele-count').innerHTML=cart.totalQuantity;
    if(document.querySelector('.container').innerHTML)
    {
        document.querySelector('.container > h4:nth-child(2) > span').innerHTML=` ${cart.totalQuantity} `;
    }
}
renderCartEleCount(cart);

function addProductToHTML(product,productIndex)
{
    const imgSrc=product.image;
    let ratingImg='images/ratings/rating-',product_rating=product.rating.stars;
    product_rating=String(product_rating);
    if(product_rating.length>1 && product_rating[1]==='.')
    {
        product_rating=product_rating[0]+product_rating[2];
    }
    else if(product_rating[0]!=='0')
    {
        product_rating=product_rating+'0';
    }
    else
    {
        product_rating='0';
    }

    // console.log(product_rating);

    ratingImg=ratingImg+product_rating+'.png';
    // console.log(ratingImg);

    
    container.innerHTML +=
    `
        <div class="child">
            <img loading="lazy" src="${product.image}" alt="product-image">
            <p class="product-name">${product.name}</p>

            <div class="ratings">
                <img loading="lazy" src="${ratingImg}" alt="rating-image">
                <p class="ratings-count">${product.rating.count}</p>
            </div>
            <p><b>${'$' + (product.priceCents/100).toFixed(2)}</b></p>

            <select name="items-count" id="items-count">
                <option value="one">1</option>
                <option value="two">2</option>
                <option value="three">3</option>
                <option value="four">4</option>
                <option value="five">5</option>
                <option value="six">6</option>
                <option value="seven">7</option>
                <option value="eight">8</option>
                <option value="nine">9</option>
                <option value="ten">10</option>
            </select>
            
            <div class="add-to-cart">
                <img loading="lazy" src="images/icons/checkmark.png" alt="checkmark">
                <p>Added to cart</p>
            </div>

            <button data-product-id="${product.id}">
                Add to Cart
            </button>
        </div>
    `;
}

// Loading the content in the landing page

const container=document.querySelector('.content');
// console.log(container);
container.innerHTML='';

products.forEach((product,productIndex) => {
    addProductToHTML(product,productIndex);
});



// Handling the search bar

function isMatching(stringFromInput,productName)
{
    return productName.includes(stringFromInput);
}
// console.log(isMatching("Eevil","Devil Punju"));




// Adding Eventlisteners to the search button and input on keydown

const searchButton=document.querySelector('.search-button');
const inputButton=document.querySelector('header input');
function searchButtonEventHandler() {
    const valueInInput=inputButton.value;
    console.log(valueInInput);
    if(valueInInput)
    {
        container.innerHTML='';
        products.forEach((value,index) => {
            if(isMatching(valueInInput.toLowerCase(),value.name.toLowerCase()))
            {
                addProductToHTML(value);
            }
        });
        if(container.innerHTML==='')
        {
            container.innerHTML='<p style="margin-left: 10px">No product matches your search.</p>'
        }
    }
}
searchButton.addEventListener('click',searchButtonEventHandler);
inputButton.addEventListener('keydown',(event) => {
    if(event.key==='Enter')
    {
        searchButtonEventHandler();
    }
});




// Handling hamburger menu  

let menuClickStatus=false;
const menu=document.querySelector('.menu');
menu.addEventListener('click',() => {
    // console.log('menu is clicked');
    const container=document.querySelector('.container');
    if(!menuClickStatus)
    {
        menuClickStatus=true;
        container.innerHTML = 
        `
        <h4>
            Returns & Orders
            <a href="orders.html"></a>
        </h4>
        <h4>
            Cart (<span> ${cart.totalQuantity} </span>)
            <a href="checkout.html"></a>
        </h4>
        `;
        container.classList.add('onClickStyle');
    }
    else 
    {
        menuClickStatus=false;
        container.innerHTML=``;
        container.classList.remove('onClickStyle');
    }
});

// Handling the click event of add to cart button

const stringToNumberMatcher = {
    one : 1,
    two : 2,
    three : 3,
    four : 4,
    five : 5,
    six : 6,
    seven : 7,
    eight : 8,
    nine : 9,
    ten : 10
}

const addToCartButtons=document.querySelectorAll('.child > button');
const quantitySelectors=document.querySelectorAll('#items-count');


addToCartButtons.forEach((button,buttonIndex) => {
    button.addEventListener('click',() => {
        // console.log(button.dataset);
        
        let productId=button.dataset.productId;
        let quantity_selected=quantitySelectors[buttonIndex].value;
        quantity_selected=stringToNumberMatcher[quantity_selected];
        // console.log(quantity_selected);

        quantitySelectors[buttonIndex].nextElementSibling.classList.add('add-to-cart-animation');

        setTimeout(() => {
            quantitySelectors[buttonIndex].nextElementSibling.classList.remove('add-to-cart-animation');
        },500);

        cart.totalQuantity+=quantity_selected;

        let isMatching=false;

        cart.items.forEach((item) => {
            if(item.product.id===productId)
            {
                isMatching=true;
                
                item.quantity+=quantity_selected;
            }
        })

        if(!isMatching)
        {
            let product;
            products.forEach((item) => {
                if(item.id===productId)
                {
                    product=item;
                }
            });
            cart.items.push({
                product : product,
                quantity : quantity_selected
            });

            deliveryType.push(1);
        }

        localStorage.setItem('deliveryTypes',JSON.stringify(deliveryType));
        localStorage.setItem('cart',JSON.stringify(cart));
        renderCartEleCount(cart);
    });
});