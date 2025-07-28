package lk.ijse.gdse71.backend.repository;

import lk.ijse.gdse71.backend.entiity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    Customer findByNic(String nic);
}
