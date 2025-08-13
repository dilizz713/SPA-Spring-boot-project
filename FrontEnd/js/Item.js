$(document).ready(function () {
    let currentItemId = null;

    $('#item-update').prop('disabled', true);

    function handleApiError(xhr){
        const $alert = $('#errorAlertInItem');
        $alert.removeClass('d-none').empty();

        if (xhr.responseJSON){
            const apiResponse = xhr.responseJSON;
            const msg = $('<string>').text(apiResponse.message || 'An error occurred');
            $alert.append(msg);

            if (apiResponse.data && typeof apiResponse.data === 'object') {
                const list = $('<ul class="mt-2 mb-0">');
                for(const key in apiResponse.data){
                    const item = $('<li>').text(`${key}: ${apiResponse.data[key]}`);
                    list.append(item)
                }
                $alert.append(list);

            }
        }else{
            $alert.text('Unexpected error occurred.Please try again!');
        }

    }

    function clearError(){
        $('#errorAlertInItem').addClass('d-none').empty();
    }


    //Get all items
    function loadTableData(){
        $.ajax({
            url:'http://localhost:8080/api/v1/item/getAllItems',
            method: 'GET',
            dataType: 'json',
            success: function (response) {
                const tbody = $('#item-tbody');
                tbody.empty();

                if (response.data && response.data.length > 0) {
                    response.data.forEach(item => {
                        const row = `
                            <tr data-id="${item.id}">
                                <td>${item.itemName}</td>
                                <td>${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>${item.description}</td>
                                 <td class="text-center">
                                    <button class="btn btn-sm btn-primary edit-btn" title="Edit"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-sm btn-danger delete-btn" title="Delete"><i class="bi bi-trash"></i></button>
                                </td>
                                
                            </tr>
                        `;
                        tbody.append(row);
                    });

                }else{
                    tbody.append('<tr><td colspan="6">No items found</td></tr>')
                }
            },
            error:function(xhr , status, error) {
                console.error('Error loading items :', status, error);
                $('#item-tbody').html(
                    '<tr><td colspan="6" class="text-danger">Failed to load items</td></tr>'
                )
            }
        })
    }

    //Save item
    $('#item-save').on('click', function (){
        const itemsData = {
            itemName: $('#item-name').val(),
            price: $('#price').val(),
            quantity: $('#qty').val(),
            description: $('#desc').val()

        };

        $.ajax({
            url:'http://localhost:8080/api/v1/item/saveItem',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(itemsData),
            success: function (response) {
                clearError();
                alert(response.message || 'Item saved successfully');
                $('#item-form')[0].reset();
                loadTableData();
            },
            error: function (xhr, status, error) {
                console.error('Error saving items :', status, error);
                handleApiError(xhr);
            }
        });

    });

    //Update item
    $('#item-update').on('click', function (){
        if (!currentItemId){
            alert('Please select an item to update!');
            return;
        }

        const itemsData = {
            id: currentItemId,
            itemName: $('#item-name').val(),
            price: $('#price').val(),
            quantity: $('#qty').val(),
            description: $('#desc').val()

        };
        $.ajax({
            url:'http://localhost:8080/api/v1/item/updateItem',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(itemsData),
            success: function (response) {
                clearError();
                alert(response.message || 'Item updated successfully');
                $('#item-form')[0].reset();
                currentItemId = null;
                loadTableData();
            },
            error: function (xhr, status, error) {
                console.error('Error updating items :', status, error);
                handleApiError(xhr);
            }
        });
    });

    //Edit button
    $('#item-tbody').on('click', '.edit-btn', function (){
        const row = $(this).closest('tr');
        currentItemId = row.data('id');
        $('#item-name').val(row.find('td:eq(0)').text());
        $('#price').val(row.find('td:eq(1)').text());
        $('#qty').val(row.find('td:eq(2)').text());
        $('#desc').val(row.find('td:eq(3)').text());

        $('#item-save').prop('disabled', true);
        $('#item-update').prop('disabled', false);

    });

    //Delete item
    $('#item-tbody').on('click', '.delete-btn', function (){
        const row = $(this).closest('tr');
        const itemId = row.data('id');

        if (confirm('Are you sure you want to delete?')) {
            $.ajax({
                url:`http://localhost:8080/api/v1/item/deleteItem/${itemId}`,
                method: 'DELETE',
                success: function (response) {
                    alert(response.message || 'Item deleted successfully');
                    loadTableData();
                },
                error: function (xhr, status, error) {
                    console.error('Error deleting items :', status, error);
                    handleApiError(xhr);
                }
            });
        }
    });

    $('#item-reset').on('click', function() {
        $('#item-form')[0].reset();
        $('#item-form').data('selectedId', null);

        clearError();

        $('#item-save').prop('disabled', false);
        $('#customer-update').prop('disabled', true);
    });

    loadTableData();
})