package com.skillbridge.controller.api.sales;

import com.skillbridge.dto.sales.request.CreateSOWRequest;
import com.skillbridge.dto.sales.request.SubmitReviewRequest;
import com.skillbridge.dto.sales.request.CreateChangeRequestRequest;
import com.skillbridge.dto.sales.response.SOWContractDTO;
import com.skillbridge.dto.sales.response.SOWContractDetailDTO;
import com.skillbridge.dto.sales.response.ChangeRequestsListResponseDTO;
import com.skillbridge.dto.sales.response.ChangeRequestResponseDTO;
import com.skillbridge.dto.sales.response.SalesChangeRequestDetailDTO;
import com.skillbridge.dto.sales.response.CurrentResourcesDTO;
import com.skillbridge.entity.auth.User;
import com.skillbridge.entity.contract.ContractAppendix;
import com.skillbridge.entity.contract.SOWEngagedEngineerBase;
import com.skillbridge.entity.contract.RetainerBillingBase;
import com.skillbridge.entity.contract.CRResourceEvent;
import com.skillbridge.entity.contract.CRBillingEvent;
import java.math.BigDecimal;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.sales.SalesSOWContractService;
import com.skillbridge.service.sales.SOWBaselineService;
import com.skillbridge.service.sales.CREventService;
import com.skillbridge.service.sales.ContractAppendixService;
import com.skillbridge.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalesSOWContractControllerTest {

    @Mock
    private SalesSOWContractService contractService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private SOWBaselineService sowBaselineService;

    @Mock
    private CREventService crEventService;

    @Mock
    private ContractAppendixService contractAppendixService;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private SalesSOWContractController controller;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setEmail("sales@example.com");
        testUser.setFullName("Sales User");
        testUser.setRole("SALES_REP");
    }

    // Helper method to setup authenticated user
    private void setupAuthenticatedUser() {
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
    }

    // Helper method to setup JWT token authentication
    private void setupJwtAuthentication() {
        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn("Bearer valid-token");
        when(jwtTokenProvider.isTokenExpired("valid-token")).thenReturn(false);
        when(jwtTokenProvider.getUsernameFromToken("valid-token")).thenReturn("sales@example.com");
        when(userRepository.findByEmail("sales@example.com")).thenReturn(Optional.of(testUser));
    }

    @Test
    @DisplayName("createSOWContract - success")
    void testCreateSOWContract_Success() {
        setupAuthenticatedUser();
        
        SOWContractDTO responseDTO = new SOWContractDTO();
        responseDTO.setId(1);
        responseDTO.setContractId("SOW-2024-01-01-01");
        
        when(contractService.createSOWContract(any(CreateSOWRequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        
        ArgumentCaptor<CreateSOWRequest> captor = ArgumentCaptor.forClass(CreateSOWRequest.class);
        verify(contractService).createSOWContract(captor.capture(), isNull(), eq(testUser));
        CreateSOWRequest captured = captor.getValue();
        assertEquals("MSA-2024-01", captured.getMsaId());
        assertEquals(1, captured.getClientId());
    }

    @Test
    @DisplayName("createSOWContract - missing assigneeUserId → 400")
    void testCreateSOWContract_MissingAssignee() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                null, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Assignee User ID is required"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - invalid date range → 400")
    void testCreateSOWContract_InvalidDateRange() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-12-31", "2024-01-01", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Effective End date must be on or after Effective Start date"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - note exceeds 500 characters → 400")
    void testCreateSOWContract_NoteTooLong() {
        setupAuthenticatedUser();
        String longNote = "a".repeat(501);

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, longNote, "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Note must not exceed 500 characters"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - scopeSummary exceeds 5000 characters → 400")
    void testCreateSOWContract_ScopeSummaryTooLong() {
        setupAuthenticatedUser();
        String longScopeSummary = "a".repeat(5001);

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", longScopeSummary, "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Scope summary must not exceed 5000 characters"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - invalid engagedEngineers date range → 400")
    void testCreateSOWContract_InvalidEngagedEngineerDateRange() {
        setupAuthenticatedUser();
        
        // Create JSON with invalid date range (end before start)
        String invalidEngagedEngineers = "[{\"engineerId\":1,\"startDate\":\"2024-12-31\",\"endDate\":\"2024-01-01\"}]";

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Retainer", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", null, "Project Name", null,
                null, invalidEngagedEngineers, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("End Date must be on or after Start Date"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - invalid JSON → 400")
    void testCreateSOWContract_InvalidJSON() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, "invalid-json", null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid engagedEngineers JSON"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - unauthenticated → 401")
    void testCreateSOWContract_Unauthenticated() {
        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - unauthorized role → 403")
    void testCreateSOWContract_UnauthorizedRole() {
        testUser.setRole("CLIENT");
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createSOWContract - runtime exception → 400")
    void testCreateSOWContract_RuntimeException() {
        setupAuthenticatedUser();
        
        when(contractService.createSOWContract(any(), any(), any()))
                .thenThrow(new RuntimeException("Validation error"));

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(contractService).createSOWContract(any(), any(), any());
    }

    @Test
    @DisplayName("submitReview - success")
    void testSubmitReview_Success() {
        setupAuthenticatedUser();
        
        SOWContractDTO responseDTO = new SOWContractDTO();
        responseDTO.setId(1);
        
        when(contractService.submitReview(1, "Review notes", "APPROVE", testUser))
                .thenReturn(responseDTO);

        SubmitReviewRequest reviewRequest = new SubmitReviewRequest();
        reviewRequest.setReviewNotes("Review notes");
        reviewRequest.setAction("APPROVE");

        ResponseEntity<?> response = controller.submitReview(1, reviewRequest, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).submitReview(1, "Review notes", "APPROVE", testUser);
    }

    @Test
    @DisplayName("getSOWContractDetail - success")
    void testGetSOWContractDetail_Success() {
        setupAuthenticatedUser();
        
        SOWContractDetailDTO detail = new SOWContractDetailDTO();
        when(contractService.getSOWContractDetail(1, testUser)).thenReturn(detail);

        ResponseEntity<?> response = controller.getSOWContractDetail(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(detail, response.getBody());
        verify(contractService).getSOWContractDetail(1, testUser);
    }

    @Test
    @DisplayName("getSOWContractVersions - success")
    void testGetSOWContractVersions_Success() {
        setupAuthenticatedUser();
        
        List<SOWContractDetailDTO> versions = new ArrayList<>();
        when(contractService.getSOWContractVersions(1, testUser)).thenReturn(versions);

        ResponseEntity<?> response = controller.getSOWContractVersions(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(versions, response.getBody());
        verify(contractService).getSOWContractVersions(1, testUser);
    }

    @Test
    @DisplayName("updateSOWContract - success")
    void testUpdateSOWContract_Success() {
        setupAuthenticatedUser();
        
        SOWContractDTO responseDTO = new SOWContractDTO();
        responseDTO.setId(1);
        
        when(contractService.updateSOWContract(eq(1), any(CreateSOWRequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.updateSOWContract(
                1, null, null, null, null, null, null, null, null, null, null, null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).updateSOWContract(eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("getChangeRequestsForSOW - success")
    void testGetChangeRequestsForSOW_Success() {
        setupAuthenticatedUser();
        
        ChangeRequestsListResponseDTO responseDTO = new ChangeRequestsListResponseDTO();
        when(contractService.getChangeRequestsForSOW(1, 0, 10, testUser)).thenReturn(responseDTO);

        ResponseEntity<?> response = controller.getChangeRequestsForSOW(1, 0, 10, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).getChangeRequestsForSOW(1, 0, 10, testUser);
    }

    @Test
    @DisplayName("createChangeRequestForSOW - success")
    void testCreateChangeRequestForSOW_Success() {
        setupAuthenticatedUser();
        
        ChangeRequestResponseDTO responseDTO = new ChangeRequestResponseDTO();
        responseDTO.setId(1);
        
        when(contractService.createChangeRequestForSOW(eq(1), any(CreateChangeRequestRequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createChangeRequestForSOW(
                1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, null, null, null, 1, "Comment", "submit", null, null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).createChangeRequestForSOW(eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("createChangeRequestForSOW - invalid JSON → 400")
    void testCreateChangeRequestForSOW_InvalidJSON() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createChangeRequestForSOW(
                1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, "invalid-json", null, null, 1, "Comment", "submit", null, null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid engagedEngineers JSON"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("getChangeRequestDetailForSOW - success")
    void testGetChangeRequestDetailForSOW_Success() {
        setupAuthenticatedUser();
        
        SalesChangeRequestDetailDTO detail = new SalesChangeRequestDetailDTO();
        when(contractService.getChangeRequestDetailForSOW(1, 1, testUser)).thenReturn(detail);

        ResponseEntity<?> response = controller.getChangeRequestDetailForSOW(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(detail, response.getBody());
        verify(contractService).getChangeRequestDetailForSOW(1, 1, testUser);
    }

    @Test
    @DisplayName("updateChangeRequestForSOW - success")
    void testUpdateChangeRequestForSOW_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).updateChangeRequestForSOW(eq(1), eq(1), any(CreateChangeRequestRequest.class), isNull(), eq(testUser));

        ResponseEntity<?> response = controller.updateChangeRequestForSOW(
                1, 1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, null, null, null, null, "Comment", null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).updateChangeRequestForSOW(eq(1), eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("submitChangeRequestForSOW - success")
    void testSubmitChangeRequestForSOW_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).submitChangeRequestForSOW(1, 1, 2, testUser);

        ResponseEntity<?> response = controller.submitChangeRequestForSOW(1, 1, 2, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).submitChangeRequestForSOW(1, 1, 2, testUser);
    }

    @Test
    @DisplayName("submitChangeRequestReviewForSOW - success")
    void testSubmitChangeRequestReviewForSOW_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).submitChangeRequestReviewForSOW(1, 1, "APPROVE", "Notes", testUser);

        ResponseEntity<?> response = controller.submitChangeRequestReviewForSOW(1, 1, "APPROVE", "Notes", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).submitChangeRequestReviewForSOW(1, 1, "APPROVE", "Notes", testUser);
    }

    @Test
    @DisplayName("approveChangeRequestForSOW - success")
    void testApproveChangeRequestForSOW_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).approveChangeRequestForSOW(1, 1, "Notes", testUser);

        ResponseEntity<?> response = controller.approveChangeRequestForSOW(1, 1, "Notes", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).approveChangeRequestForSOW(1, 1, "Notes", testUser);
    }

    @Test
    @DisplayName("rejectChangeRequestForSOW - success")
    void testRejectChangeRequestForSOW_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).rejectChangeRequestForSOW(1, 1, "Reason", testUser);

        ResponseEntity<?> response = controller.rejectChangeRequestForSOW(1, 1, "Reason", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).rejectChangeRequestForSOW(1, 1, "Reason", testUser);
    }

    @Test
    @DisplayName("getChangeRequestPreviewForSOW - success")
    void testGetChangeRequestPreviewForSOW_Success() {
        setupAuthenticatedUser();
        
        Map<String, Object> preview = new HashMap<>();
        when(contractService.getChangeRequestPreviewForSOW(1, 1, testUser)).thenReturn(preview);

        ResponseEntity<?> response = controller.getChangeRequestPreviewForSOW(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(preview, response.getBody());
        verify(contractService).getChangeRequestPreviewForSOW(1, 1, testUser);
    }

    @Test
    @DisplayName("getSOWContractBaseline - success")
    void testGetSOWContractBaseline_Success() {
        setupAuthenticatedUser();
        
        List<SOWEngagedEngineerBase> engineers = new ArrayList<>();
        List<RetainerBillingBase> billing = new ArrayList<>();
        when(sowBaselineService.getBaselineResources(1)).thenReturn(engineers);
        when(sowBaselineService.getBaselineBilling(1)).thenReturn(billing);

        ResponseEntity<?> response = controller.getSOWContractBaseline(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(sowBaselineService).getBaselineResources(1);
        verify(sowBaselineService).getBaselineBilling(1);
    }

    @Test
    @DisplayName("getSOWContractCurrentState - success")
    void testGetSOWContractCurrentState_Success() {
        setupAuthenticatedUser();
        
        List<com.skillbridge.service.sales.CREventService.CurrentEngineerState> resources = new ArrayList<>();
        when(crEventService.calculateCurrentResources(1, LocalDate.now())).thenReturn(resources);
        when(crEventService.calculateCurrentBilling(1, LocalDate.now().withDayOfMonth(1))).thenReturn(BigDecimal.valueOf(1000.0));

        ResponseEntity<?> response = controller.getSOWContractCurrentState(1, null, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(crEventService).calculateCurrentResources(1, LocalDate.now());
        verify(crEventService).calculateCurrentBilling(1, LocalDate.now().withDayOfMonth(1));
    }

    @Test
    @DisplayName("getSOWContractCurrentResources - success")
    void testGetSOWContractCurrentResources_Success() {
        setupAuthenticatedUser();
        
        LocalDate asOfDate = LocalDate.of(2024, 6, 15);
        CurrentResourcesDTO responseDTO = new CurrentResourcesDTO();
        when(contractService.getCurrentResources(1, asOfDate, testUser)).thenReturn(responseDTO);

        ResponseEntity<?> response = controller.getSOWContractCurrentResources(1, asOfDate, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).getCurrentResources(1, asOfDate, testUser);
    }

    @Test
    @DisplayName("getSOWContractAppendices - success")
    void testGetSOWContractAppendices_Success() {
        setupAuthenticatedUser();
        
        List<ContractAppendix> appendices = new ArrayList<>();
        when(contractAppendixService.getAppendices(1)).thenReturn(appendices);

        ResponseEntity<?> response = controller.getSOWContractAppendices(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(appendices, response.getBody());
        verify(contractAppendixService).getAppendices(1);
    }

    @Test
    @DisplayName("getSOWContractAppendix - success")
    void testGetSOWContractAppendix_Success() {
        setupAuthenticatedUser();
        
        ContractAppendix appendix = new ContractAppendix();
        appendix.setSowContractId(1);
        when(contractAppendixService.getAppendix(1)).thenReturn(appendix);

        ResponseEntity<?> response = controller.getSOWContractAppendix(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(appendix, response.getBody());
        verify(contractAppendixService).getAppendix(1);
    }

    @Test
    @DisplayName("getSOWContractAppendix - appendix does not belong to contract → 400")
    void testGetSOWContractAppendix_WrongContract() {
        setupAuthenticatedUser();
        
        ContractAppendix appendix = new ContractAppendix();
        appendix.setSowContractId(2); // Different contract ID
        when(contractAppendixService.getAppendix(1)).thenReturn(appendix);

        ResponseEntity<?> response = controller.getSOWContractAppendix(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Appendix does not belong to this contract"));
    }

    @Test
    @DisplayName("signSOWContractAppendix - success")
    void testSignSOWContractAppendix_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractAppendixService).signAppendix(1);

        ResponseEntity<?> response = controller.signSOWContractAppendix(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractAppendixService).signAppendix(1);
    }

    @Test
    @DisplayName("updateBillingDetailPaymentStatus - success")
    void testUpdateBillingDetailPaymentStatus_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).updateBillingDetailPaymentStatus(1, 1, true, "Retainer", testUser);

        ResponseEntity<?> response = controller.updateBillingDetailPaymentStatus(1, 1, true, "Retainer", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).updateBillingDetailPaymentStatus(1, 1, true, "Retainer", testUser);
    }

    @Test
    @DisplayName("getSOWContractEvents - success")
    void testGetSOWContractEvents_Success() {
        setupAuthenticatedUser();
        
        List<CRResourceEvent> resourceEvents = new ArrayList<>();
        List<CRBillingEvent> billingEvents = new ArrayList<>();
        when(crEventService.getResourceEvents(1, LocalDate.now())).thenReturn(resourceEvents);
        when(crEventService.getBillingEvents(1, LocalDate.now().withDayOfMonth(1))).thenReturn(billingEvents);

        ResponseEntity<?> response = controller.getSOWContractEvents(1, null, null, null, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(crEventService).getResourceEvents(1, LocalDate.now());
        verify(crEventService).getBillingEvents(1, LocalDate.now().withDayOfMonth(1));
    }

    @Test
    @DisplayName("createSOWContract - JWT token authentication")
    void testCreateSOWContract_JwtAuthentication() {
        setupJwtAuthentication();
        
        SOWContractDTO responseDTO = new SOWContractDTO();
        responseDTO.setId(1);
        
        when(contractService.createSOWContract(any(CreateSOWRequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createSOWContract(
                "MSA-2024-01", 1, "Fixed Price", "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "Scope summary", "Project Name", 10000.0,
                null, null, null, null, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).createSOWContract(any(), any(), eq(testUser));
    }
}

