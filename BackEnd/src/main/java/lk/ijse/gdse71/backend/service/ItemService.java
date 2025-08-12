package lk.ijse.gdse71.backend.service;


import lk.ijse.gdse71.backend.dto.ItemDTO;

import java.util.List;

public interface ItemService {
    void save(ItemDTO itemDTO);

    void update(ItemDTO itemDTO);

    void delete(Integer id);

    List<ItemDTO> getAll();
}
