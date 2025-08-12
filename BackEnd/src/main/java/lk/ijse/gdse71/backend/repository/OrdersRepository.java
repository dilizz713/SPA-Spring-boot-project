package lk.ijse.gdse71.backend.repository;

import lk.ijse.gdse71.backend.entiity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
}
