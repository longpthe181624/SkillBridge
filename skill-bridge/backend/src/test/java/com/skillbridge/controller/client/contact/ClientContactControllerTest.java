package com.skillbridge.controller.client.contact;

import com.skillbridge.dto.contact.request.*;
import com.skillbridge.dto.contact.response.*;
import com.skillbridge.entity.auth.User;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.contact.ContactDetailService;
import com.skillbridge.service.contact.ContactListService;
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

@ExtendWith(MockitoExtension.class)
class ClientContactControllerTest {

    @Mock
    private ContactListService contactListService;

    @Mock
    private ContactDetailService contactDetailService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private ClientContactController controller;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
    }

    @Test
    @DisplayName("getContacts - success with authenticated user")
    void testGetContacts_Success() {
        ContactListResponse res = new ContactListResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactListService.getContactsForClient(1, "q", "OPEN", 2, 50))
                .thenReturn(res);

        ResponseEntity<?> response = controller.getContacts(
                "q", "OPEN", 2, 50, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(res, response.getBody());
        verify(contactListService).getContactsForClient(1, "q", "OPEN", 2, 50);
    }

    @Test
    @DisplayName("createContact - success true → 200")
    void testCreateContact_Success() {
        CreateContactRequest req = new CreateContactRequest();
        CreateContactResponse res = new CreateContactResponse();
        res.setSuccess(true);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("5");
        User user5 = new User();
        user5.setId(5);
        when(userRepository.findById(5)).thenReturn(Optional.of(user5));
        when(contactListService.createContact(5, req)).thenReturn(res);

        ResponseEntity<?> response = controller.createContact(req, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(res, response.getBody());
    }

    @Test
    @DisplayName("createContact - success false → 400")
    void testCreateContact_Failure() {
        CreateContactRequest req = new CreateContactRequest();
        CreateContactResponse res = new CreateContactResponse();
        res.setSuccess(false);

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactListService.createContact(1, req)).thenReturn(res);

        ResponseEntity<?> response = controller.createContact(req, authentication, httpServletRequest);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertSame(res, response.getBody());
    }

    @Test
    @DisplayName("getContactDetail - success with authenticated user")
    void testGetContactDetail_Success() {
        ContactDetailDTO dto = new ContactDetailDTO();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactDetailService.getContactDetail(10, 1)).thenReturn(dto);

        ResponseEntity<?> response = controller.getContactDetail(10, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
        verify(contactDetailService).getContactDetail(10, 1);
    }

    @Test
    @DisplayName("addCommunicationLog - success with authenticated user")
    void testAddCommunicationLog_Success() {
        AddLogRequest req = new AddLogRequest();
        req.setMessage("hello");
        CommunicationLogDTO dto = new CommunicationLogDTO();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactDetailService.addCommunicationLog(3, 1, "hello")).thenReturn(dto);

        ResponseEntity<?> response = controller.addCommunicationLog(3, req, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
    }

    @Test
    @DisplayName("addProposalComment - success with authenticated user")
    void testAddProposalComment_Success() {
        CommentRequest req = new CommentRequest();
        req.setMessage("cmt");
        CommentResponse dto = new CommentResponse();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactDetailService.addProposalComment(4, 1, "cmt")).thenReturn(dto);

        ResponseEntity<?> response = controller.addProposalComment(4, req, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
    }

    @Test
    @DisplayName("cancelConsultation - success with authenticated user")
    void testCancelConsultation_Success() {
        CancelRequest req = new CancelRequest();
        req.setReason("no need");
        CancelResponse dto = new CancelResponse();

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactDetailService.cancelConsultation(7, 1, "no need")).thenReturn(dto);

        ResponseEntity<?> response = controller.cancelConsultation(7, req, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
    }

    @Test
    @DisplayName("approveProposal - success with authenticated user")
    void testApproveProposal_Success() {
        ApproveResponse dto = new ApproveResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(contactDetailService.approveProposal(8, 1)).thenReturn(dto);

        ResponseEntity<?> response = controller.approveProposal(8, authentication, httpServletRequest);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(dto, response.getBody());
    }
}


