package lk.ijse.gdse71.backend.repository;

import lk.ijse.gdse71.backend.entiity.Item;
import org.hibernate.type.descriptor.converter.spi.JpaAttributeConverter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ItemRepository extends JpaRepository<Item, Integer> {
    Item findByItemName(String itemName);
}
