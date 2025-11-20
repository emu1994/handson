package com.example.transferscheduler.repository;

import com.example.transferscheduler.entity.TransferOrder;
import com.example.transferscheduler.entity.TransferStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TransferOrderRepository extends JpaRepository<TransferOrder, Long> {
    List<TransferOrder> findByStatusOrderByScheduledDateAsc(TransferStatus status);
    List<TransferOrder> findAllByOrderByScheduledDateAsc();
}
