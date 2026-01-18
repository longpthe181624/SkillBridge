package com.skillbridge.service.contract;

import com.skillbridge.dto.contract.request.*;
import com.skillbridge.dto.contract.response.ProjectCloseRequestDetailDTO;
import com.skillbridge.dto.contract.response.ProjectCloseRequestResponse;
import com.skillbridge.entity.auth.User;
import com.skillbridge.entity.contract.*;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.repository.contract.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for ProjectCloseRequestService
 * Story-41: Project Close Request for SOW Contract
 */
@ExtendWith(MockitoExtension.class)
class ProjectCloseRequestServiceTest {

    @Mock
    private ProjectCloseRequestRepository projectCloseRequestRepository;

    @Mock
    private SOWContractRepository sowContractRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ContractHistoryRepository contractHistoryRepository;

    @InjectMocks
    private ProjectCloseRequestService projectCloseRequestService;

    private User salesRepUser;
    private User clientUser;
    private SOWContract activeSOW;
    private SOWContract inactiveSOW;
    private SOWContract futureEndDateSOW;

    @BeforeEach
    void setUp() {
        // Setup SalesRep user
        salesRepUser = new User();
        salesRepUser.setId(5);
        salesRepUser.setEmail("sales@example.com");
        salesRepUser.setFullName("Sale Man");
        salesRepUser.setRole("SALES_REP");

        // Setup Client user
        clientUser = new User();
        clientUser.setId(8);
        clientUser.setEmail("client@example.com");
        clientUser.setFullName("Client User");
        clientUser.setRole("CLIENT");

        // Setup Active SOW with end_date <= today
        activeSOW = new SOWContract();
        activeSOW.setId(53);
        activeSOW.setClientId(8);
        activeSOW.setContractName("SOW Contract - EC Rewamp");
        activeSOW.setStatus(SOWContract.SOWContractStatus.Active);
        activeSOW.setPeriodStart(LocalDate.of(2025, 12, 1));
        activeSOW.setPeriodEnd(LocalDate.of(2025, 12, 8)); // Today or past
        activeSOW.setProjectName("EC Rewamp");

        // Setup Inactive SOW
        inactiveSOW = new SOWContract();
        inactiveSOW.setId(54);
        inactiveSOW.setClientId(8);
        inactiveSOW.setStatus(SOWContract.SOWContractStatus.Draft);

        // Setup SOW with future end_date
        futureEndDateSOW = new SOWContract();
        futureEndDateSOW.setId(55);
        futureEndDateSOW.setClientId(8);
        futureEndDateSOW.setStatus(SOWContract.SOWContractStatus.Active);
        futureEndDateSOW.setPeriodEnd(LocalDate.now().plusDays(10)); // Future date
    }

