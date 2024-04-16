function updateCartItems()
{
    document.querySelector('.ele-count').innerHTML=`${cart.totalQuantity}`;
    if(document.querySelector('.container').innerHTML)
    {
        document.querySelector('.container > h4:nth-child(2) > span').innerHTML=` ${cart.totalQuantity} `;
    }
}
updateCartItems();

function arrivalDateCalc(currDate,deliveryType)
{
    let newDate=new Date(currDate);
    if(deliveryType===1)
    {
        newDate.setDate(newDate.getDate() + 7);
    }
    else if(deliveryType===2)
    {
        newDate.setDate(newDate.getDate() + 4);
    }
    else 
    {
        newDate.setDate(newDate.getDate() + 2);
    }
    return newDate;
}

function renderOrders()
{
    let ordersSection=document.querySelector('main');
    ordersSection.innerHTML=`<h2>Your Orders</h2>`;
    orders.forEach((order,orderIndex) => {
        // console.log(order);
        const currDate=new Date(order.orderPlacedDate);
        const orderHeader=
        `
            <div class="order-header">
                <div class="order-details">
                    <div>
                        <p>
                            <b>Order Placed:</b>
                        </p>
                        <p>${months[currDate.getMonth()]} ${currDate.getDate()}</p>
                    </div>
                    <div>
                        <p>
                            <b>Total:</b>
                        </p>
                        <p>$${order.totalValue}</p>
                    </div>
                </div>
                <div class="order-id">
                    <p>
                        <b>Order Id:</b>
                    </p>
                    <p>${order.orderId}</p>
                </div>
            </div>
        `;
        let products=``;
        order.products.forEach((product,productIndex) => {
            let arrivalDate=arrivalDateCalc(currDate,product.deliveryType);
            products+=
            `
            <div class="item-section">
                <img src="${product.product.image}" alt="product-img">
                
                <div class="item-info">
                    <h4>${product.product.name}</h4>
                    <p>Arriving on: ${months[arrivalDate.getMonth()]} ${arrivalDate.getDate()}</p>
                    <p>Quantity: ${product.quantity}</p>
                    <button class="buy-again" data-product-id="${product.product.id}">
                        <img src="images/icons/buy-again.png" alt="buy-again-icon">
                        <p>Buy it again</p>
                    </button>
                    <button class="tracking-hidden" data-product-index="${productIndex}" data-order-index="${orderIndex}">
                        Track Package
                        <a href="tracking.html"></a>      
                    </button>
                </div>
                
                <button class="tracking" data-product-index="${productIndex}" data-order-index="${orderIndex}">
                    Track Package
                    <a href="tracking.html"></a>
                </button>
            </div>
            `
        });
        ordersSection.innerHTML+=
        `
            <section class="order-section">
                ${orderHeader}
                ${products}
            </section>
        `;
    });
}

renderOrders();

// Handling the buy again buttons

const buyAgainButtons=document.querySelectorAll('.buy-again');
buyAgainButtons.forEach((button) => {
    button.addEventListener('click',() => {
        // console.log("Button is clicked");
        button.innerHTML = `
            <img src="images/icons/checkmark.png" alt="checkmark--v1"/>
            <p>Added</p>
            `;
        setTimeout(() => {
            button.innerHTML = `
                <img src="images/icons/buy-again.png" alt="buy--v1" />
                <p>Buy it again</p>
            `;
        }, 1000);

        // Adding the element to the cart
        let productId=button.dataset.productId;
        let quantity_selected=1;
        // console.log(quantity_selected);

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
        }

        localStorage.setItem('cart',JSON.stringify(cart));
        updateCartItems();
    })
})

// Handling the tracking buttons 

const trackingHiddenButtons=document.querySelectorAll('.tracking-hidden');
trackingHiddenButtons.forEach((trackingHiddenButton) => {
    trackingHiddenButton.addEventListener('click',()=> {
        let orderIndex=trackingHiddenButton.dataset.orderIndex;
        let productIndex=trackingHiddenButton.dataset.productIndex;
        orderIndex=Number(orderIndex);
        productIndex=Number(productIndex);
        const orderPlacedDate=new Date(orders[orderIndex].orderPlacedDate);
        clickStatus.orderPlacedDate=orderPlacedDate;
        const arrivalDate=arrivalDateCalc(new Date(orders[orderIndex].orderPlacedDate),orders[orderIndex].products[productIndex].deliveryType);

        clickStatus.orderIndex = orderIndex,clickStatus.productIndex=productIndex,clickStatus.arrivalDate=arrivalDate;
        localStorage.setItem('clickStatus',JSON.stringify(clickStatus));
    });
});

const trackingButtons=document.querySelectorAll('.tracking');
trackingButtons.forEach((trackingButton) => {
    trackingButton.addEventListener('click',()=> {
        let orderIndex=trackingButton.dataset.orderIndex;
        let productIndex=trackingButton.dataset.productIndex;
        orderIndex=Number(orderIndex);
        productIndex=Number(productIndex);
        const orderPlacedDate=new Date(orders[orderIndex].orderPlacedDate);
        clickStatus.orderPlacedDate=orderPlacedDate;
        const arrivalDate=arrivalDateCalc(new Date(orders[orderIndex].orderPlacedDate),orders[orderIndex].products[productIndex].deliveryType);

        clickStatus.orderIndex = orderIndex,clickStatus.productIndex=productIndex,clickStatus.arrivalDate=arrivalDate;
        localStorage.setItem('clickStatus',JSON.stringify(clickStatus));
    });
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
