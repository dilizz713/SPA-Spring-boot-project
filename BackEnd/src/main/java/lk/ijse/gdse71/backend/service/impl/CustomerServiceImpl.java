package lk.ijse.gdse71.backend.service.impl;

import lk.ijse.gdse71.backend.dto.CustomerDTO;
import lk.ijse.gdse71.backend.entiity.Customer;
import lk.ijse.gdse71.backend.exception.ResourceNotFoundException;
import lk.ijse.gdse71.backend.repository.CustomerRepository;
import lk.ijse.gdse71.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    private final CustomerRepository customerRepository;
    private final ModelMapper modelMapper;


    @Override
    public void saveCustomer(CustomerDTO customerDTO) {
        Customer customer = customerRepository.findByNic(customerDTO.getNic());
        if (customer == null) {
            customerRepository.save(modelMapper.map(customerDTO, Customer.class));
        }else{
            throw new ResourceNotFoundException("This Customer already exists.");
        }
    }
}
