package com.skillbridge.controller;

import com.skillbridge.dto.contract.request.CreateChangeRequestRequest;
import com.skillbridge.dto.contract.response.ChangeRequestResponse;
import com.skillbridge.entity.auth.User;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.contract.ChangeRequestService;
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
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientChangeRequestControllerTest {

    @Mock
    private ChangeRequestService changeRequestService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private ClientChangeRequestController controller;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(5);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
    }

    @Test
    @DisplayName("createChangeRequest - success")
    void testCreateChangeRequest_Success() {
        Integer contractId = 10;
        Integer userId = 5;
        String title = "New CR";
        String type = "Add Scope";
        String description = "Desc";
        String reason = "Reason";
        LocalDate start = LocalDate.of(2025, 1, 1);
        LocalDate end = LocalDate.of(2025, 2, 1);
        BigDecimal extraCost = new BigDecimal("1000");
        MultipartFile file = mock(MultipartFile.class);
        List<MultipartFile> attachments = List.of(file);

        ChangeRequestResponse responseObj = new ChangeRequestResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("5");
        when(userRepository.findById(5)).thenReturn(Optional.of(testUser));
        when(changeRequestService.createChangeRequest(eq(contractId), eq(userId), any(CreateChangeRequestRequest.class), eq(attachments)))
                .thenReturn(responseObj);

        ResponseEntity<?> response = controller.createChangeRequest(
                contractId,
                title,
                type,
                description,
                reason,
                start,
                end,
                extraCost,
                attachments,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseObj, response.getBody());

        ArgumentCaptor<CreateChangeRequestRequest> captor = ArgumentCaptor.forClass(CreateChangeRequestRequest.class);
        verify(changeRequestService).createChangeRequest(eq(contractId), eq(userId), captor.capture(), eq(attachments));
        CreateChangeRequestRequest captured = captor.getValue();
        assertEquals(title, captured.getTitle());
        assertEquals(type, captured.getType());
        assertEquals(description, captured.getDescription());
        assertEquals(reason, captured.getReason());
        assertEquals(start, captured.getDesiredStartDate());
        assertEquals(end, captured.getDesiredEndDate());
        assertEquals(extraCost, captured.getExpectedExtraCost());
    }

    @Test
    @DisplayName("createChangeRequest - missing user id -> 401")
    void testCreateChangeRequest_MissingUser() {
        when(authentication.isAuthenticated()).thenReturn(false);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.createChangeRequest(
                1, "t", "type", "desc", "reason",
                LocalDate.now(), LocalDate.now().plusDays(1),
                BigDecimal.TEN,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication required", response.getBody());
        verifyNoInteractions(changeRequestService);
    }

    @Test
    @DisplayName("createChangeRequest - validation error -> 400")
    void testCreateChangeRequest_ValidationError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("2");
        User user2 = new User();
        user2.setId(2);
        when(userRepository.findById(2)).thenReturn(Optional.of(user2));
        when(changeRequestService.createChangeRequest(any(), any(), any(), any()))
                .thenThrow(new IllegalArgumentException("invalid data"));

        ResponseEntity<?> response = controller.createChangeRequest(
                1, "t", "type", "desc", "reason",
                LocalDate.now(), LocalDate.now().plusDays(1),
                BigDecimal.ONE,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Validation error: invalid data", response.getBody());
        verify(changeRequestService).createChangeRequest(any(), any(), any(), any());
    }

    @Test
    @DisplayName("createChangeRequest - unexpected error -> 500")
    void testCreateChangeRequest_InternalError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("2");
        User user2 = new User();
        user2.setId(2);
        when(userRepository.findById(2)).thenReturn(Optional.of(user2));
        when(changeRequestService.createChangeRequest(any(), any(), any(), any()))
                .thenThrow(new RuntimeException("boom"));

        ResponseEntity<?> response = controller.createChangeRequest(
                1, "t", "type", "desc", "reason",
                LocalDate.now(), LocalDate.now().plusDays(1),
                BigDecimal.ONE,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("Failed to create change request: boom"));
        verify(changeRequestService).createChangeRequest(any(), any(), any(), any());
    }

    @Test
    @DisplayName("saveChangeRequestDraft - success")
    void testSaveChangeRequestDraft_Success() {
        Integer contractId = 3;
        Integer userId = 9;
        User user9 = new User();
        user9.setId(9);
        ChangeRequestResponse responseObj = new ChangeRequestResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("9");
        when(userRepository.findById(9)).thenReturn(Optional.of(user9));
        when(changeRequestService.saveChangeRequestDraft(eq(contractId), eq(userId), any(CreateChangeRequestRequest.class), isNull()))
                .thenReturn(responseObj);

        ResponseEntity<?> response = controller.saveChangeRequestDraft(
                contractId,
                "t",
                "type",
                "desc",
                "reason",
                null,
                null,
                null,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(responseObj, response.getBody());
        verify(changeRequestService).saveChangeRequestDraft(eq(contractId), eq(userId), any(CreateChangeRequestRequest.class), isNull());
    }

    @Test
    @DisplayName("saveChangeRequestDraft - missing user id -> 401")
    void testSaveChangeRequestDraft_MissingUser() {
        when(authentication.isAuthenticated()).thenReturn(false);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.saveChangeRequestDraft(
                1,
                "t",
                "type",
                "desc",
                "reason",
                null,
                null,
                null,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals("Authentication required", response.getBody());
        verifyNoInteractions(changeRequestService);
    }

    @Test
    @DisplayName("saveChangeRequestDraft - unexpected error -> 500")
    void testSaveChangeRequestDraft_InternalError() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("2");
        User user2 = new User();
        user2.setId(2);
        when(userRepository.findById(2)).thenReturn(Optional.of(user2));
        when(changeRequestService.saveChangeRequestDraft(any(), any(), any(), any()))
                .thenThrow(new RuntimeException("save error"));

        ResponseEntity<?> response = controller.saveChangeRequestDraft(
                1,
                "t",
                "type",
                "desc",
                "reason",
                null,
                null,
                null,
                null,
                authentication,
                httpServletRequest
        );

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("Failed to save change request draft: save error", response.getBody());
        verify(changeRequestService).saveChangeRequestDraft(any(), any(), any(), any());
    }
}

