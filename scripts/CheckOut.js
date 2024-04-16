// Updating cart items in the header
function updateCartItems() {
    document.querySelector('.cart-count').innerHTML=`(${cart.totalQuantity} items)`;
}
updateCartItems();

// Handling empty cart case

function addHTMLWhenCartIsEmpty() {
    const orderButton=document.querySelector('.order-summary button');
    if(cart.totalQuantity===0)
    {
        document.querySelector('.products').innerHTML = 
        `
            <p>Your cart is empty.</p>
            <a class="view-products" href="amazon.html">
                View products
            </a>
        `;
        orderButton.style.opacity=0.5;
        orderButton.style.cursor='not-allowed';
        orderButton.querySelector('a').style.zIndex=-10;
    }
    else 
    {
        orderButton.style.opacity=1;
        orderButton.style.cursor='pointer';
        orderButton.querySelector('a').style.zIndex=10;
    }
}

// Free Delivery - 7 days
// 4.99 $ delivery - 4 days
// 9.99 $ delivery -2 days

const currDate=new Date();
let type1Delivery=new Date(currDate),type2Delivery=new Date(currDate),type3Delivery=new Date(currDate);
type1Delivery.setDate(currDate.getDate() + 7);
type2Delivery.setDate(currDate.getDate() + 4);
type3Delivery.setDate(currDate.getDate() + 2);
// console.log(
//     type1Delivery,
//     type2Delivery,
//     type3Delivery
// );


function addProductToCart(item) {
    const product=item.product;
    document.querySelector('.products').innerHTML +=
    `
    <div class="product-info delete-${product.id}">
        <h3>Delivery date: ${days[type1Delivery.getDay()]}, ${months[type1Delivery.getMonth()]} ${type1Delivery.getDate()}</h3>
        <div class="content-grid">
            <img src="${item.product.image}" alt="">
            <div class="product-description">
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price"><b>${'$' + (product.priceCents/100).toFixed(2)}</b></p>
                <p>
                    <span>Quantity: </span>
                    <span class="product-quantity">${item.quantity}</span>
                    <input type="number" id="input-quantity" class="hide-element" min="1"> 
                    <button class="update" name="${product.id}">Update</button><button class="delete" data-product-id="${product.id}">Delete</button>
                </p>
            </div>
            <div class="delivery-info">
                <h4>Choose a delivery option:</h4>
                <div class="delivery-option">
                    <input type="radio" checked name="${product.id}" data-delivery-type="1">
                    <p>${days[type1Delivery.getDay()]}, ${months[type1Delivery.getMonth()]} ${type1Delivery.getDate()}</p>
                    <p>FREE Shipping</p>
                </div>
                
                <div class="delivery-option">
                    <input type="radio" name="${product.id}" data-delivery-type="2">
                    <p>${days[type2Delivery.getDay()]}, ${months[type2Delivery.getMonth()]} ${type2Delivery.getDate()}</p>
                    <p>$4.99 -  Shipping</p>
                </div>

                <div class="delivery-option">
                    <input type="radio" name="${product.id}" data-delivery-type="3">
                    <p>${days[type3Delivery.getDay()]}, ${months[type3Delivery.getMonth()]} ${type3Delivery.getDate()}</p>
                    <p>$9.99 -  Shipping</p>
                </div>
            </div>
        </div>
    </div>
    `;
}

function renderProductsinCart() {
    if(cart.totalQuantity===0)  return ;
    document.querySelector('.products').innerHTML=``;
    cart.items.forEach((item) => {
        addProductToCart(item);
    });
}

renderProductsinCart();

// Managing the cart -  Calculating total costs and discounts



const typeToCharge = {
    1 : 0,
    2 : 4.99,
    3 : 9.99
};

const typeToDeliveryDate = {
    1: `${days[type1Delivery.getDay()]}, ${months[type1Delivery.getMonth()]} ${type1Delivery.getDate()}`,
    2: `${days[type2Delivery.getDay()]}, ${months[type2Delivery.getMonth()]} ${type2Delivery.getDate()}`,
    3: `${days[type3Delivery.getDay()]}, ${months[type3Delivery.getMonth()]} ${type3Delivery.getDate()}`
};

const productInfos = Array.from(document.querySelectorAll('.product-info'));

let deliveryType=[];

