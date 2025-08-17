
const API_BASE = "http://localhost:8080/api/v1";
const AUTH_BASE = `${API_BASE}/auth`;


$.ajaxSetup({
    xhrFields: { withCredentials: true },
    contentType: "application/json"
});

/* ------------------------------ Utilities ------------------------------ */

function swalInfo(title, text) {
    if (window.Swal) Swal.fire(title, text, "info"); else alert(text || title);
}
function swalSuccess(title, text) {
    if (window.Swal) Swal.fire(title, text, "success"); else alert(text || title);
}
function swalError(title, text) {
    if (window.Swal) Swal.fire(title, text, "error"); else alert(text || title);
}

function redirectToLogin() {
    swalInfo("Not logged in", "Redirecting to sign in...");
    setTimeout(() => (window.location.href = "index.html"), 900);
}

async function validateSession() {
    try {
        const res = await $.ajax({ url: `${AUTH_BASE}/validate`, method: "GET" });
        const d = res?.data;
        if (d?.userName && d?.role) return { isAuthenticated: true, userName: d.userName, role: d.role };
    } catch (_) {}
    return { isAuthenticated: false };
}

$(function () {
    const role = sessionStorage.getItem("role");
    if (role === "CASHIER") {
        $("#nav-add-user").hide();
    }
});

function handleApiError($alertId, xhr, fallback = "An error occurred.") {
    const $alert = $($alertId);
    $alert.removeClass("d-none").empty();

    if (xhr?.status === 401 || xhr?.status === 403) {
        swalInfo("Session expired", "Please sign in again.");
        setTimeout(() => redirectToLogin(), 800);
        return;
    }

    if (xhr?.responseJSON) {
        const apiResponse = xhr.responseJSON;
        const msg = $("<strong>").text(apiResponse.message || fallback);
        $alert.append(msg);

        if (apiResponse.data && typeof apiResponse.data === "object") {
            const list = $('<ul class="mt-2 mb-0">');
            for (const key in apiResponse.data) {
                const item = $("<li>").text(`${key}: ${apiResponse.data[key]}`);
                list.append(item);
            }
            $alert.append(list);
        }
    } else {
        $alert.text(fallback);
    }
}

function clearError($alertId) {
    $($alertId).addClass("d-none").empty();
}

/* ------------------------------ Auth Guard & Header ------------------------------ */

