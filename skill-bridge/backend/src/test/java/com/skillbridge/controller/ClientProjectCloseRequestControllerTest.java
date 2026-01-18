package com.skillbridge.controller;

import com.skillbridge.dto.contract.request.ApproveProjectCloseRequestRequest;
import com.skillbridge.dto.contract.request.RejectProjectCloseRequestRequest;
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
 * Unit tests for ClientProjectCloseRequestController
 * Story-41: Project Close Request for SOW Contract
 */
@ExtendWith(MockitoExtension.class)
class ClientProjectCloseRequestControllerTest {

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
    private ClientProjectCloseRequestController controller;

    private User clientUser;

    @BeforeEach
    void setUp() {
        clientUser = new User();
        clientUser.setId(8);
        clientUser.setEmail("client@example.com");
        clientUser.setFullName("Client User");
        clientUser.setRole("CLIENT");
    }

    @Test
    @DisplayName("getLatestCloseRequest - success")
    void testGetLatestCloseRequest_Success() {
        // Arrange
        Integer sowId = 53;
        ProjectCloseRequestDetailDTO detailDTO = new ProjectCloseRequestDetailDTO();
        detailDTO.setId(1);
        detailDTO.setSowId(sowId);
        detailDTO.setStatus("Pending");

        when(authentication.getPrincipal()).thenReturn("8");
        when(userRepository.findById(8)).thenReturn(Optional.of(clientUser));
        when(projectCloseRequestService.getLatestCloseRequest(eq(sowId), eq(clientUser)))
                .thenReturn(detailDTO);

        // Act
        ResponseEntity<?> response = controller.getLatestCloseRequest(
                sowId, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(projectCloseRequestService).getLatestCloseRequest(eq(sowId), eq(clientUser));
    }

    @Test
    @DisplayName("approveCloseRequest - success")
    void testApproveCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        ApproveProjectCloseRequestRequest request = new ApproveProjectCloseRequestRequest();
        request.setConfirm(true);

        ProjectCloseRequestResponse serviceResponse = new ProjectCloseRequestResponse();
        serviceResponse.setSuccess(true);
        serviceResponse.setMessage("Project close request approved. SOW has been marked as completed.");

        when(authentication.getPrincipal()).thenReturn("8");
        when(userRepository.findById(8)).thenReturn(Optional.of(clientUser));
        when(projectCloseRequestService.approveCloseRequest(eq(closeRequestId), eq(clientUser)))
                .thenReturn(serviceResponse);

        // Act
        ResponseEntity<?> response = controller.approveCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(projectCloseRequestService).approveCloseRequest(eq(closeRequestId), eq(clientUser));
    }

    @Test
    @DisplayName("approveCloseRequest - unauthorized")
    void testApproveCloseRequest_Unauthorized() {
        // Arrange
        Integer closeRequestId = 1;
        ApproveProjectCloseRequestRequest request = new ApproveProjectCloseRequestRequest();

        when(authentication.getPrincipal()).thenReturn(null);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        // Act
        ResponseEntity<?> response = controller.approveCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verify(projectCloseRequestService, never()).approveCloseRequest(anyInt(), any());
    }

    @Test
    @DisplayName("rejectCloseRequest - success")
    void testRejectCloseRequest_Success() {
        // Arrange
        Integer closeRequestId = 1;
        RejectProjectCloseRequestRequest request = new RejectProjectCloseRequestRequest();
        request.setReason("We need additional features.");

        ProjectCloseRequestResponse serviceResponse = new ProjectCloseRequestResponse();
        serviceResponse.setSuccess(true);
        serviceResponse.setMessage("Project close request rejected. SOW remains active.");

        when(authentication.getPrincipal()).thenReturn("8");
        when(userRepository.findById(8)).thenReturn(Optional.of(clientUser));
        when(projectCloseRequestService.rejectCloseRequest(eq(closeRequestId), any(RejectProjectCloseRequestRequest.class), eq(clientUser)))
                .thenReturn(serviceResponse);

        // Act
        ResponseEntity<?> response = controller.rejectCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        verify(projectCloseRequestService).rejectCloseRequest(eq(closeRequestId), any(RejectProjectCloseRequestRequest.class), eq(clientUser));
    }

    @Test
    @DisplayName("rejectCloseRequest - missing reason")
    void testRejectCloseRequest_MissingReason() {
        // Arrange
        Integer closeRequestId = 1;
        RejectProjectCloseRequestRequest request = new RejectProjectCloseRequestRequest();
        // No reason set

        when(authentication.getPrincipal()).thenReturn("8");
        when(userRepository.findById(8)).thenReturn(Optional.of(clientUser));
        when(projectCloseRequestService.rejectCloseRequest(eq(closeRequestId), any(RejectProjectCloseRequestRequest.class), eq(clientUser)))
                .thenThrow(new RuntimeException("Rejection reason is required."));

        // Act
        ResponseEntity<?> response = controller.rejectCloseRequest(
                closeRequestId, request, authentication, httpServletRequest);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
    }
}

