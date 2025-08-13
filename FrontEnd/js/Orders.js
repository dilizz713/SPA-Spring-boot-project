$(document).ready(function () {
    let orderItems = [];
    let totalAmount = 0;

   //load customers
    function loadCustomers() {
        $.get('http://localhost:8080/api/v1/customer/getAllCustomers', function (response) {
            const customerSelect = $('#order-content select').eq(0);
            customerSelect.empty().append('<option selected disabled>Select Customer</option>');
            if (response.data) {
                response.data.forEach(cust => {
                    customerSelect.append(`<option value="${cust.id}">${cust.name}</option>`);
                });
            }
        });
    }

    //load items
    function loadItems() {
        $.get('http://localhost:8080/api/v1/item/getAllItems', function (response) {
            const itemSelect = $('#order-content select').eq(1);
            itemSelect.empty().append('<option selected disabled>Select Item</option>');
            if (response.data) {
                response.data.forEach(item => {
                    itemSelect.append(`<option value="${item.id}" data-price="${item.price}">${item.itemName}</option>`);
                });
            }
        });
    }

    // add items to order table
    $('#add-order').on('click', function () {
        const customerId = $('#order-content select').eq(0).val();
        const itemSelect = $('#order-content select').eq(1);
        const itemId = itemSelect.val();
        const itemName = itemSelect.find('option:selected').text();
        const price = parseFloat(itemSelect.find('option:selected').data('price'));
        const qty = parseInt($('#quantity').val());

        if (!customerId) {
            alert("Please select a customer.");
            return;
        }
        if (!itemId || !qty || qty <= 0) {
            alert("Please select an item and enter valid quantity.");
            return;
        }

        const total = price * qty;
        totalAmount += total;

        orderItems.push({
            itemId: itemId,
            qtyOnHand: qty
        });

        $('#order-tbody').append(`
            <tr>
            
                <td>${itemName}</td>
                <td>${qty}</td>
                <td>${price.toFixed(2)}</td>
                <td>${total.toFixed(2)}</td>
            </tr>
        `);

        $('#total-amount').text(totalAmount.toFixed(2));
        $('#quantity').val('');

    });

    //place order
    $('#place-order').on('click', function () {
        const customerId = $('#order-content select').eq(0).val();

        if (!customerId) {
            alert("Please select a customer.");
            return;
        }
        if (orderItems.length === 0) {
            alert("Please add at least one item to the order.");
            return;
        }

        const orderData = {
            customerId: customerId,
            orderDetails: orderItems
        };

        $.ajax({
            url: 'http://localhost:8080/api/v1/orders/placeOrder',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(orderData),
            success: function (response) {
                alert(response.message || "Order placed successfully.");
                resetOrderForm();
            },
            error: function (xhr) {
                console.error(xhr);
                alert("Error placing order.");
            }
        });
    });

   //reset order form
    function resetOrderForm() {
        orderItems = [];
        totalAmount = 0;
        $('#order-tbody').empty();
        $('#total-amount').text("Amount");
        $('#order-content select').val('');
        $('#quantity').val('');
        $('#description').val('');
    }

    $('#reset-order').on('click', resetOrderForm);

    loadCustomers();
    loadItems();
});