$(async function () {
    const session = await validateSession();
    if (!session.isAuthenticated) {
        redirectToLogin();
        return;
    }

    const username = session.userName;
    const role = (session.role || "").toUpperCase();

    sessionStorage.setItem("username", username);
    sessionStorage.setItem("role", role);

    $(".welcome").text(`Welcome, ${username}`);
    $(".role").text(role);


    if (role !== "ADMIN") {
        const $settings = $("#settingsIcon, .icon-settings").closest("a,button,li");
        $settings
            .addClass("disabled")
            .attr("aria-disabled", "true")
            .css({pointerEvents: "none", opacity: 0.5, cursor: "not-allowed"})
            .attr("title", "Settings are restricted to ADMIN");
    }

    /* ------------------------------ Home Page ------------------------------ */


    function loadHomePageData () {
        $.ajax({
            url: "http://localhost:8080/api/v1/customer/customerCount",
            method: "GET",
            success: function(response) {
                $("#total-customers").text(response.data);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching total customers:", xhr.responseText);
            }
        });

        $.ajax({
            url: "http://localhost:8080/api/v1/orders/getTodayOrdersCount",
            method: "GET",
            success: function(response) {
                $("#today-orders").text(response.data);
            },
            error: function(xhr, status, error) {
                console.error("Error fetching today's orders:", xhr.responseText);
            }
        });
    }


    const today = new Date();
    const formattedDate = today.toLocaleDateString("en-GB", {day: "2-digit", month: "2-digit", year: "numeric"});
    $("#todayDate").text(formattedDate);




    /* ------------------------------ Logout ------------------------------ */
    $("#logout-btn").on("click", async () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, Logout",
            cancelButtonText: "No, Stay here"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await logout();
                } catch (err) {
                    console.warn("Server logout failed, but forcing client logout anyway:", err);
                } finally {
                    sessionStorage.clear();
                    window.location.replace("index.html");
                }
            }
        });
    });

    /* ------------------------------ Customers ------------------------------ */

    let currentCustomerId = null;
    $("#customer-update").prop("disabled", true);

    function loadCustomerTableData() {
        $.ajax({
            url: `${API_BASE}/customer/getAllCustomers`,
            method: "GET",
            dataType: "json",
            success: function (response) {
                const tbody = $("#customer-tbody");
                tbody.empty();

                const list = response?.data || [];
                if (list.length > 0) {
                    list.forEach((customer) => {
                        const row = `
              <tr data-id="${customer.id}">
                <td>${customer.name ?? ""}</td>
                <td>${customer.address ?? ""}</td>
                <td>${customer.nic ?? ""}</td>
                <td>${customer.phone ?? ""}</td>
                <td>${customer.email ?? ""}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-primary edit-btn" title="Edit"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-sm btn-danger delete-btn" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
              </tr>`;
                        tbody.append(row);
                    });
                } else {
                    tbody.append('<tr><td colspan="6" class="text-center text-muted">No customers found</td></tr>');
                }
            },
            error: function (xhr) {
                console.error("Error loading customers:", xhr);
                $("#customer-tbody").html('<tr><td colspan="6" class="text-danger">Failed to load customers</td></tr>');
            }
        });
    }

    $("#customer-save").on("click", function () {
        const customerData = {
            name: $("#name").val(),
            address: $("#address").val(),
            nic: $("#nic").val(),
            phone: $("#mobile").val(),
            email: $("#email").val()
        };

        $.ajax({
            url: `${API_BASE}/customer/saveCustomer`,
            method: "POST",
            data: JSON.stringify(customerData),
            success: function (response) {
                clearError("#errorAlert");
                swalSuccess("Saved", response.message || "Customer saved successfully!");
                $("#customerForm")[0].reset();
                loadCustomerTableData();
            },
            error: function (xhr) {
                console.error("Error saving customer", xhr);
                handleApiError("#errorAlert", xhr, "Failed to save customer.");
            }
        });
    });

    $("#customer-update").on("click", function () {
        if (!currentCustomerId) {
            swalInfo("Select a customer", "Please select a customer to update!");
            return;
        }

        const customerData = {
            id: currentCustomerId,
            name: $("#name").val(),
            address: $("#address").val(),
            nic: $("#nic").val(),
            phone: $("#mobile").val(),
            email: $("#email").val()
        };

        $.ajax({
            url: `${API_BASE}/customer/updateCustomer`,
            method: "PUT",
            data: JSON.stringify(customerData),
            success: function (response) {
                clearError("#errorAlert");
                swalSuccess("Updated", response.message || "Customer updated successfully!");
                $("#customerForm")[0].reset();
                currentCustomerId = null;
                $("#customer-save").prop("disabled", false);
                $("#customer-update").prop("disabled", true);
                loadCustomerTableData();
            },
            error: function (xhr) {
                console.error("Error updating customer", xhr);
                handleApiError("#errorAlert", xhr, "Failed to update customer.");
            }
        });
    });

    $("#customer-tbody").on("click", ".edit-btn", function () {
        const row = $(this).closest("tr");
        currentCustomerId = row.data("id");
        $("#name").val(row.find("td:eq(0)").text());
        $("#address").val(row.find("td:eq(1)").text());
        $("#nic").val(row.find("td:eq(2)").text());
        $("#mobile").val(row.find("td:eq(3)").text());
        $("#email").val(row.find("td:eq(4)").text());

        $("#customer-save").prop("disabled", true);
        $("#customer-update").prop("disabled", false);
    });

    $("#customer-tbody").on("click", ".delete-btn", function () {
        const row = $(this).closest("tr");
        const customerId = row.data("id");

        const doDelete = () => {
            $.ajax({
                url: `${API_BASE}/customer/deleteCustomer/${customerId}`,
                method: "DELETE",
                success: function (response) {
                    swalSuccess("Deleted", response.message || "Customer deleted successfully!");
                    loadCustomerTableData();
                },
                error: function (xhr) {
                    console.error("Error deleting customer", xhr);
                    handleApiError("#errorAlert", xhr, "Failed to delete customer.");
                }
            });
        };

        if (window.Swal) {
            Swal.fire({
                title: "Delete customer?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete"
            }).then(r => r.isConfirmed && doDelete());
        } else if (confirm("Are you sure you want to delete this customer?")) {
            doDelete();
        }
    });

    $("#customer-reset").on("click", function () {
        $("#customerForm")[0].reset();
        currentCustomerId = null;
        clearError("#errorAlert");
        $("#customer-save").prop("disabled", false);
        $("#customer-update").prop("disabled", true);
    });

    loadCustomerTableData();

    /* ------------------------------ Items ------------------------------ */

    let currentItemId = null;
    $("#item-update").prop("disabled", true);

    function loadItemTableData() {
        $.ajax({
            url: `${API_BASE}/item/getAllItems`,
            method: "GET",
            dataType: "json",
            success: function (response) {
                const tbody = $("#item-tbody");
                tbody.empty();

                const list = response?.data || [];
                if (list.length > 0) {
                    list.forEach((item) => {
                        const row = `
              <tr data-id="${item.id}">
                <td>${item.itemName ?? ""}</td>
                <td>${item.price ?? ""}</td>
                <td>${item.quantity ?? ""}</td>
                <td>${item.description ?? ""}</td>
                <td class="text-center">
                  <button class="btn btn-sm btn-primary edit-btn" title="Edit"><i class="bi bi-pencil-square"></i></button>
                  <button class="btn btn-sm btn-danger delete-btn" title="Delete"><i class="bi bi-trash"></i></button>
                </td>
              </tr>`;
                        tbody.append(row);
                    });
                } else {
                    tbody.append('<tr><td colspan="5" class="text-center text-muted">No items found</td></tr>');
                }
            },
            error: function (xhr) {
                console.error("Error loading items:", xhr);
                $("#item-tbody").html('<tr><td colspan="5" class="text-danger">Failed to load items</td></tr>');
            }
        });
    }

    $("#item-save").on("click", function () {
        const itemsData = {
            itemName: $("#item-name").val(),
            price: $("#price").val(),
            quantity: $("#qty").val(),
            description: $("#desc").val()
        };

        $.ajax({
            url: `${API_BASE}/item/saveItem`,
            method: "POST",
            data: JSON.stringify(itemsData),
            success: function (response) {
                clearError("#errorAlertInItem");
                swalSuccess("Saved", response.message || "Item saved successfully!");
                $("#item-form")[0].reset();
                loadItemTableData();
            },
            error: function (xhr) {
                console.error("Error saving item:", xhr);
                handleApiError("#errorAlertInItem", xhr, "Failed to save item.");
            }
        });
    });

    $("#item-update").on("click", function () {
        if (!currentItemId) {
            swalInfo("Select an item", "Please select an item to update!");
            return;
        }

        const itemsData = {
            id: currentItemId,
            itemName: $("#item-name").val(),
            price: $("#price").val(),
            quantity: $("#qty").val(),
            description: $("#desc").val()
        };

        $.ajax({
            url: `${API_BASE}/item/updateItem`,
            method: "PUT",
            data: JSON.stringify(itemsData),
            success: function (response) {
                clearError("#errorAlertInItem");
                swalSuccess("Updated", response.message || "Item updated successfully!");
                $("#item-form")[0].reset();
                currentItemId = null;
                $("#item-save").prop("disabled", false);
                $("#item-update").prop("disabled", true);
                loadItemTableData();
            },
            error: function (xhr) {
                console.error("Error updating item:", xhr);
                handleApiError("#errorAlertInItem", xhr, "Failed to update item.");
            }
        });
    });

    $("#item-tbody").on("click", ".edit-btn", function () {
        const row = $(this).closest("tr");
        currentItemId = row.data("id");
        $("#item-name").val(row.find("td:eq(0)").text());
        $("#price").val(row.find("td:eq(1)").text());
        $("#qty").val(row.find("td:eq(2)").text());
        $("#desc").val(row.find("td:eq(3)").text());

        $("#item-save").prop("disabled", true);
        $("#item-update").prop("disabled", false);
    });

    $("#item-tbody").on("click", ".delete-btn", function () {
        const row = $(this).closest("tr");
        const itemId = row.data("id");

        const doDelete = () => {
            $.ajax({
                url: `${API_BASE}/item/deleteItem/${itemId}`,
                method: "DELETE",
                success: function (response) {
                    swalSuccess("Deleted", response.message || "Item deleted successfully!");
                    loadItemTableData();
                },
                error: function (xhr) {
                    console.error("Error deleting item:", xhr);
                    handleApiError("#errorAlertInItem", xhr, "Failed to delete item.");
                }
            });
        };

        if (window.Swal) {
            Swal.fire({
                title: "Delete item?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Delete"
            }).then(r => r.isConfirmed && doDelete());
        } else if (confirm("Are you sure you want to delete this item?")) {
            doDelete();
        }
    });

    $("#item-reset").on("click", function () {
        $("#item-form")[0].reset();
        currentItemId = null;
        clearError("#errorAlertInItem");
        $("#item-save").prop("disabled", false);
        $("#item-update").prop("disabled", true);
    });

    loadItemTableData();

    /* ------------------------------ Place Order ------------------------------ */

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

    // Add item
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

        const newItem = {
            itemId,
            itemName,
            qtyOnHand: qty,
            price
        };
        orderItems.push(newItem);

        renderOrderTable();
        $('#quantity').val('');
    });

    // Temp order table
    function renderOrderTable() {
        $('#order-tbody').empty();
        totalAmount = 0;
        orderItems.forEach((item, index) => {
            const total = item.price * item.qtyOnHand;
            totalAmount += total;
            $('#order-tbody').append(`
                <tr>
                    <td>${item.itemName}</td>
                    <td>${item.qtyOnHand}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${total.toFixed(2)}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-item" data-index="${index}">✏️</button>
                        <button class="btn btn-sm btn-danger delete-item" data-index="${index}">🗑️</button>
                    </td>
                </tr>
            `);
        });
        $('#total-amount').text(totalAmount.toFixed(2));
    }

    // Edit item
    $('#order-tbody').on('click', '.edit-item', function () {
        const index = $(this).data('index');
        const newQty = parseInt(prompt("Enter new quantity:", orderItems[index].qtyOnHand));
        if (newQty && newQty > 0) {
            orderItems[index].qtyOnHand = newQty;
            renderOrderTable();
        }
    });

    // Delete item
    $('#order-tbody').on('click', '.delete-item', function () {
        const index = $(this).data('index');
        if (confirm("Remove this item from order?")) {
            orderItems.splice(index, 1);
            renderOrderTable();
        }
    });

    // Place order
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

    function resetOrderForm() {
        orderItems = [];
        totalAmount = 0;
        $('#order-tbody').empty();
        $('#total-amount').text("Amount");
        $('#order-content select').val('');
        $('#quantity').val('');
    }

    $('#reset-order').on('click', resetOrderForm);


    /* ------------------------------ Orders History ------------------------------ */

    function loadOrderHistory() {
        $.ajax({
            url: "http://localhost:8080/api/v1/orders/getAllOrdersHistory",
            method: "GET",
            success: function (response) {

                // If you're using APIResponse wrapper
                let orders = response.data || response;

                let $tbody = $("#order-history-tbody");
                $tbody.empty();

                if (!orders || orders.length === 0) {
                    $tbody.append(`
                        <tr>
                            <td colspan="5" class="text-center text-muted">No orders found</td>
                        </tr>
                    `);
                    return;
                }

                $.each(orders, function (index, order) {
                    let totalAmount = (order.totalAmount != null)
                        ? parseFloat(order.totalAmount).toFixed(2)
                        : "0.00";

                    $tbody.append(`
                        <tr>
                            <td>${order.orderDate || ""}</td>   
                            <td>${order.customerId || ""}</td>
                            <td>${order.customerName || ""}</td>
                            <td>${totalAmount}</td>
                        </tr>
                    `);
                });
            },
            error: function (xhr, status, error) {
                console.error("Error loading order history:", error);
                $("#order-history-tbody").html(`
                    <tr>
                        <td colspan="5" class="text-danger text-center">Error loading data</td>
                    </tr>
                `);
            }
        });
    }

    $("#view-history").on("click", function () {
        loadOrderHistory();
        $("#order-content").hide();
        $("#order-history-content").show();
    });

    $(document).ready(function() {
        loadOrderHistory();
        setInterval(loadHomePageData, 1000);
        loadCustomers();
        loadItems();
    });

});

