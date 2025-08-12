package lk.ijse.gdse71.backend.service.impl;

import lk.ijse.gdse71.backend.dto.ItemDTO;
import lk.ijse.gdse71.backend.entiity.Item;
import lk.ijse.gdse71.backend.exception.ResourceAlreadyExists;
import lk.ijse.gdse71.backend.exception.ResourceNotFoundException;
import lk.ijse.gdse71.backend.repository.ItemRepository;
import lk.ijse.gdse71.backend.service.ItemService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ItemServiceImpl implements ItemService {
    private final ItemRepository itemRepository;
    private final ModelMapper modelMapper;

    @Override
    public void save(ItemDTO itemDTO) {
        Item item = itemRepository.findByItemName(itemDTO.getItemName());
        if(item == null){
            itemRepository.save(modelMapper.map(itemDTO, Item.class));
        }else{
            throw new ResourceAlreadyExists("This item already exists");
        }
    }

    @Override
    public void update(ItemDTO itemDTO) {
        Optional<Item> item = itemRepository.findById(itemDTO.getId());
        if(item.isPresent()){
            Item existingItem = item.get();
            existingItem.setItemName(itemDTO.getItemName());
            existingItem.setPrice(itemDTO.getPrice());
            existingItem.setQuantity(itemDTO.getQuantity());
            existingItem.setDescription(itemDTO.getDescription());

            itemRepository.save(existingItem);

        }else {
            throw new ResourceNotFoundException("This item does not exist");
        }
    }

    @Override
    public void delete(Integer id) {
        Optional<Item> item = itemRepository.findById(id);
        if(item.isPresent()){
            itemRepository.deleteById(id);
        }else {
            throw new ResourceNotFoundException("This item does not exist");
        }
    }

    @Override
    public List<ItemDTO> getAll() {
        List<Item> items = itemRepository.findAll();
        if(items.isEmpty()){
            throw new ResourceNotFoundException("This item does not exist");
        }else{
            return modelMapper.map(items, new TypeToken<List<ItemDTO>>(){}.getType());
        }
    }
}
