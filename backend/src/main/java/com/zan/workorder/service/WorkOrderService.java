package com.zan.workorder.service;

import com.zan.workorder.model.*;
import com.zan.workorder.repository.WorkOrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkOrderService {
    private final WorkOrderRepository repo;
    public WorkOrderService(WorkOrderRepository repo){this.repo=repo;}

    public List<WorkOrder> all(){return repo.findAll();}
    public WorkOrder get(Long id){return repo.findById(id).orElseThrow();}
    public WorkOrder create(WorkOrder w){return repo.save(w);}
    public WorkOrder update(Long id, WorkOrder incoming){
        WorkOrder w=get(id);
        w.setTitle(incoming.getTitle()); 
        w.setDescription(incoming.getDescription());
        w.setClientName(incoming.getClientName()); 
        w.setBuildingName(incoming.getBuildingName());
        w.setFloorName(incoming.getFloorName());
        w.setAreaName(incoming.getAreaName());
        w.setDeviceName(incoming.getDeviceName());
        w.setDeviceType(incoming.getDeviceType());
        w.setDeviceMacId(incoming.getDeviceMacId()); 
        w.setPriority(incoming.getPriority());
        w.setStatus(incoming.getStatus()); 
        w.setAssignedTo(incoming.getAssignedTo());
        w.setCreatedBy(incoming.getCreatedBy());
        if (incoming.getLastReportedTime() != null) {
            w.setLastReportedTime(incoming.getLastReportedTime());
        }
        if (incoming.getCreatedTime() != null && w.getCreatedTime() == null) {
            w.setCreatedTime(incoming.getCreatedTime());
        }
        if(w.getStatus()==WorkOrderStatus.COMPLETED && w.getCompletedAt()==null) w.setCompletedAt(LocalDateTime.now());
        if(w.getStatus()!=WorkOrderStatus.COMPLETED) w.setCompletedAt(null);
        return repo.save(w);
    }
    public void delete(Long id){repo.deleteById(id);}
    public List<WorkOrder> byStatus(WorkOrderStatus s){return repo.findByStatus(s);}
    public List<WorkOrder> byPriority(Priority p){return repo.findByPriority(p);}
}
