package com.zan.workorder.repository;
import com.zan.workorder.model.WorkOrder;
import com.zan.workorder.model.WorkOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    List<WorkOrder> findByStatus(WorkOrderStatus status);
    List<WorkOrder> findByPriority(com.zan.workorder.model.Priority priority);
}
