package lk.ijse.gdse71.backend.service.impl;

import lk.ijse.gdse71.backend.dto.CustomerDTO;
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

    }
}
