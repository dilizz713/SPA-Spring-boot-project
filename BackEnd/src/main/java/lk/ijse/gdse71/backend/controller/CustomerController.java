package lk.ijse.gdse71.backend.controller;

import lk.ijse.gdse71.backend.dto.CustomerDTO;
import lk.ijse.gdse71.backend.entiity.Customer;
import lk.ijse.gdse71.backend.service.CustomerService;
import lk.ijse.gdse71.backend.util.APIResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("api/v1/customer")
@RestController
@RequiredArgsConstructor
@CrossOrigin
@Slf4j
public class CustomerController {

    private final CustomerService customerService;

    @PostMapping("saveCustomer")
    public ResponseEntity<APIResponse> saveCustomer(@RequestBody CustomerDTO customerDTO) {
        customerService.saveCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse(201,"Customer Saved Successfully" , true), HttpStatus.CREATED);
    }

    @PutMapping("updateCustomer")
    public ResponseEntity<APIResponse> updateCustomer(@RequestBody CustomerDTO customerDTO) {
        customerService.updateCustomer(customerDTO);
        return new ResponseEntity<>(new APIResponse(200,"Customer Updated Successfully" , true), HttpStatus.OK);
    }

    @DeleteMapping("deleteCustomer/{id}")
    public ResponseEntity<APIResponse> deleteCustomer(@PathVariable Integer id) {
        customerService.deleteCustomer(id);
        return new ResponseEntity<>(new APIResponse(200,"Customer Deleted Successfully" , true), HttpStatus.OK);
    }

    @GetMapping("getAllCustomers")
    public ResponseEntity<APIResponse> getAllCustomers() {
        List<CustomerDTO> customerDTOS = customerService.getAllCustomers();
        return new ResponseEntity<>(new APIResponse(200,"Customer List  Successfully" , customerDTOS), HttpStatus.OK);
    }

    @GetMapping("customerCount")
    public ResponseEntity<APIResponse> getTotalCustomers() {
        Long totalCustomers = customerService.getTotalCustomersCount();
        return new ResponseEntity<>(new APIResponse(200,"Customer Count Get  Successfully" , totalCustomers), HttpStatus.OK);
    }

    @GetMapping("search/{keyword}")
    public ResponseEntity<APIResponse> searchCustomer(@PathVariable("keyword") String keyword){
        List<CustomerDTO> customerDTOS =  customerService.getAllCustomersByKeyword(keyword);
        return ResponseEntity.ok(new APIResponse(200,"Search Successfully",customerDTOS));
    }


}
