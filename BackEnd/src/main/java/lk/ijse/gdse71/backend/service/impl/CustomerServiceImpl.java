package lk.ijse.gdse71.backend.service.impl;

import lk.ijse.gdse71.backend.dto.CustomerDTO;
import lk.ijse.gdse71.backend.entiity.Customer;
import lk.ijse.gdse71.backend.exception.ResourceNotFoundException;
import lk.ijse.gdse71.backend.repository.CustomerRepository;
import lk.ijse.gdse71.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    @Override
    public void updateCustomer(CustomerDTO customerDTO) {
        Optional<Customer> customer = customerRepository.findById(customerDTO.getId());
        if (customer.isPresent()) {
            Customer existingCustomer = customer.get();
            existingCustomer.setName(customerDTO.getName());
            existingCustomer.setAddress(customerDTO.getAddress());
            existingCustomer.setNic(customerDTO.getNic());
            existingCustomer.setPhone(customerDTO.getPhone());
            existingCustomer.setEmail(customerDTO.getEmail());

            customerRepository.save(existingCustomer);
        }else{
            throw new ResourceNotFoundException("This Customer does not exist.");
        }
    }
}
