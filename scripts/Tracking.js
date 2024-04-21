function updateCartItems()
{
    document.querySelector('.ele-count').innerHTML=`${cart.totalQuantity}`;
    if(document.querySelector('.container').innerHTML)
    {
        document.querySelector('.container > h4:nth-child(2) > span').innerHTML=` ${cart.totalQuantity} `;
    }
}
updateCartItems();

function renderTrackingHTML()
{
    const myObj=JSON.parse(localStorage.getItem('clickStatus'));
    // console.log(myObj);
    const orderIndex=myObj.orderIndex,productIndex=myObj.productIndex,orderPlacedDate=new Date(myObj.orderPlacedDate),arrivalDate=new Date(myObj.arrivalDate);
    // console.log(arrivalDate,orderPlacedDate);
    let timeForDelivery=((arrivalDate)-(orderPlacedDate))/(1000*60*60*24);
    // console.log('Gap between arrival and order placed: ',timeForDelivery);

    const currTime=new Date();
    let diffDays=(arrivalDate-currTime)/(1000*60*60*24);
    // console.log('Gap between arrival and Curr Time: ',diffDays);

    let widthPercentage=Math.min(Math.max(5,((timeForDelivery-diffDays)/timeForDelivery)*100),100);

    console.log(widthPercentage);

    if(widthPercentage==100)
    {
        document.querySelector('.progress-bar > h3:nth-child(2)').classList.add('progress-stepper');
        document.querySelector('.progress-bar > h3:nth-child(3)').classList.add('progress-stepper');
    }

    if(widthPercentage>=50)
    {
        document.querySelector('.progress-bar > h3:nth-child(2)').classList.add('progress-stepper');
    }

    document.querySelector('.arrival-date').innerHTML = `Arriving on ${days[arrivalDate.getDay()]}, ${months[arrivalDate.getMonth()]} ${arrivalDate.getDate()}`;
    document.querySelector('.product-name').innerHTML = `${orders[orderIndex].products[productIndex].product.name}`;
    document.querySelector('.product-quantity').innerHTML = `Quantity: ${orders[orderIndex].products[productIndex].quantity}`;
    document.querySelector('.product-image').src = `${orders[orderIndex].products[productIndex].product.image}`;
    document.querySelector('.progress-indicator').style.width=`${widthPercentage}%`;

    if(widthPercentage==100)
    {
        document.querySelector('.arrival-date').innerHTML = `Delivered on ${days[arrivalDate.getDay()]}, ${months[arrivalDate.getMonth()]} ${arrivalDate.getDate()}`;
    }
}
renderTrackingHTML();


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