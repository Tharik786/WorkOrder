package com.zan.workorder.controller;

import com.zan.workorder.repository.WorkOrderRepository;
import com.zan.workorder.model.WorkOrderStatus;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins="*")
public class DashboardController {
    private final WorkOrderRepository repo;
    public DashboardController(WorkOrderRepository repo){this.repo=repo;}

    @GetMapping
    public Map<String,Object> stats(){
        List<com.zan.workorder.model.WorkOrder> all=repo.findAll();
        Map<String,Object> m=new LinkedHashMap<>();
        m.put("total",all.size());
        m.put("open",repo.findByStatus(WorkOrderStatus.OPEN).size());
        m.put("assigned",repo.findByStatus(WorkOrderStatus.ASSIGNED).size());
        m.put("inProgress",repo.findByStatus(WorkOrderStatus.IN_PROGRESS).size());
        m.put("pending",repo.findByStatus(WorkOrderStatus.PENDING).size());
        m.put("completed",repo.findByStatus(WorkOrderStatus.COMPLETED).size());
        return m;
    }
}
