package com.skillbridge.controller.api.sales;

import com.skillbridge.dto.sales.request.CreateMSARequest;
import com.skillbridge.dto.sales.request.SubmitReviewRequest;
import com.skillbridge.dto.sales.request.CreateChangeRequestRequest;
import com.skillbridge.dto.sales.response.MSAContractDTO;
import com.skillbridge.dto.sales.response.MSAContractDetailDTO;
import com.skillbridge.dto.sales.response.ChangeRequestResponseDTO;
import com.skillbridge.dto.sales.response.SalesChangeRequestDetailDTO;
import com.skillbridge.entity.auth.User;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.sales.SalesMSAContractService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SalesMSAContractControllerTest {

    @Mock
    private SalesMSAContractService contractService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private SalesMSAContractController controller;

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
    @DisplayName("createMSAContract - success")
    void testCreateMSAContract_Success() {
        setupAuthenticatedUser();
        
        MSAContractDTO responseDTO = new MSAContractDTO();
        responseDTO.setId(1);
        responseDTO.setContractId("MSA-2024-01");
        
        when(contractService.createMSAContract(any(CreateMSARequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        
        ArgumentCaptor<CreateMSARequest> captor = ArgumentCaptor.forClass(CreateMSARequest.class);
        verify(contractService).createMSAContract(captor.capture(), isNull(), eq(testUser));
        CreateMSARequest captured = captor.getValue();
        assertEquals("OPP-001", captured.getOpportunityId());
        assertEquals(1, captured.getClientId());
    }

    @Test
    @DisplayName("createMSAContract - unauthenticated user → 401")
    void testCreateMSAContract_Unauthenticated() {
        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createMSAContract - unauthorized role → 403")
    void testCreateMSAContract_UnauthorizedRole() {
        testUser.setRole("CLIENT");
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createMSAContract - invalid date range → 400")
    void testCreateMSAContract_InvalidDateRange() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-12-31", "2024-01-01", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Effective End date must be on or after Effective Start date"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createMSAContract - note exceeds 500 characters → 400")
    void testCreateMSAContract_NoteTooLong() {
        setupAuthenticatedUser();
        String longNote = "a".repeat(501);

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, longNote, "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Note must not exceed 500 characters"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createMSAContract - invalid date format → 400")
    void testCreateMSAContract_InvalidDateFormat() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "invalid-date", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid date format"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("createMSAContract - runtime exception → 400")
    void testCreateMSAContract_RuntimeException() {
        setupAuthenticatedUser();
        
        when(contractService.createMSAContract(any(), any(), any()))
                .thenThrow(new RuntimeException("Validation error"));

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(contractService).createMSAContract(any(), any(), any());
    }

    @Test
    @DisplayName("createMSAContract - general exception → 500")
    void testCreateMSAContract_GeneralException() {
        setupAuthenticatedUser();
        
        when(contractService.createMSAContract(any(), any(), any()))
                .thenThrow(new Exception("Database error"));

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Failed to create MSA contract"));
        verify(contractService).createMSAContract(any(), any(), any());
    }

    @Test
    @DisplayName("getActiveMSAContracts - success")
    void testGetActiveMSAContracts_Success() {
        setupAuthenticatedUser();
        
        List<MSAContractDTO> contracts = new ArrayList<>();
        MSAContractDTO contract = new MSAContractDTO();
        contract.setId(1);
        contracts.add(contract);
        
        when(contractService.getActiveMSAContracts(testUser)).thenReturn(contracts);

        ResponseEntity<?> response = controller.getActiveMSAContracts(authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(contracts, response.getBody());
        verify(contractService).getActiveMSAContracts(testUser);
    }

    @Test
    @DisplayName("getActiveMSAContracts - unauthenticated → 401")
    void testGetActiveMSAContracts_Unauthenticated() {
        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.getActiveMSAContracts(authentication, httpServletRequest);

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("getMSAContractDetail - success")
    void testGetMSAContractDetail_Success() {
        setupAuthenticatedUser();
        
        MSAContractDetailDTO detail = new MSAContractDetailDTO();
        when(contractService.getMSAContractDetail(1, testUser)).thenReturn(detail);

        ResponseEntity<?> response = controller.getMSAContractDetail(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(detail, response.getBody());
        verify(contractService).getMSAContractDetail(1, testUser);
    }

    @Test
    @DisplayName("getMSAContractDetail - not found → 400")
    void testGetMSAContractDetail_NotFound() {
        setupAuthenticatedUser();
        
        when(contractService.getMSAContractDetail(1, testUser))
                .thenThrow(new RuntimeException("Contract not found"));

        ResponseEntity<?> response = controller.getMSAContractDetail(1, authentication, httpServletRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(contractService).getMSAContractDetail(1, testUser);
    }

    @Test
    @DisplayName("updateMSAContract - success")
    void testUpdateMSAContract_Success() {
        setupAuthenticatedUser();
        
        MSAContractDTO responseDTO = new MSAContractDTO();
        responseDTO.setId(1);
        
        when(contractService.updateMSAContract(eq(1), any(CreateMSARequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.updateMSAContract(
                1, "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Updated note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).updateMSAContract(eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("updateMSAContract - note exceeds 500 characters → 400")
    void testUpdateMSAContract_NoteTooLong() {
        setupAuthenticatedUser();
        String longNote = "a".repeat(501);

        ResponseEntity<?> response = controller.updateMSAContract(
                1, "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, longNote, "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Note must not exceed 500 characters"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("deleteAttachment - success")
    void testDeleteAttachment_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).deleteAttachment(1, "s3-key", testUser);

        ResponseEntity<?> response = controller.deleteAttachment(1, "s3-key", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).deleteAttachment(1, "s3-key", testUser);
    }

    @Test
    @DisplayName("submitReview - success")
    void testSubmitReview_Success() {
        setupAuthenticatedUser();
        
        MSAContractDTO responseDTO = new MSAContractDTO();
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
    @DisplayName("createChangeRequestForMSA - success")
    void testCreateChangeRequestForMSA_Success() {
        setupAuthenticatedUser();
        
        ChangeRequestResponseDTO responseDTO = new ChangeRequestResponseDTO();
        responseDTO.setId(1);
        
        when(contractService.createChangeRequestForMSA(eq(1), any(CreateChangeRequestRequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createChangeRequestForMSA(
                1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, null, null, 1, "Comment", "submit", null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseDTO, response.getBody());
        verify(contractService).createChangeRequestForMSA(eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("createChangeRequestForMSA - invalid JSON → 400")
    void testCreateChangeRequestForMSA_InvalidJSON() {
        setupAuthenticatedUser();

        ResponseEntity<?> response = controller.createChangeRequestForMSA(
                1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, "invalid-json", null, 1, "Comment", "submit", null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Invalid engagedEngineers JSON"));
        verifyNoInteractions(contractService);
    }

    @Test
    @DisplayName("getChangeRequestDetailForMSA - success")
    void testGetChangeRequestDetailForMSA_Success() {
        setupAuthenticatedUser();
        
        SalesChangeRequestDetailDTO detail = new SalesChangeRequestDetailDTO();
        when(contractService.getChangeRequestDetailForMSA(1, 1, testUser)).thenReturn(detail);

        ResponseEntity<?> response = controller.getChangeRequestDetailForMSA(1, 1, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(detail, response.getBody());
        verify(contractService).getChangeRequestDetailForMSA(1, 1, testUser);
    }

    @Test
    @DisplayName("updateChangeRequestForMSA - success")
    void testUpdateChangeRequestForMSA_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).updateChangeRequestForMSA(eq(1), eq(1), any(CreateChangeRequestRequest.class), isNull(), eq(testUser));

        ResponseEntity<?> response = controller.updateChangeRequestForMSA(
                1, 1, "Title", "Add Scope", "Summary", "2024-01-01", "2024-12-31",
                null, null, null, null, "Comment", null,
                authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).updateChangeRequestForMSA(eq(1), eq(1), any(), any(), eq(testUser));
    }

    @Test
    @DisplayName("submitChangeRequestForMSA - success")
    void testSubmitChangeRequestForMSA_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).submitChangeRequestForMSA(1, 1, 2, testUser);

        ResponseEntity<?> response = controller.submitChangeRequestForMSA(1, 1, 2, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).submitChangeRequestForMSA(1, 1, 2, testUser);
    }

    @Test
    @DisplayName("submitChangeRequestReviewForMSA - success")
    void testSubmitChangeRequestReviewForMSA_Success() {
        setupAuthenticatedUser();
        
        doNothing().when(contractService).submitChangeRequestReviewForMSA(1, 1, "APPROVE", "Notes", testUser);

        ResponseEntity<?> response = controller.submitChangeRequestReviewForMSA(1, 1, "APPROVE", "Notes", authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).submitChangeRequestReviewForMSA(1, 1, "APPROVE", "Notes", testUser);
    }

    @Test
    @DisplayName("createMSAContract - JWT token authentication")
    void testCreateMSAContract_JwtAuthentication() {
        setupJwtAuthentication();
        
        MSAContractDTO responseDTO = new MSAContractDTO();
        responseDTO.setId(1);
        
        when(contractService.createMSAContract(any(CreateMSARequest.class), isNull(), eq(testUser)))
                .thenReturn(responseDTO);

        ResponseEntity<?> response = controller.createMSAContract(
                "OPP-001", 1, "2024-01-01", "2024-12-31", "Draft",
                1, "Test note", "USD", "Net 30", "Monthly", "1",
                "Yes", "Client", "Japan", 1, 2, null, null, null,
                null, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        verify(contractService).createMSAContract(any(), any(), eq(testUser));
    }
}

