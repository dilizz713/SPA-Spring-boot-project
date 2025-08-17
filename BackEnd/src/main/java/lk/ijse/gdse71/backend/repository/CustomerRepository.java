package lk.ijse.gdse71.backend.repository;

import lk.ijse.gdse71.backend.entiity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByNic(String nic);



    List<Customer> findByNicContainingIgnoreCaseOrNameContainingIgnoreCaseOrEmailContainingIgnoreCase(String nic, String name, String email);
}
