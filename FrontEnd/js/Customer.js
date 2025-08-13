$(document).ready(function () {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });
    $('#todayDate').text(formattedDate);

    let currentCustomerId = null; // Track which customer is being edited

    function handleApiError(xhr){
        const $alert = $('#errorAlert');
        $alert.removeClass('d-none').empty();

        if (xhr.responseJSON){
            const apiResponse = xhr.responseJSON;
            const msg = $('<strong>').text(apiResponse.message || 'An error occurred.');
            $alert.append(msg);

            if (apiResponse.data && typeof apiResponse.data === 'object') {
                const list = $('<ul class="mt-2 mb-0">');
                for (const key in apiResponse.data) {
                    const item = $('<li>').text(`${key}: ${apiResponse.data[key]}`);
                    list.append(item);
                }
                $alert.append(list);
            }
        } else {
            $alert.text('Unexpected error occurred. Please try again!');
        }
    }

    function clearError() {
        $('#errorAlert').addClass('d-none').empty();
    }

    function loadTableData() {
        $.ajax({
            url: 'http://localhost:8080/api/v1/customer/getAllCustomers',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                const tbody = $('#customer-tbody');
                tbody.empty();

                if (response.data && response.data.length > 0) {
                    response.data.forEach(customer => {
                        const row = `
                            <tr data-id="${customer.id}">
                                <td>${customer.name}</td>
                                <td>${customer.address}</td>
                                <td>${customer.nic}</td>
                                <td>${customer.phone}</td>
                                <td>${customer.email}</td>
                                <td class="text-center">
                                    <button class="btn btn-sm btn-primary edit-btn" title="Edit"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-sm btn-danger delete-btn" title="Delete"><i class="bi bi-trash"></i></button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                } else {
                    tbody.append('<tr><td colspan="6">No customers found</td></tr>');
                }
            },
            error: function (xhr, status, error) {
                console.error('Error loading customers:', status, error);
                $('#customer-tbody').html(
                    '<tr><td colspan="6" class="text-danger">Failed to load customers</td></tr>'
                );
            }
        });
    }

    // Save Customer
    $('#customer-save').on('click', function (){
        const customerData = {
            name: $('#name').val(),
            address: $('#address').val(),
            nic: $('#nic').val(),
            phone: $('#mobile').val(),
            email: $('#email').val()
        };

        $.ajax({
            url:'http://localhost:8080/api/v1/customer/saveCustomer',
            method:'POST',
            contentType:'application/json',
            data:JSON.stringify(customerData),
            success:function(response){
                clearError();
                alert(response.message || 'Customer Saved Successfully!');
                $('#customerForm')[0].reset();
                loadTableData();
            },
            error:function(xhr, status, error){
                console.error('Error saving customer ', status, error);
                handleApiError(xhr);
            }
        });
    });

    // Update Customer
    $('#customer-update').on('click', function (){
        if (!currentCustomerId) {
            alert("Please select a customer to update!");
            return;
        }

        const customerData = {
            id: currentCustomerId,
            name: $('#name').val(),
            address: $('#address').val(),
            nic: $('#nic').val(),
            phone: $('#mobile').val(),
            email: $('#email').val()
        };

        $.ajax({
            url:'http://localhost:8080/api/v1/customer/updateCustomer',
            method:'PUT',
            contentType:'application/json',
            data:JSON.stringify(customerData),
            success:function(response){
                clearError();
                alert(response.message || 'Customer Updated Successfully!');
                $('#customerForm')[0].reset();
                currentCustomerId = null;
                loadTableData();
            },
            error:function(xhr, status, error){
                console.error('Error updating customer ',  error);
                handleApiError(xhr);
            }
        });
    });

    // Edit Button
    $('#customer-tbody').on('click', '.edit-btn', function (){
        const row = $(this).closest('tr');
        currentCustomerId = row.data('id');
        $('#name').val(row.find('td:eq(0)').text());
        $('#address').val(row.find('td:eq(1)').text());
        $('#nic').val(row.find('td:eq(2)').text());
        $('#mobile').val(row.find('td:eq(3)').text());
        $('#email').val(row.find('td:eq(4)').text());
    });

    // Delete Button
    $('#customer-tbody').on('click', '.delete-btn', function (){
        const row = $(this).closest('tr');
        const customerId = row.data('id');

        if (confirm('Are you sure you want to delete this customer?')) {
            $.ajax({
                url: `http://localhost:8080/api/v1/customer/deleteCustomer/${customerId}`,
                method: 'DELETE',
                success: function(response) {
                    alert(response.message || 'Customer Deleted Successfully!');
                    loadTableData();
                },
                error: function(xhr, status, error) {
                    console.error('Error deleting customer:', error);
                    handleApiError(xhr);
                }
            });
        }
    });

    $('#customer-reset').on('click', function() {
        $('#customerForm')[0].reset();
        $('#customerForm').data('selectedId', null);

        clearError();

        $('#customer-save').prop('disabled', false);
    });

    loadTableData();
});
