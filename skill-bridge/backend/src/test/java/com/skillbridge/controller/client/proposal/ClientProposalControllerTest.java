package com.skillbridge.controller.client.proposal;

import com.skillbridge.dto.proposal.response.ProposalListResponse;
import com.skillbridge.entity.auth.User;
import com.skillbridge.repository.auth.UserRepository;
import com.skillbridge.service.proposal.ProposalListService;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ClientProposalControllerTest {

    @Mock
    private ProposalListService proposalListService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private Authentication authentication;

    @Mock
    private HttpServletRequest httpServletRequest;

    @InjectMocks
    private ClientProposalController controller;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1);
        testUser.setEmail("test@example.com");
        testUser.setFullName("Test User");
    }

    @Test
    @DisplayName("getProposals - success with authenticated user")
    void testGetProposals_Success() {
        ProposalListResponse res = new ProposalListResponse();
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(proposalListService.getProposalsForClient(1, "q", "OPEN", 2, 50))
                .thenReturn(res);

        ResponseEntity<?> response = controller.getProposals(
                "q", "OPEN", 2, 50, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertSame(res, response.getBody());
        verify(proposalListService).getProposalsForClient(1, "q", "OPEN", 2, 50);
    }

    @Test
    @DisplayName("getProposals - no authenticated user → 401")
    void testGetProposals_NoUser() {
        when(authentication.isAuthenticated()).thenReturn(false);
        when(httpServletRequest.getHeader("Authorization")).thenReturn(null);

        ResponseEntity<?> response = controller.getProposals(
                "q", "OPEN", 2, 50, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        verifyNoInteractions(proposalListService);
    }

    @Test
    @DisplayName("getProposals - exception → trả về emptyResponse 200")
    void testGetProposals_Exception() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getPrincipal()).thenReturn("1");
        when(userRepository.findById(1)).thenReturn(Optional.of(testUser));
        when(proposalListService.getProposalsForClient(1, null, null, 0, 20))
                .thenThrow(new RuntimeException("err"));

        ResponseEntity<?> response = controller.getProposals(
                null, null, 0, 20, authentication, httpServletRequest
        );

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ProposalListResponse body = (ProposalListResponse) response.getBody();
        assertNotNull(body);
        assertNotNull(body.getProposals());
        assertEquals(0, body.getProposals().size());
        assertEquals(0, body.getCurrentPage());
        assertEquals(0, body.getTotalPages());
        assertEquals(0, body.getTotalElements());
    }
}