if(localStorage.getItem('deliveryTypes') && JSON.parse(localStorage.getItem('deliveryTypes')).length>0)
{
    deliveryType=JSON.parse(localStorage.getItem('deliveryTypes'));
}
else 
{
    if(localStorage.getItem('deliveryTypes') && JSON.parse(localStorage.getItem('deliveryTypes')).length===0)
    {
        localStorage.removeItem('deliveryTypes');
    }
    for(let i=0;i<cart.items.length;i++)
    {
        deliveryType.push(1);
    }
}


function renderDeliveryTypes() {
    // console.log("Rendering delivery types ......");
    productInfos.forEach((productInfo,productIndex) => {
        const inputButtons=Array.from(productInfo.querySelectorAll('input:not([class])'));
        // console.log(inputButtons,productIndex);
        inputButtons[deliveryType[productIndex]-1].checked=true;
    });
}
renderDeliveryTypes();

function evaluateShippinCost(deliveryType)
{
    if(cart.totalQuantity===0)  return 0;
    return deliveryType.reduce((acc,curr) => {
        acc+=typeToCharge[curr];
        return acc;
    },0);
}

// console.log(evaluateShippinCost(deliveryType));

function valuateCart(cart)
{
    let totalValue=0;
    cart.items.forEach((item) => {
        totalValue += parseFloat(((item.product.priceCents*item.quantity)/100).toFixed(2));
    });
    let shippingCost=evaluateShippinCost(deliveryType);
    let totalValueBeforTax=parseFloat(((totalValue*100 + evaluateShippinCost(deliveryType)*100)/100).toFixed(2));
    let tax=parseFloat((totalValueBeforTax/10).toFixed(2));
    let totalValueAfterTax=parseFloat(((totalValue*100 + tax*100 + evaluateShippinCost(deliveryType)*100)/100).toFixed(2));
    return [totalValue.toFixed(2),shippingCost,totalValueBeforTax.toFixed(2),tax.toFixed(2),totalValueAfterTax.toFixed(2)];
}


function renderOrderSummary()
{
    const order=document.querySelector('.order-summary');
    const valuatedCart=valuateCart(cart);
    order.innerHTML=``;
    order.innerHTML = 
    `
        <h3>Order Summary</h3>
        <div class="money-breakdown">
            <div class="category">
                <p>Items (${cart.totalQuantity}):</p>
                <p>$${valuatedCart[0]}</p>
            </div>

            <div class="category">
                <p>Shipping & handling:</p>
                <p>$${valuatedCart[1].toFixed(2)}</p>
            </div>

            <div class="category tax-inclusion">
                <p>Total before tax:</p>
                <p>$${valuatedCart[2]}</p>
            </div>

            <div class="category">
                <p>Estimated tax (10%) :</p>
                <p>$${valuatedCart[3]}</p>
            </div>
        </div>

        <div class="cumulative">
            <h3>Order total:</h3>
            <h3>$${valuatedCart[4]}</h3>
        </div>

        <span class="pay-options">Use PayPal</span>
        <input type="checkbox" name="" id="">

        <button>
            Place your order
            <a href="orders.html"></a>
        </button>
    `;
}
renderOrderSummary();

addHTMLWhenCartIsEmpty();

// Handling the delivery types


const inputRadioButtons=document.querySelectorAll('.delivery-option > input');
// const deliveryInfo
// console.log(inputRadioButtons.length);
inputRadioButtons.forEach((radioButton) => {
    radioButton.addEventListener('click',(event) => {
        let index=0;
        // console.log(radioButton.dataset);
        // console.log(radioButton.name);
        cart.items.forEach((item,itemIndex) => {
            const product=item.product;
            if(product.id===radioButton.name)
            {
                index=itemIndex;
            }
        });
        deliveryType[index]=Number(radioButton.dataset.deliveryType);
        productInfos[index].querySelector('h3').innerHTML=`Delivery date: ${typeToDeliveryDate[radioButton.dataset.deliveryType]}`;

        // console.log(typeToDeliveryDate[radioButton.dataset.deliveryType]);

        renderOrderSummary();

        // Storing the deliveryTypes to the local storage

        localStorage.setItem('deliveryTypes',JSON.stringify(deliveryType));
        localStorage.setItem('cart',JSON.stringify(cart));
    });
});


// Handling the update button

const updateButtons=Array.from(document.querySelectorAll('#input-quantity + *'));
const inputEles=Array.from(document.querySelectorAll('#input-quantity'));
const inputQuantitys=Array.from(document.querySelectorAll('.product-quantity'));

