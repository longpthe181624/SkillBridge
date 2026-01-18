package com.skillbridge.controller.api.sales;

import com.skillbridge.dto.contract.request.CreateProjectCloseRequestRequest;
import com.skillbridge.dto.contract.request.ResubmitProjectCloseRequestRequest;
import com.skillbridge.dto.contract.response.ProjectCloseRequestDetailDTO;
import com.skillbridge.dto.contract.response.ProjectCloseRequestResponse;
import com.skillbridge.entity.auth.User;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.contract.ProjectCloseRequestService;
import com.skillbridge.util.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Unit tests for SalesProjectCloseRequestController
 * Story-41: Project Close Request for SOW Contract
 */
@ExtendWith(MockitoExtension.class)
class SalesProjectCloseRequestControllerTest {

    @Mock
    private ProjectCloseRequestService projectCloseRequestService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private SalesProjectCloseRequestController controller;

    private User salesRepUser;

    @BeforeEach
    void setUp() {
        salesRepUser = new User();
        salesRepUser.setId(5);
        salesRepUser.setEmail("sales@example.com");
        salesRepUser.setFullName("Sale Man");
        salesRepUser.setRole("SALES_REP");
    }

    @Test
    @DisplayName("createCloseRequest - success")
    void testCreateCloseRequest_Success() {
        // Arrange
        Integer sowId = 53;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();
        request.setMessage("Thank you for working with us.");
        request.setLinks("https://docs.example.com/handover");

        ProjectCloseRequestResponse serviceResponse = new ProjectCloseRequestResponse();
        serviceResponse.setSuccess(true);
        serviceResponse.setMessage("Project close request created successfully");

        when(authentication.getPrincipal()).thenReturn("5");
        when(userRepository.findById(5)).thenReturn(Optional.of(salesRepUser));
        when(projectCloseRequestService.createCloseRequest(eq(sowId), any(CreateProjectCloseRequestRequest.class), eq(salesRepUser)))
                .thenReturn(serviceResponse);

        // Act
        ResponseEntity<?> response = controller.createCloseRequest(
                sowId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(projectCloseRequestService).createCloseRequest(eq(sowId), any(CreateProjectCloseRequestRequest.class), eq(salesRepUser));
    }

    @Test
    @DisplayName("createCloseRequest - unauthorized")
    void testCreateCloseRequest_Unauthorized() {
        // Arrange
        Integer sowId = 53;
        CreateProjectCloseRequestRequest request = new CreateProjectCloseRequestRequest();

        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.createCloseRequest(
                sowId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(projectCloseRequestService, never()).createCloseRequest(anyInt(), any(), any());
    }

    @Test
    @DisplayName("resubmitCloseRequest - success")
    void testResubmitCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        ResubmitProjectCloseRequestRequest request = new ResubmitProjectCloseRequestRequest();
        request.setMessage("Updated message");
        request.setLinks("Updated links");

        ProjectCloseRequestResponse serviceResponse = new ProjectCloseRequestResponse();
        serviceResponse.setSuccess(true);
        serviceResponse.setMessage("Project close request resubmitted successfully");

        when(authentication.getPrincipal()).thenReturn("5");
        when(userRepository.findById(5)).thenReturn(Optional.of(salesRepUser));
        when(projectCloseRequestService.resubmitCloseRequest(eq(closeRequestId), any(ResubmitProjectCloseRequestRequest.class), eq(salesRepUser)))
                .thenReturn(serviceResponse);

        // Act
        ResponseEntity<?> response = controller.resubmitCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(projectCloseRequestService).resubmitCloseRequest(eq(closeRequestId), any(ResubmitProjectCloseRequestRequest.class), eq(salesRepUser));
    }

    @Test
    @DisplayName("resubmitCloseRequest - validation error")
    void testResubmitCloseRequest_ValidationError() {
        // Arrange
        Integer closeRequestId = 1;
        ResubmitProjectCloseRequestRequest request = new ResubmitProjectCloseRequestRequest();

        when(authentication.getPrincipal()).thenReturn("5");
        when(userRepository.findById(5)).thenReturn(Optional.of(salesRepUser));
        when(projectCloseRequestService.resubmitCloseRequest(eq(closeRequestId), any(ResubmitProjectCloseRequestRequest.class), eq(salesRepUser)))
                .thenThrow(new RuntimeException("Only rejected close requests can be resubmitted."));

        // Act
        ResponseEntity<?> response = controller.resubmitCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}

