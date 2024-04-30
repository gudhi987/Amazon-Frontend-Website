// Managing cart 

const cart= JSON.parse(localStorage.getItem('cart')) || {
    totalQuantity : 0,
    items : []
};

let deliveryType=JSON.parse(localStorage.getItem('deliveryTypes')) || [];

// Orders

const orders= JSON.parse(localStorage.getItem('orders')) || [];

// order = {
//     orderId : 'xxxxxxxxxxxxxxxx',
//     orderPlacedDate: 'DDMMYYYY',
//     totalValue: '$22.98',
//     products: [{
//         product : product,
//         quantity : quantity,
//         deliveryType : 1
//     }]
// };

const days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const months=[ "January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];


const typeToDaysofDelivery = {
    1 : 7,
    2: 4,
    3: 2
};

const clickStatus = JSON.parse(localStorage.getItem('clickStatus')) || {
    orderIndex : -1,
    productIndex : -1,
    orderPlacedDate: '',
    arrivalDate : '',
};