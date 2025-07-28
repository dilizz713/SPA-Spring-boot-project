package lk.ijse.gdse71.backend.service;

import lk.ijse.gdse71.backend.dto.CustomerDTO;

import java.util.List;

public interface CustomerService {
    void saveCustomer(CustomerDTO customerDTO);

    void updateCustomer(CustomerDTO customerDTO);

    void deleteCustomer(Integer id);

    List<CustomerDTO> getAllCustomers();
}