    @Test
    @DisplayName("createCloseRequest - SOW not found → throw RuntimeException")
    void testCreateCloseRequest_SOWNotFound() {
        // Arrange
        Integer sowId = 999;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Test message");

        when(sowContractRepository.findById(sowId))
                .thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectCloseRequestService.createCloseRequest(sowId, request, salesRepUser);
        });

        assertEquals("SOW Contract not found", exception.getMessage());
        verify(projectCloseRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCloseRequest - SOW not Active → throw RuntimeException")
    void testCreateCloseRequest_SOWNotActive() {
        // Arrange
        Integer sowId = 54;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Test message");

        when(sowContractRepository.findById(sowId))
                .thenReturn(Optional.of(inactiveSOW));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectCloseRequestService.createCloseRequest(sowId, request, salesRepUser);
        });

        assertEquals("Close request can only be created for Active SOW contracts.", exception.getMessage());
        verify(projectCloseRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCloseRequest - end_date > today → throw RuntimeException")
    void testCreateCloseRequest_EndDateInFuture() {
        // Arrange
        Integer sowId = 55;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Test message");

        when(sowContractRepository.findById(sowId))
                .thenReturn(Optional.of(futureEndDateSOW));

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectCloseRequestService.createCloseRequest(sowId, request, salesRepUser);
        });

        assertEquals("Close request can only be created when the contract end date has passed.", exception.getMessage());
        verify(projectCloseRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCloseRequest - Pending request exists → throw RuntimeException")
    void testCreateCloseRequest_PendingExists() {
        // Arrange
        Integer sowId = 53;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Test message");

        when(sowContractRepository.findById(sowId))
                .thenReturn(Optional.of(activeSOW));
        when(projectCloseRequestRepository.existsBySowIdAndStatus(
                sowId, ProjectCloseRequest.ProjectCloseRequestStatus.Pending))
                .thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            projectCloseRequestService.createCloseRequest(sowId, request, salesRepUser);
        });

        assertEquals("A pending close request already exists for this SOW. Please wait for client response or resubmit the existing request.", exception.getMessage());
        verify(projectCloseRequestRepository, never()).save(any());
    }

    @Test
    @DisplayName("createCloseRequest - valid data → create successfully")
    void testCreateCloseRequest_Success() {
        // Arrange
        Integer sowId = 53;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Thank you for working with us.");
        request.setLinks("https://docs.example.com/handover");

        when(sowContractRepository.findById(sowId))
                .thenReturn(Optional.of(activeSOW));
        when(projectCloseRequestRepository.existsBySowIdAndStatus(
                sowId, ProjectCloseRequest.ProjectCloseRequestStatus.Pending))
                .thenReturn(false);
        when(projectCloseRequestRepository.save(any(ProjectCloseRequest.class)))
                .thenAnswer(invocation -> {
                    ProjectCloseRequest pcr = invocation.getArgument(0);
                    pcr.setId(1);
                    return pcr;
                });
        when(userRepository.findById(salesRepUser.getId()))
                .thenReturn(Optional.of(salesRepUser));

        // Act
        ProjectCloseRequestResponse response = projectCloseRequestService.createCloseRequest(
                sowId, request, salesRepUser);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Project close request created successfully", response.getMessage());
        assertNotNull(response.getData());

        ArgumentCaptor<ProjectCloseRequest> captor = ArgumentCaptor.forClass(ProjectCloseRequest.class);
        verify(projectCloseRequestRepository).save(captor.capture());
        ProjectCloseRequest saved = captor.getValue();

        assertEquals(sowId, saved.getSowId());
        assertEquals(salesRepUser.getId(), saved.getRequestedByUserId());
        assertEquals(ProjectCloseRequest.ProjectCloseRequestStatus.Pending, saved.getStatus());
        assertEquals(request.getMessage(), saved.getMessage());
        assertEquals(request.getLinks(), saved.getLinks());

        // Verify audit log was created
        verify(contractHistoryRepository).save(any(ContractHistory.class));
    }

    @Test
    @DisplayName("approveCloseRequest - Client approves → SOW becomes Completed")
    void testApproveCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        ProjectCloseRequest closeRequest = new ProjectCloseRequest();
        closeRequest.setId(closeRequestId);
        closeRequest.setSowId(53);
        closeRequest.setRequestedByUserId(5);
        closeRequest.setStatus(ProjectCloseRequest.ProjectCloseRequestStatus.Pending);

        when(projectCloseRequestRepository.findById(closeRequestId))
                .thenReturn(Optional.of(closeRequest));
        when(sowContractRepository.findById(53))
                .thenReturn(Optional.of(activeSOW));
        when(projectCloseRequestRepository.save(any(ProjectCloseRequest.class)))
                .thenReturn(closeRequest);
        when(sowContractRepository.save(any(SOWContract.class)))
                .thenReturn(activeSOW);
        when(userRepository.findById(5))
                .thenReturn(Optional.of(salesRepUser));

        // Act
        ProjectCloseRequestResponse response = projectCloseRequestService.approveCloseRequest(
                closeRequestId, clientUser);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Project close request approved. SOW has been marked as completed.", response.getMessage());
        assertEquals("Completed", response.getData().getSowStatus());

        ArgumentCaptor<ProjectCloseRequest> pcrCaptor = ArgumentCaptor.forClass(ProjectCloseRequest.class);
        verify(projectCloseRequestRepository).save(pcrCaptor.capture());
        assertEquals(ProjectCloseRequest.ProjectCloseRequestStatus.ClientApproved, 
                pcrCaptor.getValue().getStatus());

        ArgumentCaptor<SOWContract> sowCaptor = ArgumentCaptor.forClass(SOWContract.class);
        verify(sowContractRepository).save(sowCaptor.capture());
        assertEquals(SOWContract.SOWContractStatus.Completed, sowCaptor.getValue().getStatus());

        verify(contractHistoryRepository).save(any(ContractHistory.class));
    }

    @Test
    @DisplayName("rejectCloseRequest - Client rejects → SOW remains Active")
    void testRejectCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        ProjectCloseRequest closeRequest = new ProjectCloseRequest();
        closeRequest.setId(closeRequestId);
        closeRequest.setSowId(53);
        closeRequest.setRequestedByUserId(5);
        closeRequest.setStatus(ProjectCloseRequest.ProjectCloseRequestStatus.Pending);

        RejectProjectCloseRequestRequest request = new RejectProjectCloseRequestRequest();
        request.setReason("We need additional features.");

        when(projectCloseRequestRepository.findById(closeRequestId))
                .thenReturn(Optional.of(closeRequest));
        when(sowContractRepository.findById(53))
                .thenReturn(Optional.of(activeSOW));
        when(projectCloseRequestRepository.save(any(ProjectCloseRequest.class)))
                .thenReturn(closeRequest);
        when(userRepository.findById(5))
                .thenReturn(Optional.of(salesRepUser));

        // Act
        ProjectCloseRequestResponse response = projectCloseRequestService.rejectCloseRequest(
                closeRequestId, request, clientUser);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Project close request rejected. SOW remains active.", response.getMessage());
        assertEquals("Active", response.getData().getSowStatus());

        ArgumentCaptor<ProjectCloseRequest> captor = ArgumentCaptor.forClass(ProjectCloseRequest.class);
        verify(projectCloseRequestRepository).save(captor.capture());
        ProjectCloseRequest saved = captor.getValue();

        assertEquals(ProjectCloseRequest.ProjectCloseRequestStatus.Rejected, saved.getStatus());
        assertEquals(request.getReason(), saved.getClientRejectReason());

        // SOW should not be saved (remains Active)
        verify(sowContractRepository, never()).save(any(SOWContract.class));
        verify(contractHistoryRepository).save(any(ContractHistory.class));
    }

    @Test
    @DisplayName("resubmitCloseRequest - SalesRep resubmits rejected request → status becomes Pending")
    void testResubmitCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        ProjectCloseRequest closeRequest = new ProjectCloseRequest();
        closeRequest.setId(closeRequestId);
        closeRequest.setSowId(53);
        closeRequest.setRequestedByUserId(5);
        closeRequest.setStatus(ProjectCloseRequest.ProjectCloseRequestStatus.Rejected);
        closeRequest.setMessage("Old message");
        closeRequest.setLinks("Old links");

        ResubmitProjectCloseRequestRequest request = new ResubmitProjectCloseRequestRequest();
        request.setMessage("Updated message");
        request.setLinks("Updated links");

        when(projectCloseRequestRepository.findById(closeRequestId))
                .thenReturn(Optional.of(closeRequest));
        when(projectCloseRequestRepository.save(any(ProjectCloseRequest.class)))
                .thenReturn(closeRequest);
        when(sowContractRepository.findById(53))
                .thenReturn(Optional.of(activeSOW));
        when(userRepository.findById(5))
                .thenReturn(Optional.of(salesRepUser));

        // Act
        ProjectCloseRequestResponse response = projectCloseRequestService.resubmitCloseRequest(
                closeRequestId, request, salesRepUser);

        // Assert
        assertTrue(response.isSuccess());
        assertEquals("Project close request resubmitted successfully", response.getMessage());

        ArgumentCaptor<ProjectCloseRequest> captor = ArgumentCaptor.forClass(ProjectCloseRequest.class);
        verify(projectCloseRequestRepository).save(captor.capture());
        ProjectCloseRequest saved = captor.getValue();

        assertEquals(ProjectCloseRequest.ProjectCloseRequestStatus.Pending, saved.getStatus());
        assertEquals(request.getMessage(), saved.getMessage());
        assertEquals(request.getLinks(), saved.getLinks());

        verify(contractHistoryRepository).save(any(ContractHistory.class));
    }
}

