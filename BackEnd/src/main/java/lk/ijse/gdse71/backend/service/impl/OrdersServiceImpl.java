package lk.ijse.gdse71.backend.service.impl;

import jakarta.transaction.Transactional;
import lk.ijse.gdse71.backend.dto.OrderDetailsDTO;
import lk.ijse.gdse71.backend.dto.OrdersDTO;
import lk.ijse.gdse71.backend.entiity.Customer;
import lk.ijse.gdse71.backend.entiity.Item;
import lk.ijse.gdse71.backend.entiity.OrderDetails;
import lk.ijse.gdse71.backend.entiity.Orders;
import lk.ijse.gdse71.backend.exception.ResourceNotFoundException;
import lk.ijse.gdse71.backend.repository.CustomerRepository;
import lk.ijse.gdse71.backend.repository.ItemRepository;
import lk.ijse.gdse71.backend.repository.OrdersRepository;
import lk.ijse.gdse71.backend.service.OrdersService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Service
@RequiredArgsConstructor
public class OrdersServiceImpl implements OrdersService {
    private final CustomerRepository customerRepository;
    private final OrdersRepository ordersRepository;
    private final ItemRepository itemRepository;

    @Override
    @Transactional
    public void placeOrder(OrdersDTO orderDTO) {
       Customer customer = customerRepository.findById(orderDTO.getCustomerId())
               .orElseThrow(()-> new ResourceNotFoundException("Customer not found"));

       Orders order = new Orders();
       order.setDate(new Date());
       order.setCustomer(customer);

        List<OrderDetails> orderDetails = new ArrayList<>();
        double totalAmount = 0.0;

        // checking stock
        for(OrderDetailsDTO orderDetailsDTO: orderDTO.getOrderDetails()){
            Item item = itemRepository.findById(orderDetailsDTO.getItemId())
                    .orElseThrow(()-> new ResourceNotFoundException("Item not found"));

            int newQty = item.getQuantity() - orderDetailsDTO.getQtyOnHand();
            if(newQty < 0){
                throw new RuntimeException("Not enough qty" + item.getItemName());

            }
            item.setQuantity(newQty);
            itemRepository.save(item);

            // total amount calculation
            double total = item.getPrice() * orderDetailsDTO.getQtyOnHand();
            totalAmount += total;


            OrderDetails orderDetail = new OrderDetails();
            orderDetail.setQtyOnHand(orderDetailsDTO.getQtyOnHand());
            orderDetail.setPrice(item.getPrice());
            orderDetail.setItem(item);
            orderDetail.setOrder(order);

            orderDetails.add(orderDetail);
        }
        order.setOrderDetails(orderDetails);
        order.setTotalAmount(totalAmount);
        ordersRepository.save(order);
    }
}