updateButtons.forEach((updateButton,index) => {
    const inputEle=inputEles[index];
    const inputQuantity=inputQuantitys[index];

    updateButton.addEventListener(('click'),() => {
        let buttonIndex=0;
        cart.items.forEach((item,itemIndex) => {
            if(item.product.id===updateButton.name)
            {
                buttonIndex=itemIndex;
            }
        });
        // console.log(`Update button pressed at index: ${buttonIndex}`);
        if(updateButton.innerHTML==="Update")
        {
            updateButton.innerHTML="Save";
            inputEle.classList.remove('hide-element');
            inputQuantity.classList.add('hide-element');
            inputEle.value=inputQuantity.innerHTML;
        }
        else
        {
            updateButton.innerHTML="Update";
            inputEle.classList.add('hide-element');
            inputQuantity.classList.remove('hide-element');

            if(!inputEle.value)
            {
                return ;
            }

            inputQuantity.innerHTML=inputEle.value;

            let prevQuantity=cart.items[buttonIndex].quantity;
            let currQuantity=Number(inputEle.value);
            cart.totalQuantity+=(currQuantity-prevQuantity);
            cart.items[buttonIndex].quantity=Number(inputEle.value);

            updateCartItems();
            renderOrderSummary();
            localStorage.setItem('cart',JSON.stringify(cart));
        }
    });    

    inputEle.addEventListener(('keydown'),(event) => {
        // console.log(event);
        if(event.key==="Enter")
        {
            let buttonIndex=0;
            cart.items.forEach((item,itemIndex) => {
                if(item.product.id===updateButton.name)
                {
                    buttonIndex=itemIndex;
                }
            });

            updateButton.innerHTML="Update";
            inputEle.classList.add('hide-element');
            inputQuantity.classList.remove('hide-element');

            if(!inputEle.value)
            {
                return ;
            }

            inputQuantity.innerHTML=inputEle.value;

            let prevQuantity=cart.items[buttonIndex].quantity;
            let currQuantity=Number(inputEle.value);
            cart.totalQuantity+=(currQuantity-prevQuantity);
            cart.items[buttonIndex].quantity=Number(inputEle.value);

            updateCartItems();
            renderOrderSummary();
            localStorage.setItem('cart',JSON.stringify(cart));
        }
    });
});

// Handling the delete button

const deleteButtons=document.querySelectorAll('.delete');
deleteButtons.forEach((deleteButton) => {
    deleteButton.addEventListener('click',() => {
        const productId=deleteButton.dataset.productId;
        // console.log(productId);
        let quantityRemoved=0,removedIndex=0;
        let newCart=[];
        cart.items.forEach((item,index)=> {
            if(item.product.id!==productId)
            {
                newCart.push(item);
            }
            else 
            {
                removedIndex=index;
                quantityRemoved=item.quantity;
            }
        });
        // console.log(quantityRemoved);
        
        cart.items=newCart;
        cart.totalQuantity-=quantityRemoved;

        const container=document.querySelector(`.delete-${productId}`);
        container.remove();

        deliveryType.splice(removedIndex,1);
        updateButtons.splice(removedIndex,1);
        inputEles.splice(removedIndex,1);
        inputQuantitys.splice(removedIndex,1);
        productInfos.splice(removedIndex,1);

        updateCartItems();
        renderOrderSummary();

        addHTMLWhenCartIsEmpty();

        localStorage.setItem('deliveryTypes',JSON.stringify(deliveryType));
        localStorage.setItem('cart',JSON.stringify(cart));
    });
});


// Handling Place your order button
const placeOrder=document.querySelector('.order-summary button');

placeOrder.addEventListener('click',() => {
    console.log("Place order button is clicked.");
    if(cart.totalQuantity)
    {
        console.log("Your cart is not empty dude. Your order is placed.");
        const currDate=new Date();
        orders.unshift({
            orderId : orders.length + 1,
            orderPlacedDate: currDate,
            totalValue: `${valuateCart(cart)[4]}`,
            products: cart.items.map((item,index) => {
               return {
                product : item.product,
                quantity : item.quantity,
                deliveryType : deliveryType[index] 
               };
            })
        });

        localStorage.setItem('orders',JSON.stringify(orders));

        console.log(orders);

        cart.totalQuantity=0;
        cart.items=[];
        deliveryType=[];
        localStorage.setItem('cart',JSON.stringify(cart));
        localStorage.setItem('deliveryTypes',JSON.stringify(deliveryType));

        updateCartItems();
        renderOrderSummary();
        addHTMLWhenCartIsEmpty();
    }
});

