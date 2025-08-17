package lk.ijse.gdse71.backend.repository;

import lk.ijse.gdse71.backend.entiity.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Integer> {
    @Query("SELECT COUNT(o) FROM Orders o WHERE o.date BETWEEN :start AND :end")
    Long countOrdersByDateRange(@Param("start") Date start, @Param("end") Date end);
}
